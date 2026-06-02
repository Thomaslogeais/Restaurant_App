import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Badge, colors, spacing, fontSize, fontWeight } from '@restaurant/shared';
import { formatCurrency, formatRelativeTime } from '@restaurant/shared';
import type { ListOrders200Item } from '@restaurant/api-client';
import type { BadgeVariant } from '@restaurant/shared';

interface OrderCardProps {
  order: ListOrders200Item;
  onPress: () => void;
}

const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <Card onPress={onPress} shadow="sm" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          {order.customerId ? (
            <Text style={styles.meta}>Customer #{order.customerId}</Text>
          ) : (
            <Text style={styles.meta}>Walk-in</Text>
          )}
        </View>
        <View style={styles.right}>
          <Badge
            label={STATUS_LABEL[order.status] ?? order.status}
            variant={STATUS_BADGE_VARIANT[order.status] ?? 'default'}
          />
          <Text style={styles.total}>
            {order.totalAmount != null ? formatCurrency(order.totalAmount) : '—'}
          </Text>
        </View>
      </View>
      {order.notes ? (
        <Text style={styles.notes} numberOfLines={1}>
          {order.notes}
        </Text>
      ) : null}
      <Text style={styles.time}>
        {order.createdAt ? formatRelativeTime(order.createdAt) : '—'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[1.5],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[1],
  },
  left: {
    flex: 1,
    gap: spacing[0.5],
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  total: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  notes: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing[1],
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing[2],
  },
});
