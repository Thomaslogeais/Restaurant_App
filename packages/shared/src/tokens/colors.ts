/**
 * Color tokens — single source of truth for every color used in the dashboard.
 *
 * Palette → Semantic aliases → Domain-specific (order statuses).
 * Components must import from here; no hardcoded hex values allowed elsewhere.
 */

// ---------------------------------------------------------------------------
// Palette (raw values — prefer semantic aliases below in components)
// ---------------------------------------------------------------------------
const palette = {
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Brand
  navy900: '#0f0f1e',
  navy800: '#1a1a2e',
  navy700: '#16213e',
  navy600: '#0f3460',

  coral500: '#e94560',
  coral600: '#c73652',
  coral400: '#ef6b82',

  // Semantic palette
  green500: '#22c55e',
  green600: '#16a34a',
  green100: '#dcfce7',

  yellow500: '#f59e0b',
  yellow600: '#d97706',
  yellow100: '#fef9c3',

  red500: '#ef4444',
  red600: '#dc2626',
  red100: '#fee2e2',

  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue100: '#dbeafe',

  purple500: '#8b5cf6',
  purple600: '#7c3aed',
  purple100: '#ede9fe',

  teal500: '#14b8a6',
  teal100: '#ccfbf1',
} as const;

// ---------------------------------------------------------------------------
// Semantic aliases
// ---------------------------------------------------------------------------
export const colors = {
  // Brand
  primary: palette.navy800,
  primaryDark: palette.navy900,
  primaryLight: palette.navy700,
  accent: palette.coral500,
  accentDark: palette.coral600,
  accentLight: palette.coral400,

  // Surfaces
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  surfaceElevated: palette.white,

  // Borders
  border: palette.gray200,
  borderStrong: palette.gray300,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textInverse: palette.white,
  textOnAccent: palette.white,

  // Semantic states
  success: palette.green500,
  successBg: palette.green100,
  successDark: palette.green600,

  warning: palette.yellow500,
  warningBg: palette.yellow100,
  warningDark: palette.yellow600,

  error: palette.red500,
  errorBg: palette.red100,
  errorDark: palette.red600,

  info: palette.blue500,
  infoBg: palette.blue100,
  infoDark: palette.blue600,

  // Order status colors
  statusPending: palette.yellow500,
  statusPendingBg: palette.yellow100,

  statusAccepted: palette.blue500,
  statusAcceptedBg: palette.blue100,

  statusPreparing: palette.purple500,
  statusPreparingBg: palette.purple100,

  statusReady: palette.green500,
  statusReadyBg: palette.green100,

  statusCompleted: palette.teal500,
  statusCompletedBg: palette.teal100,

  statusCancelled: palette.red500,
  statusCancelledBg: palette.red100,

  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
