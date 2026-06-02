import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { fontSize, fontWeight } from '../tokens/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

type VariantStyle = {
  bg: string;
  hoveredBg: string;
  pressedBg: string;
  textColor: string;
  borderColor: string;
  focusBorderColor: string;
};

const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  primary: {
    bg: colors.primary,
    hoveredBg: colors.primaryDark,
    pressedBg: colors.primaryDark,
    textColor: colors.textInverse,
    borderColor: colors.transparent,
    focusBorderColor: colors.accent,
  },
  secondary: {
    bg: colors.surface,
    hoveredBg: colors.surfaceAlt,
    pressedBg: colors.surfaceAlt,
    textColor: colors.primary,
    borderColor: colors.border,
    focusBorderColor: colors.primary,
  },
  ghost: {
    bg: colors.transparent,
    hoveredBg: colors.surfaceAlt,
    pressedBg: colors.surfaceAlt,
    textColor: colors.primary,
    borderColor: colors.transparent,
    focusBorderColor: colors.primary,
  },
  danger: {
    bg: colors.error,
    hoveredBg: colors.errorDark,
    pressedBg: colors.errorDark,
    textColor: colors.textInverse,
    borderColor: colors.transparent,
    focusBorderColor: colors.error,
  },
};

const SIZE_STYLES: Record<ButtonSize, { paddingH: number; paddingV: number; fs: number }> = {
  sm: { paddingH: spacing[3], paddingV: spacing[1.5], fs: fontSize.sm },
  md: { paddingH: spacing[4], paddingV: spacing[2.5], fs: fontSize.md },
  lg: { paddingH: spacing[6], paddingV: spacing[3], fs: fontSize.lg },
};

// React Native Web extends PressableStateCallbackType with `hovered` and `focused`.
// We cast the state type so we can use those props on web without TS errors.
type PressableState = { pressed: boolean; hovered?: boolean; focused?: boolean };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const vStyle = VARIANT_STYLES[variant];
  const sStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={((state: PressableState) => {
        const hovered = state.hovered === true && !isDisabled;
        const focused = state.focused === true && !isDisabled;
        const pressed = state.pressed && !isDisabled;

        // Pick background: pressed > hovered > default
        let bg = vStyle.bg;
        if (pressed) bg = vStyle.pressedBg;
        else if (hovered) bg = vStyle.hoveredBg;

        // Pick border: focused adds a visible ring
        const borderColor = focused ? vStyle.focusBorderColor : vStyle.borderColor;

        return [
          styles.base,
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: focused ? 2 : 1,
            paddingHorizontal: focused ? sStyle.paddingH - 1 : sStyle.paddingH,
            paddingVertical: focused ? sStyle.paddingV - 1 : sStyle.paddingV,
            opacity: isDisabled ? 0.45 : pressed ? 0.9 : 1,
            alignSelf: fullWidth ? ('stretch' as const) : ('flex-start' as const),
          },
          style,
        ];
      }) as any}
    >
      {loading ? (
        <ActivityIndicator color={vStyle.textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: vStyle.textColor, fontSize: sStyle.fs }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
  },
  label: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});
