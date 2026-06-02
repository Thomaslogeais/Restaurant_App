import type { OrderStatus, OrderAction } from '../db/zod-schemas';

// ---------------------------------------------------------------------------
// Valid transitions
//
//   pending → accepted | cancelled
//   accepted → preparing | cancelled
//   preparing → ready | cancelled
//   ready → completed | cancelled
//   completed → (terminal)
//   cancelled → (terminal)
// ---------------------------------------------------------------------------

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const ACTION_MAP: Record<OrderAction, OrderStatus> = {
  accept: 'accepted',
  start_preparing: 'preparing',
  mark_ready: 'ready',
  complete: 'completed',
  cancel: 'cancelled',
};

export function resolveAction(action: OrderAction): OrderStatus {
  return ACTION_MAP[action];
}

export type TransitionResult =
  | { ok: true; nextStatus: OrderStatus }
  | { ok: false; error: string };

export function applyAction(
  currentStatus: OrderStatus,
  action: OrderAction,
): TransitionResult {
  const nextStatus = resolveAction(action);
  const allowed = TRANSITIONS[currentStatus];

  if (!allowed.includes(nextStatus)) {
    return {
      ok: false,
      error: `Cannot apply action '${action}' — order is '${currentStatus}'. ` +
        `Valid next states: [${allowed.join(', ') || 'none (terminal)'}]`,
    };
  }

  return { ok: true, nextStatus };
}
