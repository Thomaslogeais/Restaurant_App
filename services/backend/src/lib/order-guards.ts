/**
 * Pure validation helpers for order creation.
 * Extracted from the route handler so they can be unit-tested without a DB.
 */

/**
 * Returns items whose `available` flag is false (i.e. currently "86'd").
 * @example
 *   findUnavailableItems([{ name:'Burger', available:false }, { name:'Fries', available:true }])
 *   // → [{ name:'Burger', available:false }]
 */
export function findUnavailableItems<T extends { available: boolean; name: string }>(
  items: T[],
): T[] {
  return items.filter((i) => !i.available);
}

/**
 * Returns IDs that were requested but not returned by the DB query,
 * meaning those menu items do not exist.
 */
export function findMissingItemIds(
  requestedIds: number[],
  foundItems: { id: number }[],
): number[] {
  const found = new Set(foundItems.map((i) => i.id));
  return requestedIds.filter((id) => !found.has(id));
}

/**
 * Returns items that are owned by a different restaurant than expected.
 * Prevents cross-restaurant item injection.
 */
export function findWrongRestaurantItems<T extends { restaurantId: number }>(
  items: T[],
  restaurantId: number,
): T[] {
  return items.filter((i) => i.restaurantId !== restaurantId);
}
