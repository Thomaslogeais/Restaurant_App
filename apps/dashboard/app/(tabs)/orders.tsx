import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import {
  LoadingSpinner,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radius,
} from '@restaurant/shared';
import {
  useListOrders,
  type ListOrdersStatus,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';
import { FilterTabs } from '../components/FilterTabs';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { CreateOrderModal } from '../components/CreateOrderModal';

type FilterValue = ListOrdersStatus | 'all';

export default function OrdersScreen() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const listParams =
    filter === 'all'
      ? { restaurantId: RESTAURANT_ID }
      : { restaurantId: RESTAURANT_ID, status: filter };

  const { data: orders, isLoading, isError, refetch } = useListOrders(listParams);

  return (
    <View style={styles.screen}>
      <FilterTabs value={filter} onChange={setFilter} />

      {/* Sub-header: count + create button */}
      <View style={styles.subHeader}>
        <Text style={styles.count}>
          {isLoading ? '…' : `${orders?.length ?? 0} order${orders?.length !== 1 ? 's' : ''}`}
        </Text>
        <Pressable
          onPress={() => setShowCreate(true)}
          accessibilityRole="button"
          accessibilityLabel="Create new order"
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Text style={styles.addBtnText}>+ New Order</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner fullscreen />
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Could not load orders"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: refetch }}
        />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No orders"
          description={
            filter !== 'all'
              ? `No ${filter} orders found. Try a different filter.`
              : 'New orders will appear here.'
          }
          action={{ label: '+ New Order', onPress: () => setShowCreate(true) }}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => String(o.id)}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => setSelectedOrderId(item.id)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
      <CreateOrderModal visible={showCreate} onClose={() => setShowCreate(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  count: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.md,
  },
  addBtnPressed: { opacity: 0.8 },
  addBtnText: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  list: { paddingVertical: spacing[2], paddingBottom: spacing[8] },
});
