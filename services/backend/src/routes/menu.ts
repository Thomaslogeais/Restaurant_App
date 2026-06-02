import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq, and, asc } from 'drizzle-orm';
import { createDb } from '../db/client';
import * as table from '../db/schema';
import {
  selectMenuCategorySchema,
  insertMenuCategorySchema,
  updateMenuCategorySchema,
  selectMenuItemSchema,
  insertMenuItemSchema,
  updateMenuItemSchema,
} from '../db/zod-schemas';
import { errorSchema, Errors } from '../lib/errors';
import type { AppEnv } from '../lib/env';

export const menuRouter = new OpenAPIHono<AppEnv>();

// Reusable query param — most list routes require a restaurantId
const restaurantQuery = z.object({
  restaurantId: z.coerce.number().int().positive().openapi({ example: 1 }),
});

// ---------------------------------------------------------------------------
// GET /api/menu-categories
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'get',
    path: '/menu-categories',
    tags: ['menu'],
    summary: 'List menu categories for a restaurant',
    request: { query: restaurantQuery },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(selectMenuCategorySchema) } },
        description: 'Categories ordered by position',
      },
    },
  }),
  async (c) => {
    const { restaurantId } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);
    const rows = await db
      .select()
      .from(table.menuCategories)
      .where(eq(table.menuCategories.restaurantId, restaurantId))
      .orderBy(asc(table.menuCategories.position));
    return c.json(rows.map((r) => selectMenuCategorySchema.parse(r)));
  },
);

// ---------------------------------------------------------------------------
// POST /api/menu-categories
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'post',
    path: '/menu-categories',
    tags: ['menu'],
    summary: 'Create a menu category',
    request: {
      body: { content: { 'application/json': { schema: insertMenuCategorySchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: selectMenuCategorySchema } },
        description: 'Created category',
      },
      400: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Validation error',
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);
    const [row] = await db.insert(table.menuCategories).values(body).returning();
    return c.json(selectMenuCategorySchema.parse(row), 201);
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/menu-categories/:id
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'patch',
    path: '/menu-categories/:id',
    tags: ['menu'],
    summary: 'Update a menu category',
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
      body: { content: { 'application/json': { schema: updateMenuCategorySchema } } },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectMenuCategorySchema } },
        description: 'Updated category',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Category not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    const [row] = await db
      .update(table.menuCategories)
      .set({ ...body, updatedAt: new Date() })
      .where(
        and(
          eq(table.menuCategories.id, id),
          eq(table.menuCategories.restaurantId, restaurantId),
        ),
      )
      .returning();

    if (!row) return c.json(Errors.notFound('Category'), 404);
    return c.json(selectMenuCategorySchema.parse(row), 200);
  },
);

// ---------------------------------------------------------------------------
// GET /api/menu-items
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'get',
    path: '/menu-items',
    tags: ['menu'],
    summary: 'List menu items for a restaurant',
    request: {
      query: restaurantQuery.extend({
        categoryId: z.coerce.number().int().positive().optional(),
        available: z.enum(['true', 'false']).optional(),
      }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(selectMenuItemSchema) } },
        description: 'Menu items',
      },
    },
  }),
  async (c) => {
    const { restaurantId, categoryId, available } = c.req.valid('query');
    const db = createDb(c.env.DATABASE_URL);

    const conditions = [eq(table.menuItems.restaurantId, restaurantId)];
    if (categoryId !== undefined) conditions.push(eq(table.menuItems.categoryId, categoryId));
    if (available !== undefined) conditions.push(eq(table.menuItems.available, available === 'true'));

    const rows = await db
      .select()
      .from(table.menuItems)
      .where(and(...conditions))
      .orderBy(asc(table.menuItems.name));

    return c.json(rows.map((r) => selectMenuItemSchema.parse(r)));
  },
);

// ---------------------------------------------------------------------------
// POST /api/menu-items
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'post',
    path: '/menu-items',
    tags: ['menu'],
    summary: 'Create a menu item',
    request: {
      body: { content: { 'application/json': { schema: insertMenuItemSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: selectMenuItemSchema } },
        description: 'Created menu item',
      },
      400: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Validation error',
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    // Validate category belongs to the same restaurant
    const [cat] = await db
      .select()
      .from(table.menuCategories)
      .where(
        and(
          eq(table.menuCategories.id, body.categoryId),
          eq(table.menuCategories.restaurantId, body.restaurantId),
        ),
      );
    if (!cat) return c.json(Errors.notFound('Category'), 404 as unknown as 400);

    const [row] = await db.insert(table.menuItems).values(body).returning();
    return c.json(selectMenuItemSchema.parse(row), 201);
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/menu-items/:id
// ---------------------------------------------------------------------------
menuRouter.openapi(
  createRoute({
    method: 'patch',
    path: '/menu-items/:id',
    tags: ['menu'],
    summary: 'Update a menu item (name, price, availability, etc.)',
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      query: restaurantQuery,
      body: { content: { 'application/json': { schema: updateMenuItemSchema } } },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: selectMenuItemSchema } },
        description: 'Updated menu item',
      },
      404: {
        content: { 'application/json': { schema: errorSchema } },
        description: 'Menu item not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const { restaurantId } = c.req.valid('query');
    const body = c.req.valid('json');
    const db = createDb(c.env.DATABASE_URL);

    const [row] = await db
      .update(table.menuItems)
      .set({ ...body, updatedAt: new Date() })
      .where(
        and(
          eq(table.menuItems.id, id),
          eq(table.menuItems.restaurantId, restaurantId),
        ),
      )
      .returning();

    if (!row) return c.json(Errors.notFound('Menu item'), 404);
    return c.json(selectMenuItemSchema.parse(row), 200);
  },
);
