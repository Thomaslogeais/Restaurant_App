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
      // Inject a @generated banner into every output file so editors and
      // reviewers know these files must not be hand-edited.
      override: {
        header: () =>
          [
            '// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY',
            '// Re-generate with: pnpm gen:contract (from repo root)',
            '// Source: services/backend /openapi.json → Orval',
            '// @see packages/api-client/orval.config.ts',
          ].join('\n'),
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
