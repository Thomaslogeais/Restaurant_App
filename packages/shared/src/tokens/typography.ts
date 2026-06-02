/**
 * Typography tokens — font sizes, weights, and line heights.
 * All values are unitless numbers (React Native convention).
 */

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const fontFamily = {
  /** System default — no custom font needed for RN compatibility */
  sans: undefined,
  mono: 'Courier New',
} as const;

export const typography = {
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
} as const;
