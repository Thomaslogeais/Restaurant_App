/**
 * Seed script — populates the database with realistic demo data.
 *
 * Run from the repo root:
 *   pnpm --filter @restaurant/backend db:seed
 *
 * Requires DATABASE_URL to be set via the root .env file.
 * Copy .env.example → .env and fill in your Neon connection string.
 */
import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { createDb } from './client';
import {
  restaurants,
  menuCategories,
  menuItems,
  customers,
  orders,
  orderItems,
  orderingSettings,
} from './schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set. Copy .env.example → .env and fill it in.');
  process.exit(1);
}

const db = createDb(DATABASE_URL);

async function seed() {
  console.log('🌱  Starting seed...\n');

  // -------------------------------------------------------------------------
  // 0. Reset — truncate all tables AND restart auto-increment sequences.
  //    CASCADE handles FK constraints automatically.
  //    RESTART IDENTITY ensures IDs always start from 1 after a re-seed.
  // -------------------------------------------------------------------------
  console.log('  → Resetting existing data...');
  await db.execute(
    sql`TRUNCATE TABLE
          order_items,
          orders,
          ordering_settings,
          menu_items,
          menu_categories,
          customers,
          restaurants
        RESTART IDENTITY CASCADE`,
  );
  console.log('     ✓ All tables truncated and sequences reset to 1');

  // -------------------------------------------------------------------------
  // 1. Restaurant                                          ← CUSTOMISE HERE
  //    Change name, slug (URL-safe), address and phone.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting restaurant...');
  const [restaurant] = await db
    .insert(restaurants)
    .values({
      name: 'Le Bistrot des Halles',        // ← CUSTOMISE
      slug: 'le-bistrot-des-halles',        // ← CUSTOMISE (lowercase, hyphens only)
      address: '12 Rue Montorgueil, 75001 Paris', // ← CUSTOMISE
      phone: '+33 1 42 36 00 00',           // ← CUSTOMISE
    })
    .returning();

  const rId = restaurant.id;
  console.log(`     ✓ Restaurant #${rId}: ${restaurant.name}`);

  // -------------------------------------------------------------------------
  // 2. Menu categories                                     ← CUSTOMISE HERE
  //    Add / remove / rename categories. Keep position values sequential.
  //    Update the destructured variable names to match what you use below.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting menu categories...');
  const [starters, mains, desserts, beverages] = await db
    .insert(menuCategories)
    .values([
      { restaurantId: rId, name: 'Starters', position: 1 },  // ← CUSTOMISE
      { restaurantId: rId, name: 'Mains', position: 2 },     // ← CUSTOMISE
      { restaurantId: rId, name: 'Desserts', position: 3 },  // ← CUSTOMISE
      { restaurantId: rId, name: 'Beverages', position: 4 }, // ← CUSTOMISE
    ])
    .returning();
  console.log(`     ✓ ${[starters, mains, desserts, beverages].map((c) => c.name).join(', ')}`);

  // -------------------------------------------------------------------------
  // 3. Menu items                                          ← CUSTOMISE HERE
  //    Add / remove / edit items. Required fields per item:
  //      name (string), price ("12.50"), categoryId, available (true/false)
  //    description can be null.
  //    After editing, keep the byName(…) lookups below in sync with names.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting menu items...');
  const insertedItems = await db
    .insert(menuItems)
    .values([
      // --- Starters ---
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Velouté de Champignons',
        description: 'Creamy wild mushroom velouté with herb croutons and a drizzle of truffle oil.',
        price: '9.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Tartare de Saumon',
        description: 'Fresh Atlantic salmon tartare with capers, shallots, and a lemon-dill dressing.',
        price: '10.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Soupe à l\'Oignon',
        description: 'Classic French onion soup with Gruyère croutons, gratinated to perfection.',
        price: '8.50',
        available: true,
      },
      // --- Mains ---
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Confit de Canard',
        description: 'Slow-cooked duck leg confit with Sarladaise potatoes and a crisp green salad.',
        price: '24.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Entrecôte Sauce Bordelaise',
        description: 'Grilled ribeye steak with a rich red wine shallot sauce and crispy frites.',
        price: '29.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Dos de Cabillaud',
        description: 'Pan-seared cod fillet with beurre blanc, seasonal vegetables, and crushed potatoes. (GF)',
        price: '22.00',
        available: true,
      },
      // --- Desserts ---
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Tarte Tatin',
        description: 'Warm upside-down caramelised apple tart served with a dollop of crème fraîche.',
        price: '8.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Mousse au Chocolat',
        description: 'Light and airy dark chocolate mousse made with single-origin Valrhona chocolate. (V)',
        price: '7.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Profiteroles',
        description: 'Golden choux pastry filled with vanilla ice cream and drizzled with warm chocolate sauce.',
        price: '8.50',
        available: true,
      },
      // --- Beverages ---
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'Eau Pétillante (50cl)',
        description: null,
        price: '3.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'Bordeaux Rouge (17cl)',
        description: 'Château de Lastours, smooth and full-bodied with notes of blackcurrant and oak.',
        price: '7.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'Jus de Pomme Pressé',
        description: 'Freshly pressed Normandy apple juice, naturally cloudy and lightly chilled.',
        price: '4.50',
        available: true,
      },
    ])
    .returning();

  const byName = (name: string) => insertedItems.find((i) => i.name === name)!;
  const velout     = byName('Velouté de Champignons');
  const tartare    = byName('Tartare de Saumon');
  const soupeOign  = byName("Soupe à l'Oignon");
  const canard     = byName('Confit de Canard');
  const entrecote  = byName('Entrecôte Sauce Bordelaise');
  const cabillaud  = byName('Dos de Cabillaud');
  const tatinDes   = byName('Tarte Tatin');
  const mousse     = byName('Mousse au Chocolat');
  const profiter   = byName('Profiteroles');
  const eau        = byName('Eau Pétillante (50cl)');
  const bordeaux   = byName('Bordeaux Rouge (17cl)');
  const jus        = byName('Jus de Pomme Pressé');

  console.log(`     ✓ ${insertedItems.length} menu items inserted`);

  // -------------------------------------------------------------------------
  // 4. Customers                                           ← CUSTOMISE HERE
  //    Required: name, email. Optional: phone, loyaltyPoints (default 0).
  //    Update the destructured variables [marie, luca, …] to match.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting customers...');
  const insertedCustomers = await db
    .insert(customers)
    .values([
      {
        restaurantId: rId,
        name: 'Marie-Claire Fontaine',
        email: 'marie-claire.fontaine@example.com',
        phone: '+33 6 12 34 56 78',
        loyaltyPoints: 140,
      },
      {
        restaurantId: rId,
        name: 'Luca Ferreira',
        email: 'luca.ferreira@example.com',
        phone: '+33 6 23 45 67 89',
        loyaltyPoints: 90,
      },
      {
        restaurantId: rId,
        name: 'Camille Rousseau',
        email: 'camille.rousseau@example.com',
        phone: '+33 6 34 56 78 90',
        loyaltyPoints: 215,
      },
      {
        restaurantId: rId,
        name: 'Antoine Lefèvre',
        email: 'antoine.lefevre@example.com',
        phone: '+33 6 45 67 89 01',
        loyaltyPoints: 55,
      },
      {
        restaurantId: rId,
        name: 'Jary Valimamode',
        email: 'jary.valimamode@example.com',
        phone: '+33 6 56 78 90 12',
        loyaltyPoints: 180,
      },
    ])
    .returning();

  const [marie, luca, camille, antoine, jary] = insertedCustomers;
  console.log(`     ✓ ${insertedCustomers.length} customers inserted`);

  // -------------------------------------------------------------------------
  // 5. Orders                                              ← CUSTOMISE HERE
  //    status must be one of: pending | accepted | preparing | ready |
  //                           completed | cancelled
  //    totalAmount MUST equal the sum of the order items in section 6.
  //    Set customerId to null for walk-in / anonymous orders.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting orders...');
  const insertedOrders = await db
    .insert(orders)
    .values([
      // 1. pending — Antoine: Canard + Eau
      {
        restaurantId: rId,
        customerId: antoine.id,
        status: 'pending' as const,
        totalAmount: '27.50',
        notes: 'Table 5',
      },
      // 2. pending — Guest (walk-in): Cabillaud
      {
        restaurantId: rId,
        customerId: null,
        status: 'pending' as const,
        totalAmount: '22.00',
        notes: 'Table 2',
      },
      // 3. accepted — Marie-Claire: Tartare + Entrecôte + Bordeaux
      {
        restaurantId: rId,
        customerId: marie.id,
        status: 'accepted' as const,
        totalAmount: '47.00',
      },
      // 4. preparing — Luca: Soupe à l'Oignon + Canard
      {
        restaurantId: rId,
        customerId: luca.id,
        status: 'preparing' as const,
        totalAmount: '32.50',
      },
      // 5. ready — Camille: Entrecôte + Profiteroles + Eau
      {
        restaurantId: rId,
        customerId: camille.id,
        status: 'ready' as const,
        totalAmount: '41.00',
      },
      // 6. completed — Marie-Claire: Velouté + Mousse au Chocolat + Jus
      {
        restaurantId: rId,
        customerId: marie.id,
        status: 'completed' as const,
        totalAmount: '21.00',
      },
      // 7. completed — Jary: Cabillaud + Tarte Tatin + Bordeaux
      {
        restaurantId: rId,
        customerId: jary.id,
        status: 'completed' as const,
        totalAmount: '37.50',
      },
      // 8. cancelled — Luca: Tartare only (changed mind)
      {
        restaurantId: rId,
        customerId: luca.id,
        status: 'cancelled' as const,
        totalAmount: '10.50',
        notes: 'Customer changed mind',
      },
    ])
    .returning();

  console.log(`     ✓ ${insertedOrders.length} orders inserted`);

  // -------------------------------------------------------------------------
  // 6. Order items                                         ← CUSTOMISE HERE
  //    Each row links an order to a menu item.
  //    unitPrice must match the item's price field.
  //    subtotal = unitPrice × quantity.
  //    Sum of all subtotals for an order must equal that order's totalAmount.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting order items...');
  await db.insert(orderItems).values([
    // Order 1: Antoine — Canard + Eau
    { orderId: insertedOrders[0].id, menuItemId: canard.id,    quantity: 1, unitPrice: '24.00', subtotal: '24.00' },
    { orderId: insertedOrders[0].id, menuItemId: eau.id,       quantity: 1, unitPrice: '3.50',  subtotal: '3.50'  },
    // Order 2: Guest — Cabillaud
    { orderId: insertedOrders[1].id, menuItemId: cabillaud.id, quantity: 1, unitPrice: '22.00', subtotal: '22.00' },
    // Order 3: Marie-Claire — Tartare + Entrecôte + Bordeaux
    { orderId: insertedOrders[2].id, menuItemId: tartare.id,   quantity: 1, unitPrice: '10.50', subtotal: '10.50' },
    { orderId: insertedOrders[2].id, menuItemId: entrecote.id, quantity: 1, unitPrice: '29.00', subtotal: '29.00' },
    { orderId: insertedOrders[2].id, menuItemId: bordeaux.id,  quantity: 1, unitPrice: '7.50',  subtotal: '7.50'  },
    // Order 4: Luca — Soupe + Canard
    { orderId: insertedOrders[3].id, menuItemId: soupeOign.id, quantity: 1, unitPrice: '8.50',  subtotal: '8.50'  },
    { orderId: insertedOrders[3].id, menuItemId: canard.id,    quantity: 1, unitPrice: '24.00', subtotal: '24.00' },
    // Order 5: Camille — Entrecôte + Profiteroles + Eau
    { orderId: insertedOrders[4].id, menuItemId: entrecote.id, quantity: 1, unitPrice: '29.00', subtotal: '29.00' },
    { orderId: insertedOrders[4].id, menuItemId: profiter.id,  quantity: 1, unitPrice: '8.50',  subtotal: '8.50'  },
    { orderId: insertedOrders[4].id, menuItemId: eau.id,       quantity: 1, unitPrice: '3.50',  subtotal: '3.50'  },
    // Order 6: Marie-Claire — Velouté + Mousse + Jus
    { orderId: insertedOrders[5].id, menuItemId: velout.id,    quantity: 1, unitPrice: '9.00',  subtotal: '9.00'  },
    { orderId: insertedOrders[5].id, menuItemId: mousse.id,    quantity: 1, unitPrice: '7.50',  subtotal: '7.50'  },
    { orderId: insertedOrders[5].id, menuItemId: jus.id,       quantity: 1, unitPrice: '4.50',  subtotal: '4.50'  },
    // Order 7: Jary — Cabillaud + Tarte Tatin + Bordeaux
    { orderId: insertedOrders[6].id, menuItemId: cabillaud.id, quantity: 1, unitPrice: '22.00', subtotal: '22.00' },
    { orderId: insertedOrders[6].id, menuItemId: tatinDes.id,  quantity: 1, unitPrice: '8.00',  subtotal: '8.00'  },
    { orderId: insertedOrders[6].id, menuItemId: bordeaux.id,  quantity: 1, unitPrice: '7.50',  subtotal: '7.50'  },
    // Order 8: Luca — Tartare (cancelled)
    { orderId: insertedOrders[7].id, menuItemId: tartare.id,   quantity: 1, unitPrice: '10.50', subtotal: '10.50' },
  ]);
  console.log('     ✓ Order items inserted');

  // -------------------------------------------------------------------------
  // 7. Ordering settings                                   ← CUSTOMISE HERE
  //    orderingEnabled: show/hide the ordering feature in the dashboard
  //    autoAccept: auto-advance pending → accepted on creation
  //    defaultPrepTimeMinutes: shown to staff as a guide
  //    minimumOrderAmount: minimum total ("0.00" to disable)
  //    serviceAvailability: "all" | "dine_in" | "takeaway"
  //    openingHoursNotes: free-text string shown in Settings tab
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting ordering settings...');
  await db.insert(orderingSettings).values({
    restaurantId: rId,
    orderingEnabled: true,
    autoAccept: false,
    defaultPrepTimeMinutes: 20,
    minimumOrderAmount: '10.00',
    serviceAvailability: 'all',
    openingHoursNotes: 'Ouvert du mardi au dimanche, 12h00–14h30 et 19h00–22h30. Fermé le lundi.',
  });
  console.log('     ✓ Ordering settings inserted');

  // -------------------------------------------------------------------------
  // Summary — dynamic so it stays accurate after customisation
  // -------------------------------------------------------------------------
  console.log('\n✅  Seed complete!\n');
  console.log(`   Restaurant  : ${restaurant.name}`);
  console.log(`   Categories  : ${[starters, mains, desserts, beverages].length}`);
  console.log(`   Menu items  : ${insertedItems.length}`);
  console.log(`   Customers   : ${insertedCustomers.length}`);
  console.log(`   Orders      : ${insertedOrders.length}`);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
