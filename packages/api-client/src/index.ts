/**
 * @restaurant/api-client — public API barrel
 *
 * Re-exports all generated hooks, fetcher functions, and types.
 * Import from here — never import directly from src/generated/.
 *
 * Generated files live in src/generated/ (committed, never hand-edited).
 * Re-run `pnpm gen:contract` (from repo root) to refresh them.
 */

// Shared response / request types (all operations)
export * from './generated/restaurantAPI.schemas';

// Hooks + fetchers by domain tag
export * from './generated/menu/menu';
export * from './generated/orders/orders';
export * from './generated/customers/customers';
export * from './generated/settings/settings';
export * from './generated/stats/stats';

// Low-level HTTP mutator — exported for path-param endpoints (Orval code-gen limitation)
// See: packages/api-client/src/lib/custom-instance.ts
export { customInstance } from './lib/custom-instance';
export type { ErrorType } from './lib/custom-instance';
