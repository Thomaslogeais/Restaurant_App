/**
 * Shared formatters — pure functions with no external dependencies.
 * All outputs are strings ready for display in React Native Text components.
 */

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

/**
 * Format a numeric amount as a euro currency string.
 * @example formatCurrency(12.5) → '€12.50'
 */
export function formatCurrency(amount: number): string {
  if (!isFinite(amount)) return '€0.00';
  return `€${Math.abs(amount).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Date / time
// ---------------------------------------------------------------------------

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Format a date as "Mon D, YYYY".
 * @example formatDate('2026-06-02T10:30:00Z') → 'Jun 2, 2026'
 */
export function formatDate(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format a date as a short time string "HH:MM".
 * @example formatTime('2026-06-02T14:30:00Z') → '14:30'
 */
export function formatTime(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  // Manual formatting guarantees "HH:MM" regardless of runtime locale.
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Human-readable relative time.
 * @example formatRelativeTime('2026-06-02T10:00:00Z') → '2 hours ago'
 */
export function formatRelativeTime(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  return formatDate(d);
}

// ---------------------------------------------------------------------------
// Order domain helpers
// ---------------------------------------------------------------------------

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'In Preparation',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/**
 * Human-readable label for an order status.
 * @example formatOrderStatus('preparing') → 'In Preparation'
 */
export function formatOrderStatus(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

/**
 * Truncate a string to `maxLength` characters with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
