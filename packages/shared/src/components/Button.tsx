import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
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
  style?: ViewStyle;
}

type VariantStyle = { bg: string; pressedBg: string; textColor: string; borderColor: string };

const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  primary: {
    bg: colors.primary,
    pressedBg: colors.primaryDark,
    textColor: colors.textInverse,
    borderColor: colors.transparent,
  },
  secondary: {
    bg: colors.surface,
    pressedBg: colors.surfaceAlt,
    textColor: colors.primary,
    borderColor: colors.border,
  },
  ghost: {
    bg: colors.transparent,
    pressedBg: colors.surfaceAlt,
    textColor: colors.primary,
    borderColor: colors.transparent,
  },
  danger: {
    bg: colors.error,
    pressedBg: colors.errorDark,
    textColor: colors.textInverse,
    borderColor: colors.transparent,
  },
};

const SIZE_STYLES: Record<ButtonSize, { paddingH: number; paddingV: number; fs: number }> = {
  sm: { paddingH: spacing[3], paddingV: spacing[1.5], fs: fontSize.sm },
  md: { paddingH: spacing[4], paddingV: spacing[2.5], fs: fontSize.md },
  lg: { paddingH: spacing[6], paddingV: spacing[3], fs: fontSize.lg },
};

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
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed && !isDisabled ? vStyle.pressedBg : vStyle.bg,
          borderColor: vStyle.borderColor,
          paddingHorizontal: sStyle.paddingH,
          paddingVertical: sStyle.paddingV,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? ('stretch' as const) : ('flex-start' as const),
        },
        style,
      ]}
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
