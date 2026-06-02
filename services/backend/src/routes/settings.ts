import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { createDb } from '../db/client';
import * as table from '../db/schema';
import {
  selectOrderingSettingsSchema,
  updateOrderingSettingsSchema,
} from '../db/zod-schemas';
import { errorSchema, Errors } from '../lib/errors';
import type { AppEnv } from '../lib/env';

export const settingsRouter = new OpenAPIHono<AppEnv>();

// ---------------------------------------------------------------------------
// GET /api/settings/:restaurantId
// ---------------------------------------------------------------------------
settingsRouter.openapi(
  createRoute({
    method: 'get',
    path: '/settings/:restaurantId',
    operationId: 'getSettings',
    tags: ['settings'],
    summary: 'Get ordering settings for a restaurant',
    request: {
      params: z.object({
        restaurantId: z.coerce.number().int().positive().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectOrderingSettingsSchema } },
        description: 'Ordering settings',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Settings not found',
      },
    },
  }),
  async (c) => {
    const { restaurantId } = c.req.valid('param');
    const db = createDb(c.env.DATABASE_URL);

    const [row] = await db
      .select()
      .from(table.orderingSettings)
      .where(eq(table.orderingSettings.restaurantId, restaurantId));

    if (!row) return c.json(Errors.notFound('Settings'), 404);
    return c.json(selectOrderingSettingsSchema.parse(row), 200);
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/settings/:restaurantId
// ---------------------------------------------------------------------------
settingsRouter.openapi(
  createRoute({
    method: 'patch',
    path: '/settings/:restaurantId',
    operationId: 'updateSettings',
    tags: ['settings'],
    summary: 'Update ordering settings',
    request: {
      params: z.object({
        restaurantId: z.coerce.number().int().positive(),
      }),
      body: {
        content: { 'application/json': { schema: updateOrderingSettingsSchema } },
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectOrderingSettingsSchema } },
        description: 'Updated ordering settings',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Settings not found',
      },
    },
  }),
  async (c) => {
    const { restaurantId } = c.req.valid('param');
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    const [row] = await db
      .update(table.orderingSettings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(table.orderingSettings.restaurantId, restaurantId))
      .returning();

    if (!row) return c.json(Errors.notFound('Settings'), 404);
    return c.json(selectOrderingSettingsSchema.parse(row), 200);
  },
);
