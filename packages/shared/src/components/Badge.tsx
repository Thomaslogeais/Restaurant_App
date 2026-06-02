import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { fontSize, fontWeight } from '../tokens/typography';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

type BadgeStyle = { bg: string; text: string };

const VARIANT_MAP: Record<BadgeVariant, BadgeStyle> = {
  default: { bg: colors.surfaceAlt, text: colors.textSecondary },
  success: { bg: colors.successBg, text: colors.successDark },
  warning: { bg: colors.warningBg, text: colors.warningDark },
  error: { bg: colors.errorBg, text: colors.errorDark },
  info: { bg: colors.infoBg, text: colors.infoDark },
  pending: { bg: colors.statusPendingBg, text: colors.statusPending },
  accepted: { bg: colors.statusAcceptedBg, text: colors.statusAccepted },
  preparing: { bg: colors.statusPreparingBg, text: colors.statusPreparing },
  ready: { bg: colors.statusReadyBg, text: colors.statusReady },
  completed: { bg: colors.statusCompletedBg, text: colors.statusCompleted },
  cancelled: { bg: colors.statusCancelledBg, text: colors.statusCancelled },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { bg, text } = VARIANT_MAP[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[0.5],
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
