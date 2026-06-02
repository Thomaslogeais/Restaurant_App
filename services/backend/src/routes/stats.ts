import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq, sql, count, desc } from 'drizzle-orm';
import { createDb } from '../db/client';
import * as table from '../db/schema';
import type { AppEnv } from '../lib/env';

export const statsRouter = new OpenAPIHono<AppEnv>();

// ---------------------------------------------------------------------------
// Response schema — typed KPIs for the Home screen
// ---------------------------------------------------------------------------
const topItemSchema = z.object({
  menuItemId: z.number().int().openapi({ example: 3 }),
  name: z.string().openapi({ example: 'Grilled Salmon' }),
  totalOrdered: z.number().int().openapi({ example: 42 }),
});

const statsSchema = z.object({
  totalOrders: z.number().int().openapi({ example: 128 }),
  pendingOrders: z.number().int().openapi({ example: 5 }),
  revenue: z.number().nonnegative().openapi({ example: 4820.50 }),
  topItems: z.array(topItemSchema),
});

// ---------------------------------------------------------------------------
// GET /api/stats/:restaurantId
// ---------------------------------------------------------------------------
statsRouter.openapi(
  createRoute({
    method: 'get',
    path: '/stats/:restaurantId',
    operationId: 'getStats',
    tags: ['stats'],
    summary: 'Home screen KPIs for a restaurant',
    description: [
      'Returns total order count, pending orders, total revenue from completed orders,',
      'and the top 5 menu items by quantity ordered.',
      'Always returns 200 with zero values if no data exists yet.',
    ].join(' '),
    request: {
      params: z.object({
        restaurantId: z.coerce.number().int().positive().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: statsSchema } },
        description: 'Restaurant KPIs',
      },
    },
  }),
  async (c) => {
    const { restaurantId } = c.req.valid('param');
    const db = createDb(c.env.DATABASE_URL);

    // Aggregate counts and revenue in one query
    const [agg] = await db
      .select({
        totalOrders: count(table.orders.id),
        pendingOrders: sql<number>`COUNT(*) FILTER (WHERE ${table.orders.status} = 'pending')`,
        revenue: sql<string>`COALESCE(
          SUM(${table.orders.totalAmount}::numeric) FILTER (WHERE ${table.orders.status} = 'completed'),
          0
        )`,
      })
      .from(table.orders)
      .where(eq(table.orders.restaurantId, restaurantId));

    // Top 5 menu items by quantity ordered (across all orders, all time)
    const topItems = await db
      .select({
        menuItemId: table.orderItems.menuItemId,
        name: table.menuItems.name,
        totalOrdered: sql<number>`CAST(SUM(${table.orderItems.quantity}) AS INTEGER)`,
      })
      .from(table.orderItems)
      .innerJoin(table.orders, eq(table.orderItems.orderId, table.orders.id))
      .innerJoin(table.menuItems, eq(table.orderItems.menuItemId, table.menuItems.id))
      .where(eq(table.orders.restaurantId, restaurantId))
      .groupBy(table.orderItems.menuItemId, table.menuItems.name)
      .orderBy(desc(sql`SUM(${table.orderItems.quantity})`))
      .limit(5);

    return c.json(
      statsSchema.parse({
        totalOrders: Number(agg?.totalOrders ?? 0),
        pendingOrders: Number(agg?.pendingOrders ?? 0),
        revenue: parseFloat(agg?.revenue ?? '0'),
        topItems: topItems.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          totalOrdered: Number(i.totalOrdered),
        })),
      }),
      200,
    );
  },
);
