import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  restaurants,
  menuCategories,
  menuItems,
  customers,
  orders,
  orderItems,
  orderingSettings,
  orderStatusEnum,
} from './schema';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Numeric columns in PostgreSQL are returned as strings by the Neon driver
 * to preserve exact decimal precision.  We coerce to number for ergonomic
 * use in API responses — restaurant amounts are well within float precision.
 */
const numericAsNumber = z.coerce.number().nonnegative();

/**
 * Accepts a price as a number (e.g. 12.99) or a decimal string ("12.99").
 * Normalises to a two-decimal string before storing.
 */
const priceInput = z
  .union([
    z.number().nonnegative(),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid price, e.g. "12.99"'),
  ])
  .transform((v) => (typeof v === 'number' ? v.toFixed(2) : v));

// ---------------------------------------------------------------------------
// Restaurants
// ---------------------------------------------------------------------------

export const selectRestaurantSchema = createSelectSchema(restaurants, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const insertRestaurantSchema = createInsertSchema(restaurants, {
  name: (s) => s.min(1, 'Name is required'),
  slug: (s) => s.min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateRestaurantSchema = insertRestaurantSchema.partial();

// ---------------------------------------------------------------------------
// Menu Categories
// ---------------------------------------------------------------------------

export const selectMenuCategorySchema = createSelectSchema(menuCategories, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories, {
  name: (s) => s.min(1, 'Category name is required'),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateMenuCategorySchema = insertMenuCategorySchema
  .partial()
  .omit({ restaurantId: true });

// ---------------------------------------------------------------------------
// Menu Items
// ---------------------------------------------------------------------------

export const selectMenuItemSchema = createSelectSchema(menuItems, {
  price: numericAsNumber,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  name: (s) => s.min(1, 'Item name is required'),
  price: priceInput,
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateMenuItemSchema = insertMenuItemSchema.partial().omit({ restaurantId: true });

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const selectCustomerSchema = createSelectSchema(customers, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const insertCustomerSchema = createInsertSchema(customers, {
  name: (s) => s.min(1, 'Name is required'),
  email: (s) => s.email('A valid email address is required'),
  phone: (s) => s.optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  // Client never submits loyalty points — only updated server-side on order completion
  loyaltyPoints: true,
});

export const updateCustomerSchema = insertCustomerSchema.partial().omit({ restaurantId: true });

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export const selectOrderSchema = createSelectSchema(orders, {
  totalAmount: numericAsNumber,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const selectOrderItemSchema = createSelectSchema(orderItems, {
  unitPrice: numericAsNumber,
  subtotal: numericAsNumber,
});

/** Enriched order detail: includes items and optional customer name. */
export const selectOrderWithItemsSchema = selectOrderSchema.extend({
  items: z.array(
    selectOrderItemSchema.extend({
      menuItem: selectMenuItemSchema
        .pick({ id: true, name: true, imageUrl: true })
        .optional()
        .nullable(),
    }),
  ),
  customer: selectCustomerSchema
    .pick({ id: true, name: true, email: true, phone: true })
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// Create Order Request
// ⚠️  totalAmount is intentionally ABSENT — the server calculates it by
//     summing order_items.subtotal after validating and pricing each item.
// ---------------------------------------------------------------------------

export const createOrderItemRequestSchema = z.object({
  menuItemId: z.number().int().positive('Menu item ID must be a positive integer'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
  specialInstructions: z.string().max(500).optional(),
});

export const createOrderRequestSchema = z.object({
  restaurantId: z.number().int().positive(),
  customerId: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional(),
  items: z
    .array(createOrderItemRequestSchema)
    .min(1, 'An order must contain at least one item'),
});

// ---------------------------------------------------------------------------
// Order Action (state machine)
// POST /orders/:id/actions  { action: "accept" | ... }
// ---------------------------------------------------------------------------

export const ORDER_ACTIONS = [
  'accept',
  'start_preparing',
  'mark_ready',
  'complete',
  'cancel',
] as const;

export type OrderAction = (typeof ORDER_ACTIONS)[number];

export const orderActionSchema = z.object({
  action: z.enum(ORDER_ACTIONS, {
    errorMap: () => ({
      message: `action must be one of: ${ORDER_ACTIONS.join(', ')}`,
    }),
  }),
});

// ---------------------------------------------------------------------------
// Ordering Settings
// ---------------------------------------------------------------------------

export const selectOrderingSettingsSchema = createSelectSchema(orderingSettings, {
  minimumOrderAmount: numericAsNumber,
  updatedAt: z.coerce.date(),
});

/** PUT /ordering-settings/:restaurantId — full replace (upsert) */
export const upsertOrderingSettingsSchema = createInsertSchema(orderingSettings, {
  minimumOrderAmount: priceInput,
}).omit({ id: true, updatedAt: true });

/** PATCH variant for partial updates */
export const updateOrderingSettingsSchema = upsertOrderingSettingsSchema
  .partial()
  .omit({ restaurantId: true });

// ---------------------------------------------------------------------------
// Re-export enum values for use in route definitions without importing schema
// ---------------------------------------------------------------------------

export const ORDER_STATUS_VALUES = orderStatusEnum.enumValues;
export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
