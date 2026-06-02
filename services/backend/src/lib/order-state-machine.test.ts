import { describe, it, expect } from 'vitest';
import { applyAction, resolveAction } from './order-state-machine';

// ---------------------------------------------------------------------------
// resolveAction
// ---------------------------------------------------------------------------
describe('resolveAction', () => {
  it('maps accept → accepted', () => expect(resolveAction('accept')).toBe('accepted'));
  it('maps start_preparing → preparing', () => expect(resolveAction('start_preparing')).toBe('preparing'));
  it('maps mark_ready → ready', () => expect(resolveAction('mark_ready')).toBe('ready'));
  it('maps complete → completed', () => expect(resolveAction('complete')).toBe('completed'));
  it('maps cancel → cancelled', () => expect(resolveAction('cancel')).toBe('cancelled'));
});

// ---------------------------------------------------------------------------
// applyAction — valid transitions
// ---------------------------------------------------------------------------
describe('applyAction — valid transitions', () => {
  it('pending + accept → accepted', () => {
    const r = applyAction('pending', 'accept');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('accepted');
  });

  it('pending + cancel → cancelled', () => {
    const r = applyAction('pending', 'cancel');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('cancelled');
  });

  it('accepted + start_preparing → preparing', () => {
    const r = applyAction('accepted', 'start_preparing');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('preparing');
  });

  it('accepted + cancel → cancelled', () => {
    const r = applyAction('accepted', 'cancel');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('cancelled');
  });

  it('preparing + mark_ready → ready', () => {
    const r = applyAction('preparing', 'mark_ready');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('ready');
  });

  it('preparing + cancel → cancelled', () => {
    const r = applyAction('preparing', 'cancel');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('cancelled');
  });

  it('ready + complete → completed', () => {
    const r = applyAction('ready', 'complete');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('completed');
  });

  it('ready + cancel → cancelled', () => {
    const r = applyAction('ready', 'cancel');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.nextStatus).toBe('cancelled');
  });
});

// ---------------------------------------------------------------------------
// applyAction — invalid transitions
// ---------------------------------------------------------------------------
describe('applyAction — invalid transitions', () => {
  it('pending + complete → error', () => {
    const r = applyAction('pending', 'complete');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/complete/);
  });

  it('pending + mark_ready → error', () => {
    expect(applyAction('pending', 'mark_ready').ok).toBe(false);
  });

  it('pending + start_preparing → error', () => {
    expect(applyAction('pending', 'start_preparing').ok).toBe(false);
  });

  it('accepted + complete → error (must prepare first)', () => {
    expect(applyAction('accepted', 'complete').ok).toBe(false);
  });

  it('preparing + accept → error', () => {
    expect(applyAction('preparing', 'accept').ok).toBe(false);
  });

  it('ready + accept → error', () => {
    expect(applyAction('ready', 'accept').ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// applyAction — terminal states (no transitions allowed)
// ---------------------------------------------------------------------------
describe('applyAction — terminal states', () => {
  const terminalActions = ['accept', 'start_preparing', 'mark_ready', 'complete', 'cancel'] as const;

  for (const action of terminalActions) {
    it(`completed + ${action} → error`, () => {
      expect(applyAction('completed', action).ok).toBe(false);
    });

    it(`cancelled + ${action} → error`, () => {
      expect(applyAction('cancelled', action).ok).toBe(false);
    });
  }
});
