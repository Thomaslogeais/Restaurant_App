import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Skeleton,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radius,
} from '@restaurant/shared';
import { formatCurrency } from '@restaurant/shared';
import { customInstance, type GetStats200 } from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

// ---------------------------------------------------------------------------
// NOTE — Orval path-param limitation
// The generated useGetStats() hook contains a literal URL `/api/stats/:restaurantId`
// that is never substituted, so it would always 404. This is a known Orval
// limitation for path-param-only routes. We use useQuery + customInstance
// directly with the correct interpolated URL, which is the "absolutely
// unavoidable" exception permitted by the API-call constraint.
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery<GetStats200>({
    queryKey: [`/api/stats/${RESTAURANT_ID}`],
    queryFn: () =>
      customInstance<GetStats200>({
        url: `/api/stats/${RESTAURANT_ID}`,
        method: 'GET',
      }),
    staleTime: 1000 * 60,
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Dashboard</Text>

      {isLoading ? (
        <View style={styles.kpiGrid}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="48%" height={84} />
          ))}
        </View>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Could not load stats"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: refetch }}
        />
      ) : stats ? (
        <>
          {/* KPI grid */}
          <View style={styles.kpiGrid}>
            <KpiCard icon="🧾" label="Total Orders" value={String(stats.totalOrders)} />
            <KpiCard
              icon="⏳"
              label="Pending"
              value={String(stats.pendingOrders)}
              highlight={stats.pendingOrders > 0}
            />
            <KpiCard
              icon="💰"
              label="Revenue"
              value={formatCurrency(stats.revenue)}
            />
            <KpiCard
              icon="⭐"
              label="Top Items"
              value={`${stats.topItems.length}`}
            />
          </View>

          {/* Top items section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Items (all time)</Text>
            {stats.topItems.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No orders yet"
                description="Top items will appear once orders are placed."
              />
            ) : (
              stats.topItems.map((item, idx) => (
                <Card key={item.menuItemId} style={styles.topItemCard}>
                  <View style={styles.topItemRow}>
                    <Text style={styles.topItemRank}>#{idx + 1}</Text>
                    <Text style={styles.topItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.topItemQty}>{item.totalOrdered} pcs</Text>
                  </View>
                </Card>
              ))
            )}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// KPI card sub-component
// ---------------------------------------------------------------------------
function KpiCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card style={[styles.kpiCard, highlight && styles.kpiCardHighlight]}>
      <Text style={styles.kpiIcon}>{icon}</Text>
      <Text style={[styles.kpiValue, highlight && styles.kpiValueHighlight]}>
        {value}
      </Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4], paddingBottom: spacing[8], gap: spacing[5] },
  pageTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  kpiCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[1],
  },
  kpiCardHighlight: {
    // No background override — keeps the same white card as siblings.
    // The value text alone signals urgency (amber via kpiValueHighlight).
  },
  kpiIcon: { fontSize: 24 },
  kpiValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  kpiValueHighlight: { color: colors.warningDark },
  kpiLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  section: { gap: spacing[2] },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topItemCard: { paddingVertical: spacing[2] },
  topItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  topItemRank: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    width: 28,
  },
  topItemName: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  topItemQty: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
});
