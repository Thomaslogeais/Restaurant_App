import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Modal,
  Badge,
  Button,
  Skeleton,
  colors,
  spacing,
  fontSize,
  fontWeight,
  useToast,
  extractApiError,
} from '@restaurant/shared';
import { formatCurrency, formatDate, formatTime } from '@restaurant/shared';
import {
  customInstance,
  type GetOrder200,
  type ApplyOrderAction200,
  type ApplyOrderActionBodyAction,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';
import type { BadgeVariant } from '@restaurant/shared';

interface OrderDetailModalProps {
  orderId: number | null;
  onClose: () => void;
}

const STATUS_BADGE: Record<string, BadgeVariant> = {
  pending: 'pending', accepted: 'accepted', preparing: 'preparing',
  ready: 'ready', completed: 'completed', cancelled: 'cancelled',
};

const ACTIONS_FOR_STATUS: Record<string, ApplyOrderActionBodyAction[]> = {
  pending: ['accept', 'cancel'],
  accepted: ['start_preparing', 'cancel'],
  preparing: ['mark_ready', 'cancel'],
  ready: ['complete', 'cancel'],
  completed: [],
  cancelled: [],
};

const ACTION_LABEL: Record<ApplyOrderActionBodyAction, string> = {
  accept: 'Accept',
  start_preparing: 'Start Preparation',
  mark_ready: 'Mark Ready',
  complete: 'Complete',
  cancel: 'Cancel Order',
};

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const qc = useQueryClient();
  const { show } = useToast();

  const queryKey = orderId !== null ? [`/api/orders/${orderId}`, { restaurantId: RESTAURANT_ID }] : null;

  const { data: order, isLoading } = useQuery<GetOrder200>({
    queryKey: queryKey ?? ['order-disabled'],
    queryFn: () =>
      customInstance<GetOrder200>({
        url: `/api/orders/${orderId}`,
        method: 'GET',
        params: { restaurantId: RESTAURANT_ID },
      }),
    enabled: orderId !== null,
  });

  const actionMutation = useMutation<
    ApplyOrderAction200,
    Error,
    { action: ApplyOrderActionBodyAction }
  >({
    mutationFn: ({ action }) =>
      customInstance<ApplyOrderAction200>({
        url: `/api/orders/${orderId}/actions`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { action },
        params: { restaurantId: RESTAURANT_ID },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/orders'] });
      if (queryKey) qc.invalidateQueries({ queryKey });
      show('Order updated', 'success');
      onClose();
    },
    onError: (err) => show(extractApiError(err, 'Failed to update order'), 'error'),
  });

  const availableActions = order ? (ACTIONS_FOR_STATUS[order.status] ?? []) : [];

  return (
    <Modal visible={orderId !== null} onClose={onClose} title={order ? `Order #${order.id}` : 'Order Detail'}>
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <Skeleton width="100%" height={24} />
          <Skeleton width="80%" height={18} />
          <Skeleton width="100%" height={60} />
        </View>
      ) : order ? (
        <View style={styles.content}>
          {/* Status + Total */}
          <View style={styles.headerRow}>
            <Badge label={order.status} variant={STATUS_BADGE[order.status] ?? 'default'} />
            <Text style={styles.total}>
              {order.totalAmount != null ? formatCurrency(order.totalAmount) : '—'}
            </Text>
          </View>

          {/* Customer */}
          {order.customer ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer</Text>
              <Text style={styles.text}>{order.customer.name}</Text>
              <Text style={styles.meta}>{order.customer.email}</Text>
              {order.customer.phone ? (
                <Text style={styles.meta}>{order.customer.phone}</Text>
              ) : null}
            </View>
          ) : null}

          {/* Notes */}
          {order.notes ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.text}>{order.notes}</Text>
            </View>
          ) : null}

          {/* Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.menuItem?.name ?? `Item #${item.menuItemId}`}
                </Text>
                <Text style={styles.itemQty}>×{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {item.subtotal != null ? formatCurrency(item.subtotal) : '—'}
                </Text>
              </View>
            ))}
          </View>

          {/* Created at */}
          {order.createdAt ? (
            <Text style={styles.timestamp}>
              {formatDate(order.createdAt)} {formatTime(order.createdAt)}
            </Text>
          ) : null}

          {/* Actions */}
          {availableActions.length > 0 ? (
            <View style={styles.actions}>
              {availableActions.map((action) => (
                <Button
                  key={action}
                  label={ACTION_LABEL[action]}
                  variant={action === 'cancel' ? 'danger' : 'primary'}
                  onPress={() => actionMutation.mutate({ action })}
                  loading={actionMutation.isPending}
                  fullWidth
                />
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: { gap: spacing[3] },
  content: { gap: spacing[4] },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  section: { gap: spacing[1] },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: { fontSize: fontSize.md, color: colors.textPrimary },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[2],
  },
  itemName: { flex: 1, fontSize: fontSize.sm, color: colors.textPrimary },
  itemQty: { fontSize: fontSize.sm, color: colors.textSecondary },
  itemPrice: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary, minWidth: 48, textAlign: 'right' },
  timestamp: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right' },
  actions: { gap: spacing[2], marginTop: spacing[2] },
});
