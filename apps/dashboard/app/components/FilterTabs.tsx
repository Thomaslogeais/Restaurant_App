import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight } from '@restaurant/shared';
import type { ListOrdersStatus } from '@restaurant/api-client';

type FilterValue = ListOrdersStatus | 'all';

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const TABS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {TABS.map((tab) => {
          const active = tab.value === value;
          return (
            <Pressable
              key={tab.value}
              onPress={() => onChange(tab.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && !active && styles.tabPressed,
              ]}
            >
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textInverse,
    fontWeight: fontWeight.semibold,
  },
});
