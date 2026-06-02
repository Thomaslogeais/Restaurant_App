import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Badge,
  DataList,
  LoadingSpinner,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
} from '@restaurant/shared';
import { formatCurrency, formatDate, formatOrderStatus } from '@restaurant/shared';
import {
  useListOrders,
  type ListCustomers200Item,
  type ListOrders200Item,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

interface Props {
  customer: ListCustomers200Item | null;
  onClose: () => void;
}

const RECENT_ORDERS_COLUMNS = [
  { key: 'id', label: '#', flex: 0.5 },
  { key: 'date', label: 'Date', flex: 1.2 },
  { key: 'status', label: 'Status', flex: 1 },
  { key: 'total', label: 'Total', flex: 0.8, align: 'right' as const },
];

export function CustomerDetailModal({ customer, onClose }: Props) {
  // ── Close-animation fix ──────────────────────────────────────────────────
  // When onClose() fires, `customer` immediately becomes null while the modal
  // is still playing its fade-out animation (~300 ms). This would cause all
  // customer fields to reset to their fallback values mid-animation (the
  // "flash" of a different / empty modal).
  //
  // Solution: keep a ref to the last non-null customer and use it for
  // rendering. `visible` is still driven by `!!customer` (correct), but the
  // displayed data stays frozen on the real customer until the modal unmounts.
  const lastCustomerRef = useRef<ListCustomers200Item | null>(customer);
  if (customer) lastCustomerRef.current = customer;
  const c = lastCustomerRef.current; // alias used throughout for brevity

  const { data: orders = [], isLoading } = useListOrders(
    { restaurantId: RESTAURANT_ID, customerId: c?.id },
    { query: { enabled: !!customer } },
  );

  const typedOrders = orders as ListOrders200Item[];

  const tableData = typedOrders.slice(0, 10).map((o) => ({
    id: String(o.id),
    date: o.createdAt ? formatDate(o.createdAt) : '—',
    status: (
      <Badge
        label={formatOrderStatus(o.status)}
        variant={o.status as any}
      />
    ),
    total: formatCurrency(Number(o.totalAmount ?? 0)),
  }));

  return (
    <Modal
      visible={!!customer}
      onClose={onClose}
      title={c?.name ?? 'Customer'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contact info */}
        <View style={styles.contactRow}>
          {c?.email ? (
            <InfoChip icon="✉️" value={c.email} />
          ) : null}
          {c?.phone ? (
            <InfoChip icon="📞" value={c.phone} />
          ) : null}
          {c?.createdAt ? (
            <InfoChip icon="📅" value={`Since ${formatDate(c.createdAt)}`} />
          ) : null}
        </View>

        {/* KPI bar */}
        <View style={styles.kpiRow}>
          <KpiBox
            label="Orders"
            value={String(c?.orderCount ?? 0)}
          />
          <KpiBox
            label="Total Spend"
            value={formatCurrency(parseFloat(String(c?.totalSpend ?? '0')))}
          />
        </View>

        {/* Recent orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <LoadingSpinner size="small" />
          </View>
        ) : typedOrders.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="No orders yet"
            description="This customer has not placed any orders."
          />
        ) : (
          <DataList
            columns={RECENT_ORDERS_COLUMNS}
            data={tableData}
            emptyText="No orders"
            scrollable={false}
          />
        )}
      </ScrollView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function InfoChip({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={styles.chipText} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function KpiBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpiBox}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  contactRow: { gap: spacing[2], marginBottom: spacing[4] },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    alignSelf: 'flex-start',
  },
  chipIcon: { fontSize: 13 },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  kpiBox: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: spacing[3],
    alignItems: 'center',
    gap: spacing[1],
  },
  kpiValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  kpiLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[2],
  },
  loadingBox: { alignItems: 'center', paddingVertical: spacing[6] },
});
