import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Enums — database-enforced finite state sets
// ---------------------------------------------------------------------------

/**
 * Order lifecycle states.
 * Transitions are validated server-side in lib/order-state-machine.ts.
 *
 * pending → accepted → preparing → ready → completed
 *    │          │          │          │
 *    └──────────┴──────────┴──────────┴──► cancelled
 */
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'completed',
  'cancelled',
]);

/**
 * Which service types the restaurant supports.
 */
export const serviceAvailabilityEnum = pgEnum('service_availability', [
  'dine_in',
  'takeaway',
  'delivery',
  'all',
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  address: text('address'),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const menuCategories = pgTable('menu_categories', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  /** Display order for menu sections. Lower = shown first. */
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  /** References menu_categories — no hardcoded enum, category is data. */
  categoryId: integer('category_id')
    .notNull()
    .references(() => menuCategories.id),
  name: text('name').notNull(),
  description: text('description'),
  /** Exact decimal: never use float for monetary values. */
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  /** Set to false to 86 (remove) an item from ordering without deleting it. */
  available: boolean('available').notNull().default(true),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customers = pgTable(
  'customers',
  {
    id: serial('id').primaryKey(),
    restaurantId: integer('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    /** Accumulated loyalty points — only updated server-side on order completion. */
    loyaltyPoints: integer('loyalty_points').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    // Email must be unique per restaurant (different restaurants may have the same customer email)
    unique('customers_restaurant_email_unique').on(t.restaurantId, t.email),
  ],
);

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  /** Nullable: restaurant may take guest orders without a CRM record. */
  customerId: integer('customer_id').references(() => customers.id, {
    onDelete: 'set null',
  }),
  status: orderStatusEnum('status').notNull().default('pending'),
  /**
   * Always calculated server-side by summing order_items.subtotal.
   * The client NEVER submits this value — see createOrderRequestSchema in zod-schemas.ts.
   */
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: integer('menu_item_id')
    .notNull()
    .references(() => menuItems.id),
  quantity: integer('quantity').notNull(),
  /** Snapshotted at order creation time — menu price changes don't affect existing orders. */
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text('special_instructions'),
});

export const orderingSettings = pgTable('ordering_settings', {
  id: serial('id').primaryKey(),
  /** One row per restaurant — enforced by unique constraint. */
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' })
    .unique(),
  /** Master switch: if false, the restaurant is not accepting orders. */
  orderingEnabled: boolean('ordering_enabled').notNull().default(true),
  /** If true, incoming orders are automatically moved to 'accepted' without staff action. */
  autoAccept: boolean('auto_accept').notNull().default(false),
  defaultPrepTimeMinutes: integer('default_prep_time_minutes').notNull().default(20),
  minimumOrderAmount: numeric('minimum_order_amount', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),
  serviceAvailability: serviceAvailabilityEnum('service_availability').notNull().default('all'),
  /** Freeform opening hours / availability notes shown to customers. */
  openingHoursNotes: text('opening_hours_notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Relations — used by Drizzle's relational query API (db.query.*)
// ---------------------------------------------------------------------------

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  menuCategories: many(menuCategories),
  menuItems: many(menuItems),
  customers: many(customers),
  orders: many(orders),
  orderingSettings: one(orderingSettings, {
    fields: [restaurants.id],
    references: [orderingSettings.restaurantId],
  }),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuCategories.restaurantId],
    references: [restaurants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  orderItems: many(orderItems),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [customers.restaurantId],
    references: [restaurants.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const orderingSettingsRelations = relations(orderingSettings, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [orderingSettings.restaurantId],
    references: [restaurants.id],
  }),
}));
