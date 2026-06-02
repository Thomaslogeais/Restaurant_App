export * from './formatters';

/**
 * Extracts the human-readable error message sent by the Hono backend.
 *
 * The backend always returns `{ error: string }` for 4xx/5xx responses.
 * Axios wraps this in `AxiosError.response.data`. This helper unwraps it so
 * every `onError` handler can surface the real reason instead of a generic
 * "something went wrong" message.
 *
 * @example
 *   onError: (err) => show(extractApiError(err, 'Failed to create order'), 'error')
 */
export function extractApiError(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (err !== null && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: { error?: unknown } } }).response?.data;
    if (typeof data?.error === 'string' && data.error.length > 0) return data.error;
  }
  return fallback;
}
