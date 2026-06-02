import { describe, it, expect } from 'vitest';
import {
  findUnavailableItems,
  findMissingItemIds,
  findWrongRestaurantItems,
} from './order-guards';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------
const AVAILABLE = { id: 1, name: 'Burger', available: true, restaurantId: 1 };
const UNAVAILABLE = { id: 2, name: 'Truffle Fries', available: false, restaurantId: 1 };
const ALSO_UNAVAILABLE = { id: 3, name: 'Lobster Roll', available: false, restaurantId: 1 };
const OTHER_RESTAURANT = { id: 4, name: 'Pasta', available: true, restaurantId: 99 };

// ---------------------------------------------------------------------------
// findUnavailableItems
// ---------------------------------------------------------------------------
describe('findUnavailableItems', () => {
  it('returns empty array when all items are available', () => {
    expect(findUnavailableItems([AVAILABLE])).toHaveLength(0);
  });

  it('returns the unavailable item when one item is unavailable', () => {
    const result = findUnavailableItems([AVAILABLE, UNAVAILABLE]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Truffle Fries');
  });

  it('returns all unavailable items when multiple items are unavailable', () => {
    const result = findUnavailableItems([AVAILABLE, UNAVAILABLE, ALSO_UNAVAILABLE]);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).toEqual(['Truffle Fries', 'Lobster Roll']);
  });

  it('returns all items if every item is unavailable', () => {
    const result = findUnavailableItems([UNAVAILABLE, ALSO_UNAVAILABLE]);
    expect(result).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(findUnavailableItems([])).toHaveLength(0);
  });

  it('proves that an unavailable item cannot pass the guard', () => {
    // This is the exact check used in POST /api/orders (orders.ts, step 4c)
    const requestedItems = [AVAILABLE, UNAVAILABLE];
    const blocked = findUnavailableItems(requestedItems);
    // The route returns 422 when blocked.length > 0
    expect(blocked.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// findMissingItemIds
// ---------------------------------------------------------------------------
describe('findMissingItemIds', () => {
  it('returns empty array when all requested IDs were found', () => {
    const result = findMissingItemIds([1, 2], [{ id: 1 }, { id: 2 }]);
    expect(result).toHaveLength(0);
  });

  it('returns missing IDs when some items were not found in the DB', () => {
    const result = findMissingItemIds([1, 2, 3], [{ id: 1 }]);
    expect(result).toEqual([2, 3]);
  });

  it('returns all requested IDs if nothing was found', () => {
    const result = findMissingItemIds([10, 20], []);
    expect(result).toEqual([10, 20]);
  });

  it('returns empty array for empty request', () => {
    expect(findMissingItemIds([], [])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// findWrongRestaurantItems
// ---------------------------------------------------------------------------
describe('findWrongRestaurantItems', () => {
  it('returns empty array when all items belong to the restaurant', () => {
    const result = findWrongRestaurantItems([AVAILABLE, UNAVAILABLE], 1);
    expect(result).toHaveLength(0);
  });

  it('returns items that belong to a different restaurant', () => {
    const result = findWrongRestaurantItems([AVAILABLE, OTHER_RESTAURANT], 1);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pasta');
  });

  it('returns all items if none match the restaurant', () => {
    const result = findWrongRestaurantItems([OTHER_RESTAURANT], 1);
    expect(result).toHaveLength(1);
  });

  it('returns empty array when list is empty', () => {
    expect(findWrongRestaurantItems([], 1)).toHaveLength(0);
  });
});
