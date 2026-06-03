import { describe, it, expect } from 'vitest';
import { extractApiError } from './index';

// ---------------------------------------------------------------------------
// extractApiError
//
// This utility is used throughout the dashboard to surface the error message
// returned by the Hono backend ({ error: string }) instead of a generic
// fallback.  It is the critical glue between API errors and UI toasts.
// ---------------------------------------------------------------------------

const DEFAULT_FALLBACK = 'An unexpected error occurred';

// ---------------------------------------------------------------------------
// Happy path — backend error is present and non-empty
// ---------------------------------------------------------------------------
describe('extractApiError — happy path', () => {
  it('returns the error string from response.data.error', () => {
    const err = { response: { data: { error: 'Item is unavailable' } } };
    expect(extractApiError(err)).toBe('Item is unavailable');
  });

  it('uses the provided custom fallback when present but not needed', () => {
    const err = { response: { data: { error: 'Order not found' } } };
    expect(extractApiError(err, 'Custom fallback')).toBe('Order not found');
  });
});

// ---------------------------------------------------------------------------
// Fallback — error field absent or unusable
// ---------------------------------------------------------------------------
describe('extractApiError — fallback cases', () => {
  it('returns fallback when error field is an empty string', () => {
    const err = { response: { data: { error: '' } } };
    expect(extractApiError(err)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback when error field is missing from data', () => {
    const err = { response: { data: {} } };
    expect(extractApiError(err)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback when error field is a number (non-string)', () => {
    const err = { response: { data: { error: 500 } } };
    expect(extractApiError(err)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback when response.data is missing', () => {
    const err = { response: {} };
    expect(extractApiError(err)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback when response is missing entirely', () => {
    const err = { message: 'Network Error' };
    expect(extractApiError(err)).toBe(DEFAULT_FALLBACK);
  });
});

// ---------------------------------------------------------------------------
// Fallback — non-object inputs (null, undefined, string, number)
// ---------------------------------------------------------------------------
describe('extractApiError — non-object inputs', () => {
  it('returns fallback for null', () => {
    expect(extractApiError(null)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback for undefined', () => {
    expect(extractApiError(undefined)).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback for a plain string', () => {
    expect(extractApiError('Something went wrong')).toBe(DEFAULT_FALLBACK);
  });

  it('returns fallback for a number', () => {
    expect(extractApiError(404)).toBe(DEFAULT_FALLBACK);
  });
});

// ---------------------------------------------------------------------------
// Custom fallback
// ---------------------------------------------------------------------------
describe('extractApiError — custom fallback', () => {
  it('uses the provided custom fallback when no error can be extracted', () => {
    expect(extractApiError(null, 'Failed to create order')).toBe('Failed to create order');
  });

  it('ignores the custom fallback when a real error IS present', () => {
    const err = { response: { data: { error: 'Table is full' } } };
    expect(extractApiError(err, 'fallback')).toBe('Table is full');
  });
});
