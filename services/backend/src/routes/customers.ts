import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq, and, asc, sql, count } from 'drizzle-orm';
import { createDb } from '../db/client';
import * as table from '../db/schema';
import {
  selectCustomerSchema,
  insertCustomerSchema,
  updateCustomerSchema,
} from '../db/zod-schemas';
import { errorSchema, Errors } from '../lib/errors';
import type { AppEnv } from '../lib/env';

export const customersRouter = new OpenAPIHono<AppEnv>();

const restaurantQuery = z.object({
  restaurantId: z.coerce.number().int().positive().openapi({ example: 1 }),
});

// ---------------------------------------------------------------------------
// Customer with aggregated stats schema (returned by list + detail)
// ---------------------------------------------------------------------------
const customerWithStatsSchema = selectCustomerSchema.extend({
  orderCount: z.number().int().nonnegative().openapi({ example: 3 }),
  totalSpend: z.number().nonnegative().openapi({ example: 87.50 }),
});

// ---------------------------------------------------------------------------
// GET /api/customers
// ---------------------------------------------------------------------------
customersRouter.openapi(
  createRoute({
    method: 'get',
    path: '/customers',
    operationId: 'listCustomers',
    tags: ['customers'],
    summary: 'List customers with order count and total spend',
    request: { query: restaurantQuery },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(customerWithStatsSchema) } },
        description: 'Customers alphabetically with aggregated stats',
      },
    },
  }),
  async (c) => {
    const { restaurantId } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);

    const rows = await db
      .select({
        id: table.customers.id,
        restaurantId: table.customers.restaurantId,
        name: table.customers.name,
        email: table.customers.email,
        phone: table.customers.phone,
        loyaltyPoints: table.customers.loyaltyPoints,
        createdAt: table.customers.createdAt,
        updatedAt: table.customers.updatedAt,
        orderCount: count(table.orders.id),
        totalSpend: sql<string>`COALESCE(
          SUM(CASE WHEN ${table.orders.status} = 'completed' THEN ${table.orders.totalAmount}::numeric ELSE 0 END),
          0
        )`,
      })
      .from(table.customers)
      .leftJoin(table.orders, eq(table.orders.customerId, table.customers.id))
      .where(eq(table.customers.restaurantId, restaurantId))
      .groupBy(table.customers.id)
      .orderBy(asc(table.customers.name));

    return c.json(
      rows.map((r) =>
        customerWithStatsSchema.parse({
          ...selectCustomerSchema.parse(r),
          orderCount: Number(r.orderCount),
          totalSpend: parseFloat(r.totalSpend),
        }),
      ),
    );
  },
);

// ---------------------------------------------------------------------------
// POST /api/customers
// ---------------------------------------------------------------------------
customersRouter.openapi(
  createRoute({
    method: 'post',
    path: '/customers',
    operationId: 'createCustomer',
    tags: ['customers'],
    summary: 'Create a customer',
    request: {
      body: { content: { 'application/json': { schema: insertCustomerSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: selectCustomerSchema } },
        description: 'Created customer',
      },
      400: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Validation error or duplicate email',
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);
    const [row] = await db.insert(table.customers).values(body).returning();
    return c.json(selectCustomerSchema.parse(row), 201);
  },
);

// ---------------------------------------------------------------------------
// GET /api/customers/:id
// ---------------------------------------------------------------------------
customersRouter.openapi(
  createRoute({
    method: 'get',
    path: '/customers/:id',
    operationId: 'getCustomer',
    tags: ['customers'],
    summary: 'Get customer detail with recent orders',
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: customerWithStatsSchema,
          },
        },
        description: 'Customer with aggregated stats',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Customer not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);

    // Ownership check
    const [customer] = await db
      .select()
      .from(table.customers)
      .where(
        and(
          eq(table.customers.id, id),
          eq(table.customers.restaurantId, restaurantId),
        ),
      );

    if (!customer) return c.json(Errors.notFound('Customer'), 404);

    const [stats] = await db
      .select({
        orderCount: count(table.orders.id),
        totalSpend: sql<string>`COALESCE(
          SUM(CASE WHEN ${table.orders.status} = 'completed' THEN ${table.orders.totalAmount}::numeric ELSE 0 END),
          0
        )`,
      })
      .from(table.orders)
      .where(eq(table.orders.customerId, id));

    return c.json(
      customerWithStatsSchema.parse({
        ...selectCustomerSchema.parse(customer),
        orderCount: Number(stats?.orderCount ?? 0),
        totalSpend: parseFloat(stats?.totalSpend ?? '0'),
      }),
      200,
    );
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/customers/:id
// ---------------------------------------------------------------------------
customersRouter.openapi(
  createRoute({
    method: 'patch',
    path: '/customers/:id',
    operationId: 'updateCustomer',
    tags: ['customers'],
    summary: 'Update a customer',
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
      body: { content: { 'application/json': { schema: updateCustomerSchema } } },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectCustomerSchema } },
        description: 'Updated customer',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Customer not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    const [row] = await db
      .update(table.customers)
      .set({ ...body, updatedAt: new Date() })
      .where(
        and(
          eq(table.customers.id, id),
          eq(table.customers.restaurantId, restaurantId),
        ),
      )
      .returning();

    if (!row) return c.json(Errors.notFound('Customer'), 404);
    return c.json(selectCustomerSchema.parse(row), 200);
  },
);
