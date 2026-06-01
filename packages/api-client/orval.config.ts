import { defineConfig } from 'orval';

/**
 * Orval configuration — generates typed React Query hooks from the backend OpenAPI spec.
 *
 * Generation flow:
 *   services/backend /openapi.json  →  Orval  →  src/generated/  (READ-ONLY, never hand-edit)
 *
 * Usage:
 *   pnpm gen:contract          (from repo root)
 *   pnpm codegen               (from this package)
 *
 * ⚠️  Requires the backend to be running: pnpm dev:backend
 */
export default defineConfig({
  restaurantApi: {
    input: {
      target: 'http://localhost:8787/openapi.json',
    },
    output: {
      target: './src/generated',
      client: 'react-query',
      mode: 'tags-split',
      clean: true,
      override: {
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
