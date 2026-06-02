import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared error response schema
// Used by every route's error responses so Orval generates a consistent type.
// ---------------------------------------------------------------------------

export const errorSchema = z.object({
  error: z.string().openapi({ example: 'Not found' }),
  details: z.array(z.unknown()).optional().openapi({
    description: 'Zod validation issues (present only on 400 responses)',
  }),
});

export type ErrorResponse = z.infer<typeof errorSchema>;

// ---------------------------------------------------------------------------
// Response body helpers — keep error payloads consistent at call sites
// ---------------------------------------------------------------------------

export const Errors = {
  notFound: (resource = 'Resource'): ErrorResponse => ({
    error: `${resource} not found`,
  }),

  forbidden: (message = 'Access denied'): ErrorResponse => ({
    error: message,
  }),

  conflict: (message: string): ErrorResponse => ({
    error: message,
  }),

  unprocessable: (message: string): ErrorResponse => ({
    error: message,
  }),

  internal: (): ErrorResponse => ({
    error: 'Internal server error',
  }),
};
