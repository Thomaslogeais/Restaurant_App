import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatRelativeTime,
  formatOrderStatus,
  truncate,
} from './formatters';

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formats a positive integer', () => {
    expect(formatCurrency(10)).toBe('€10.00');
  });

  it('formats a decimal amount', () => {
    expect(formatCurrency(12.5)).toBe('€12.50');
    expect(formatCurrency(9.99)).toBe('€9.99');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('€0.00');
  });

  it('returns absolute value for negative amounts', () => {
    expect(formatCurrency(-5)).toBe('€5.00');
  });

  it('returns €0.00 for NaN', () => {
    expect(formatCurrency(NaN)).toBe('€0.00');
  });

  it('returns €0.00 for Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('€0.00');
    expect(formatCurrency(-Infinity)).toBe('€0.00');
  });

  it('rounds to 2 decimal places', () => {
    // 1.005 has a known IEEE-754 representation issue; use a value that reliably rounds.
    expect(formatCurrency(1.567)).toBe('€1.57');
    expect(formatCurrency(1.234)).toBe('€1.23');
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('formats a valid ISO string', () => {
    expect(formatDate('2026-06-02T10:00:00.000Z')).toMatch(/Jun 2, 2026/);
  });

  it('formats a Date object', () => {
    const d = new Date(2026, 0, 15); // 15 Jan 2026 local
    expect(formatDate(d)).toMatch(/Jan 15, 2026/);
  });

  it('returns — for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------
describe('formatTime', () => {
  it('returns a HH:MM string for a valid date', () => {
    // We can only check format, not exact value (locale-dependent time zones)
    const result = formatTime('2026-06-02T14:30:00.000Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('returns — for an invalid date', () => {
    expect(formatTime('bad')).toBe('—');
  });
});

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------
describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-02T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for < 60 seconds', () => {
    const d = new Date('2026-06-02T11:59:30.000Z');
    expect(formatRelativeTime(d)).toBe('just now');
  });

  it('returns "1 minute ago" for ~1 minute', () => {
    const d = new Date('2026-06-02T11:58:50.000Z');
    expect(formatRelativeTime(d)).toBe('1 minute ago');
  });

  it('returns "X minutes ago" for multiple minutes', () => {
    const d = new Date('2026-06-02T11:45:00.000Z');
    expect(formatRelativeTime(d)).toBe('15 minutes ago');
  });

  it('returns "1 hour ago" for ~1 hour', () => {
    const d = new Date('2026-06-02T10:55:00.000Z');
    expect(formatRelativeTime(d)).toBe('1 hour ago');
  });

  it('returns "X hours ago" for multiple hours', () => {
    const d = new Date('2026-06-02T08:00:00.000Z');
    expect(formatRelativeTime(d)).toBe('4 hours ago');
  });

  it('returns "X days ago" for multiple days', () => {
    const d = new Date('2026-05-30T12:00:00.000Z');
    expect(formatRelativeTime(d)).toBe('3 days ago');
  });

  it('falls back to formatDate for > 7 days', () => {
    const d = new Date('2026-05-01T12:00:00.000Z');
    const result = formatRelativeTime(d);
    expect(result).toMatch(/May/);
  });

  it('returns — for an invalid date', () => {
    expect(formatRelativeTime('invalid')).toBe('—');
  });
});

// ---------------------------------------------------------------------------
// formatOrderStatus
// ---------------------------------------------------------------------------
describe('formatOrderStatus', () => {
  it('returns human-readable label for known statuses', () => {
    expect(formatOrderStatus('pending')).toBe('Pending');
    expect(formatOrderStatus('accepted')).toBe('Accepted');
    expect(formatOrderStatus('preparing')).toBe('In Preparation');
    expect(formatOrderStatus('ready')).toBe('Ready');
    expect(formatOrderStatus('completed')).toBe('Completed');
    expect(formatOrderStatus('cancelled')).toBe('Cancelled');
  });

  it('passes through unknown statuses', () => {
    expect(formatOrderStatus('unknown_status')).toBe('unknown_status');
  });
});

// ---------------------------------------------------------------------------
// truncate
// ---------------------------------------------------------------------------
describe('truncate', () => {
  it('returns the original string when it is shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string when it equals maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ellipsis when longer than maxLength', () => {
    expect(truncate('hello world', 6)).toBe('hello…');
  });

  it('truncates to 1 character + ellipsis for maxLength 2', () => {
    expect(truncate('abcd', 2)).toBe('a…');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});
