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
      // Path to the spec downloaded by `pnpm gen:contract` (root script).
      // Run `pnpm dev:backend` first, then `pnpm gen:contract` — the root
      // script fetches the live spec via curl before invoking Orval so that
      // Orval always reads a local file (avoids Windows URL-as-path issues).
      target: '../../services/backend/openapi.json',
    },
    output: {
      target: './src/generated',
      client: 'react-query',
      mode: 'tags-split',
      clean: true,
      // Inject a @generated banner into every output file.
      // ⚠️  The trailing empty string is intentional — it adds a newline after the
      //     last comment line so the first generated `import` is on its own line.
      override: {
        // Custom axios instance — reads EXPO_PUBLIC_API_URL, falls back to localhost:8787
        mutator: {
          path: './src/lib/custom-instance.ts',
          name: 'customInstance',
        },
        header: () =>
          [
            '// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY',
            '// Re-generate with: pnpm gen:contract (from repo root)',
            '// Source: services/backend /openapi.json → Orval',
            '// @see packages/api-client/orval.config.ts',
            '', // <-- trailing newline guard
          ].join('\n'),
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
