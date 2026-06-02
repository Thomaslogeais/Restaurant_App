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

// React Native Web adds `hovered` and `focused` to the Pressable state callback.
type PressableState = { pressed: boolean; hovered?: boolean; focused?: boolean };

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
              style={((state: PressableState) => {
                const hovered = state.hovered === true;
                const pressed = state.pressed;

                if (active) {
                  // Active tab: darken on hover/press
                  return [
                    styles.tab,
                    styles.tabActive,
                    (hovered || pressed) && styles.tabActiveHovered,
                  ];
                }

                // Inactive tab: progressively lighter → hover → pressed
                return [
                  styles.tab,
                  hovered && styles.tabHovered,
                  pressed && styles.tabPressed,
                ];
              }) as any}
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
  tabHovered: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  tabPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    opacity: 0.85,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabActiveHovered: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
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
