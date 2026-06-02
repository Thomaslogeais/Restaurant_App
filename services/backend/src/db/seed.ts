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
  // 1. Restaurant
  // -------------------------------------------------------------------------
  console.log('  → Inserting restaurant...');
  const [restaurant] = await db
    .insert(restaurants)
    .values({
      name: 'The Garden Table',
      slug: 'the-garden-table',
      address: '42 Orchard Lane, London EC1A 1BB',
      phone: '+44 20 7946 0958',
    })
    .returning();

  const rId = restaurant.id;
  console.log(`     ✓ Restaurant #${rId}: ${restaurant.name}`);

  // -------------------------------------------------------------------------
  // 2. Menu categories
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting menu categories...');
  const [starters, mains, desserts, beverages] = await db
    .insert(menuCategories)
    .values([
      { restaurantId: rId, name: 'Starters', position: 1 },
      { restaurantId: rId, name: 'Mains', position: 2 },
      { restaurantId: rId, name: 'Desserts', position: 3 },
      { restaurantId: rId, name: 'Beverages', position: 4 },
    ])
    .returning();
  console.log(`     ✓ ${[starters, mains, desserts, beverages].map((c) => c.name).join(', ')}`);

  // -------------------------------------------------------------------------
  // 3. Menu items (3 per category, 12 total)
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting menu items...');
  const insertedItems = await db
    .insert(menuItems)
    .values([
      // --- Starters ---
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Burrata & Heirloom Tomatoes',
        description: 'Creamy burrata with vine-ripened tomatoes, basil oil, and sea salt.',
        price: '9.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Crispy Calamari',
        description: 'Lightly fried squid rings with aioli and a squeeze of lemon.',
        price: '8.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: starters.id,
        name: 'Garden Minestrone',
        description: 'Seasonal vegetable soup with crusty sourdough.',
        price: '7.50',
        available: true,
      },
      // --- Mains ---
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon fillet with herb butter, new potatoes, and green beans.',
        price: '22.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Beef Tenderloin',
        description: '200g fillet, peppercorn sauce, dauphinoise potatoes, and wilted spinach.',
        price: '28.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: mains.id,
        name: 'Wild Mushroom Risotto',
        description: 'Arborio rice, mixed wild mushrooms, parmesan, and truffle oil. (V)',
        price: '16.50',
        available: true,
      },
      // --- Desserts ---
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Chocolate Fondant',
        description: 'Warm dark chocolate pudding with vanilla bean ice cream.',
        price: '8.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Seasonal Fruit Tart',
        description: "Crisp pastry shell, crème pâtissière, and today's seasonal fruits.",
        price: '7.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: desserts.id,
        name: 'Crème Brûlée',
        description: 'Classic vanilla custard with a caramelised sugar crust.',
        price: '8.00',
        available: true,
      },
      // --- Beverages ---
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'Sparkling Water (500ml)',
        description: null,
        price: '3.00',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'House Red Wine (175ml)',
        description: 'Côtes du Rhône, smooth and full-bodied.',
        price: '7.50',
        available: true,
      },
      {
        restaurantId: rId,
        categoryId: beverages.id,
        name: 'Freshly Squeezed Orange Juice',
        description: null,
        price: '4.50',
        available: true,
      },
    ])
    .returning();

  const byName = (name: string) => insertedItems.find((i) => i.name === name)!;
  const salmon = byName('Pan-Seared Salmon');
  const beef = byName('Beef Tenderloin');
  const risotto = byName('Wild Mushroom Risotto');
  const burrata = byName('Burrata & Heirloom Tomatoes');
  const calamari = byName('Crispy Calamari');
  const fondant = byName('Chocolate Fondant');
  const fruitTart = byName('Seasonal Fruit Tart');
  const cremeBrulee = byName('Crème Brûlée');
  const water = byName('Sparkling Water (500ml)');
  const wine = byName('House Red Wine (175ml)');
  const oj = byName('Freshly Squeezed Orange Juice');

  console.log(`     ✓ ${insertedItems.length} menu items inserted`);

  // -------------------------------------------------------------------------
  // 4. Customers
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting customers...');
  const insertedCustomers = await db
    .insert(customers)
    .values([
      {
        restaurantId: rId,
        name: 'Sophie Martin',
        email: 'sophie.martin@example.com',
        phone: '+44 7700 900001',
        loyaltyPoints: 120,
      },
      {
        restaurantId: rId,
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+44 7700 900002',
        loyaltyPoints: 85,
      },
      {
        restaurantId: rId,
        name: 'Emma Chen',
        email: 'emma.chen@example.com',
        phone: '+44 7700 900003',
        loyaltyPoints: 200,
      },
      {
        restaurantId: rId,
        name: 'Oliver Patel',
        email: 'oliver.patel@example.com',
        phone: '+44 7700 900004',
        loyaltyPoints: 50,
      },
      {
        restaurantId: rId,
        name: 'Isabelle Dubois',
        email: 'isabelle.dubois@example.com',
        phone: '+44 7700 900005',
        loyaltyPoints: 175,
      },
    ])
    .returning();

  const [sophie, james, emma, oliver, isabelle] = insertedCustomers;
  console.log(`     ✓ ${insertedCustomers.length} customers inserted`);

  // -------------------------------------------------------------------------
  // 5. Orders (8 with mixed statuses)
  //    totalAmount is pre-calculated here since the seed bypasses the API layer.
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting orders...');
  const insertedOrders = await db
    .insert(orders)
    .values([
      // 1. pending — Oliver: Salmon + Water
      {
        restaurantId: rId,
        customerId: oliver.id,
        status: 'pending' as const,
        totalAmount: '25.00',
        notes: 'Table 4',
      },
      // 2. pending — Guest (no customer): Risotto
      {
        restaurantId: rId,
        customerId: null,
        status: 'pending' as const,
        totalAmount: '16.50',
        notes: 'Takeaway',
      },
      // 3. accepted — Sophie: Burrata + Beef + Wine
      {
        restaurantId: rId,
        customerId: sophie.id,
        status: 'accepted' as const,
        totalAmount: '45.00',
      },
      // 4. preparing — James: Calamari + Salmon
      {
        restaurantId: rId,
        customerId: james.id,
        status: 'preparing' as const,
        totalAmount: '30.00',
      },
      // 5. ready — Emma: Beef + Fondant + Water
      {
        restaurantId: rId,
        customerId: emma.id,
        status: 'ready' as const,
        totalAmount: '39.50',
      },
      // 6. completed — Sophie: Risotto + Crème Brûlée + OJ
      {
        restaurantId: rId,
        customerId: sophie.id,
        status: 'completed' as const,
        totalAmount: '29.00',
      },
      // 7. completed — Isabelle: Salmon + Fruit Tart + Wine
      {
        restaurantId: rId,
        customerId: isabelle.id,
        status: 'completed' as const,
        totalAmount: '37.00',
      },
      // 8. cancelled — James: Calamari only
      {
        restaurantId: rId,
        customerId: james.id,
        status: 'cancelled' as const,
        totalAmount: '8.00',
        notes: 'Customer changed mind',
      },
    ])
    .returning();

  console.log(`     ✓ ${insertedOrders.length} orders inserted`);

  // -------------------------------------------------------------------------
  // 6. Order items
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting order items...');
  await db.insert(orderItems).values([
    // Order 1: Oliver — Salmon + Water
    { orderId: insertedOrders[0].id, menuItemId: salmon.id, quantity: 1, unitPrice: '22.00', subtotal: '22.00' },
    { orderId: insertedOrders[0].id, menuItemId: water.id, quantity: 1, unitPrice: '3.00', subtotal: '3.00' },
    // Order 2: Guest — Risotto
    { orderId: insertedOrders[1].id, menuItemId: risotto.id, quantity: 1, unitPrice: '16.50', subtotal: '16.50' },
    // Order 3: Sophie — Burrata + Beef + Wine
    { orderId: insertedOrders[2].id, menuItemId: burrata.id, quantity: 1, unitPrice: '9.50', subtotal: '9.50' },
    { orderId: insertedOrders[2].id, menuItemId: beef.id, quantity: 1, unitPrice: '28.00', subtotal: '28.00' },
    { orderId: insertedOrders[2].id, menuItemId: wine.id, quantity: 1, unitPrice: '7.50', subtotal: '7.50' },
    // Order 4: James — Calamari + Salmon
    { orderId: insertedOrders[3].id, menuItemId: calamari.id, quantity: 1, unitPrice: '8.00', subtotal: '8.00' },
    { orderId: insertedOrders[3].id, menuItemId: salmon.id, quantity: 1, unitPrice: '22.00', subtotal: '22.00' },
    // Order 5: Emma — Beef + Fondant + Water
    { orderId: insertedOrders[4].id, menuItemId: beef.id, quantity: 1, unitPrice: '28.00', subtotal: '28.00' },
    { orderId: insertedOrders[4].id, menuItemId: fondant.id, quantity: 1, unitPrice: '8.50', subtotal: '8.50' },
    { orderId: insertedOrders[4].id, menuItemId: water.id, quantity: 1, unitPrice: '3.00', subtotal: '3.00' },
    // Order 6: Sophie — Risotto + Crème Brûlée + OJ
    { orderId: insertedOrders[5].id, menuItemId: risotto.id, quantity: 1, unitPrice: '16.50', subtotal: '16.50' },
    { orderId: insertedOrders[5].id, menuItemId: cremeBrulee.id, quantity: 1, unitPrice: '8.00', subtotal: '8.00' },
    { orderId: insertedOrders[5].id, menuItemId: oj.id, quantity: 1, unitPrice: '4.50', subtotal: '4.50' },
    // Order 7: Isabelle — Salmon + Fruit Tart + Wine
    { orderId: insertedOrders[6].id, menuItemId: salmon.id, quantity: 1, unitPrice: '22.00', subtotal: '22.00' },
    { orderId: insertedOrders[6].id, menuItemId: fruitTart.id, quantity: 1, unitPrice: '7.50', subtotal: '7.50' },
    { orderId: insertedOrders[6].id, menuItemId: wine.id, quantity: 1, unitPrice: '7.50', subtotal: '7.50' },
    // Order 8: James — Calamari (cancelled)
    { orderId: insertedOrders[7].id, menuItemId: calamari.id, quantity: 1, unitPrice: '8.00', subtotal: '8.00' },
  ]);
  console.log('     ✓ Order items inserted');

  // -------------------------------------------------------------------------
  // 7. Ordering settings
  // -------------------------------------------------------------------------
  console.log('\n  → Inserting ordering settings...');
  await db.insert(orderingSettings).values({
    restaurantId: rId,
    orderingEnabled: true,
    autoAccept: false,
    defaultPrepTimeMinutes: 20,
    minimumOrderAmount: '10.00',
    serviceAvailability: 'all',
    openingHoursNotes: 'Open daily 11:00–22:00. Last orders at 21:30.',
  });
  console.log('     ✓ Ordering settings inserted');

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n✅  Seed complete!\n');
  console.log('   Restaurant  : The Garden Table');
  console.log('   Categories  : 4');
  console.log('   Menu items  : 12');
  console.log('   Customers   : 5');
  console.log('   Orders      : 8 (2 pending, 1 accepted, 1 preparing, 1 ready, 2 completed, 1 cancelled)');
  console.log('   Order items : 18');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
