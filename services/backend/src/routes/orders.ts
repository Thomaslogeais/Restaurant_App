import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { createDb } from '../db/client';
import * as table from '../db/schema';
import {
  selectOrderSchema,
  selectOrderWithItemsSchema,
  createOrderRequestSchema,
  orderActionSchema,
  ORDER_STATUS_VALUES,
} from '../db/zod-schemas';
import { errorSchema, Errors } from '../lib/errors';
import { applyAction } from '../lib/order-state-machine';
import type { AppEnv } from '../lib/env';
import type { OrderStatus } from '../db/zod-schemas';

export const ordersRouter = new OpenAPIHono<AppEnv>();

const restaurantQuery = z.object({
  restaurantId: z.coerce.number().int().positive().openapi({ example: 1 }),
});

// ---------------------------------------------------------------------------
// GET /api/orders
// ---------------------------------------------------------------------------
ordersRouter.openapi(
  createRoute({
    method: 'get',
    path: '/orders',
    operationId: 'listOrders',
    tags: ['orders'],
    summary: 'List orders (filterable by status and customer)',
    request: {
      query: restaurantQuery.extend({
        status: z.enum(ORDER_STATUS_VALUES).optional(),
        customerId: z.coerce.number().int().positive().optional(),
      }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(selectOrderSchema) } },
        description: 'Orders newest-first',
      },
    },
  }),
  async (c) => {
    const { restaurantId, status, customerId } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);

    const conditions = [eq(table.orders.restaurantId, restaurantId)];
    if (status) conditions.push(eq(table.orders.status, status));
    if (customerId !== undefined) conditions.push(eq(table.orders.customerId, customerId));

    const rows = await db
      .select()
      .from(table.orders)
      .where(and(...conditions))
      .orderBy(desc(table.orders.createdAt));

    return c.json(rows.map((r) => selectOrderSchema.parse(r)));
  },
);

// ---------------------------------------------------------------------------
// POST /api/orders  (atomic: validate → price → insert order + items)
// ---------------------------------------------------------------------------
ordersRouter.openapi(
  createRoute({
    method: 'post',
    path: '/orders',
    operationId: 'createOrder',
    tags: ['orders'],
    summary: 'Create a new order',
    description: [
      'Validates ordering settings, menu item availability, and restaurant ownership.',
      'Computes all prices server-side — totalAmount is never client-controlled.',
    ].join(' '),
    request: {
      body: { content: { 'application/json': { schema: createOrderRequestSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: selectOrderWithItemsSchema } },
        description: 'Created order with items',
      },
      400: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Validation error',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Menu item or customer not found',
      },
      409: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Ordering is disabled or minimum order amount not met',
      },
      422: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'One or more menu items are unavailable',
      },
    },
  }),
  async (c) => {
    const { restaurantId, customerId, notes, items } = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    // 1. Check ordering settings
    const [settings] = await db
      .select()
      .from(table.orderingSettings)
      .where(eq(table.orderingSettings.restaurantId, restaurantId));

    if (settings && !settings.orderingEnabled) {
      return c.json(Errors.conflict('Ordering is currently disabled for this restaurant'), 409);
    }

    // 2. Validate customer belongs to this restaurant (if provided)
    if (customerId !== undefined) {
      const [customer] = await db
        .select()
        .from(table.customers)
        .where(
          and(
            eq(table.customers.id, customerId),
            eq(table.customers.restaurantId, restaurantId),
          ),
        );
      if (!customer) return c.json(Errors.notFound('Customer'), 404);
    }

    // 3. Fetch all requested menu items in one query
    const menuItemIds = items.map((i) => i.menuItemId);
    const fetchedItems = await db
      .select()
      .from(table.menuItems)
      .where(inArray(table.menuItems.id, menuItemIds));

    // 4a. Verify every requested item exists
    if (fetchedItems.length !== menuItemIds.length) {
      const found = new Set(fetchedItems.map((i) => i.id));
      const missing = menuItemIds.filter((id) => !found.has(id));
      return c.json(
        { error: `Menu item(s) not found: [${missing.join(', ')}]` },
        404,
      );
    }

    // 4b. Verify all items belong to this restaurant
    const wrongRestaurant = fetchedItems.filter((i) => i.restaurantId !== restaurantId);
    if (wrongRestaurant.length > 0) {
      return c.json(Errors.notFound('Menu item'), 404);
    }

    // 4c. Verify all items are available (not 86'd)
    const unavailable = fetchedItems.filter((i) => !i.available);
    if (unavailable.length > 0) {
      return c.json(
        {
          error: `The following items are currently unavailable: ${unavailable.map((i) => i.name).join(', ')}`,
        },
        422,
      );
    }

    // 5. Compute prices (server-side — client never provides amounts)
    const itemMap = new Map(fetchedItems.map((i) => [i.id, i]));
    const pricedItems = items.map((req) => {
      const menuItem = itemMap.get(req.menuItemId)!;
      const unitPrice = parseFloat(menuItem.price);
      const subtotal = unitPrice * req.quantity;
      return {
        menuItemId: req.menuItemId,
        quantity: req.quantity,
        specialInstructions: req.specialInstructions ?? null,
        unitPrice: unitPrice.toFixed(2),
        subtotal: subtotal.toFixed(2),
      };
    });

    const totalAmount = pricedItems
      .reduce((sum, i) => sum + parseFloat(i.subtotal), 0)
      .toFixed(2);

    // 6. Enforce minimum order amount
    if (settings) {
      const minimum = parseFloat(settings.minimumOrderAmount);
      if (minimum > 0 && parseFloat(totalAmount) < minimum) {
        return c.json(
          Errors.conflict(
            `Order total £${totalAmount} is below the minimum of £${minimum.toFixed(2)}`,
          ),
          409,
        );
      }
    }

    // 7. Insert the order
    const [order] = await db
      .insert(table.orders)
      .values({
        restaurantId,
        customerId: customerId ?? null,
        status: 'pending',
        totalAmount,
        notes: notes ?? null,
      })
      .returning();

    // 8. Insert order items (single batch — atomic within Postgres)
    const insertedItems = await db
      .insert(table.orderItems)
      .values(pricedItems.map((item) => ({ ...item, orderId: order.id })))
      .returning();

    // 9. Fetch customer for the response (if linked)
    let customer = null;
    if (order.customerId) {
      const [c2] = await db
        .select()
        .from(table.customers)
        .where(eq(table.customers.id, order.customerId));
      customer = c2 ?? null;
    }

    const response = selectOrderWithItemsSchema.parse({
      ...order,
      items: insertedItems.map((item) => ({
        ...item,
        menuItem: itemMap.get(item.menuItemId) ?? null,
      })),
      customer: customer
        ? { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone }
        : null,
    });

    return c.json(response, 201);
  },
);

// ---------------------------------------------------------------------------
// GET /api/orders/:id
// ---------------------------------------------------------------------------
ordersRouter.openapi(
  createRoute({
    method: 'get',
    path: '/orders/:id',
    operationId: 'getOrder',
    tags: ['orders'],
    summary: 'Get order detail with items and customer',
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectOrderWithItemsSchema } },
        description: 'Order detail',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Order not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);

    // Ownership check: fetch order + items + menu items in separate queries
    const [order] = await db
      .select()
      .from(table.orders)
      .where(and(eq(table.orders.id, id), eq(table.orders.restaurantId, restaurantId)));

    if (!order) return c.json(Errors.notFound('Order'), 404);

    const rawItems = await db
      .select({
        id: table.orderItems.id,
        orderId: table.orderItems.orderId,
        menuItemId: table.orderItems.menuItemId,
        quantity: table.orderItems.quantity,
        unitPrice: table.orderItems.unitPrice,
        subtotal: table.orderItems.subtotal,
        specialInstructions: table.orderItems.specialInstructions,
        menuItemName: table.menuItems.name,
        menuItemImageUrl: table.menuItems.imageUrl,
      })
      .from(table.orderItems)
      .leftJoin(table.menuItems, eq(table.orderItems.menuItemId, table.menuItems.id))
      .where(eq(table.orderItems.orderId, id));

    let customer = null;
    if (order.customerId) {
      const [c2] = await db
        .select()
        .from(table.customers)
        .where(eq(table.customers.id, order.customerId));
      customer = c2 ?? null;
    }

    const response = selectOrderWithItemsSchema.parse({
      ...order,
      items: rawItems.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
        specialInstructions: i.specialInstructions,
        menuItem: i.menuItemName
          ? { id: i.menuItemId, name: i.menuItemName, imageUrl: i.menuItemImageUrl }
          : null,
      })),
      customer: customer
        ? { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone }
        : null,
    });

    return c.json(response, 200);
  },
);

// ---------------------------------------------------------------------------
// POST /api/orders/:id/actions  (state machine)
// ---------------------------------------------------------------------------
ordersRouter.openapi(
  createRoute({
    method: 'post',
    path: '/orders/:id/actions',
    operationId: 'applyOrderAction',
    tags: ['orders'],
    summary: 'Transition order status via a named action',
    description: [
      'Valid actions: accept, start_preparing, mark_ready, complete, cancel.',
      'Transitions are validated server-side — invalid transitions return 422.',
    ].join(' '),
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
      body: { content: { 'application/json': { schema: orderActionSchema } } },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectOrderSchema } },
        description: 'Updated order',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Order not found',
      },
      422: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Invalid state transition',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const { action } = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    // Ownership check
    const [order] = await db
      .select()
      .from(table.orders)
      .where(and(eq(table.orders.id, id), eq(table.orders.restaurantId, restaurantId)));

    if (!order) return c.json(Errors.notFound('Order'), 404);

    // Validate state transition
    const result = applyAction(order.status as OrderStatus, action);
    if (!result.ok) return c.json(Errors.unprocessable(result.error), 422);

    // Apply transition
    const [updated] = await db
      .update(table.orders)
      .set({ status: result.nextStatus, updatedAt: new Date() })
      .where(eq(table.orders.id, id))
      .returning();

    return c.json(selectOrderSchema.parse(updated), 200);
  },
);
