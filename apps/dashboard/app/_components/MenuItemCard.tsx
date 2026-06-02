import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Card, colors, spacing, fontSize, fontWeight } from '@restaurant/shared';
import { formatCurrency } from '@restaurant/shared';
import type { ListMenuItems200Item } from '@restaurant/api-client';

interface MenuItemCardProps {
  item: ListMenuItems200Item;
  onToggleAvailable: (item: ListMenuItems200Item) => void;
  onEdit: (item: ListMenuItems200Item) => void;
  toggling: boolean;
}

export function MenuItemCard({ item, onToggleAvailable, onEdit, toggling }: MenuItemCardProps) {
  // The Card itself is the pressable area (full-width hover + edit).
  // The Switch handles its own touch events and does not bubble up to the Card,
  // so both interactions work independently with no nested-button issues.
  // (RNW renders Pressable as a <div>, not a <button>, so nesting a Switch is valid.)
  return (
    <Card shadow="sm" style={styles.card} onPress={() => onEdit(item)}>
      <View style={styles.row}>
        {/* Info area — layout only, interaction is the whole Card */}
        <View style={styles.infoArea}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <Text style={styles.price}>
            {item.price != null ? formatCurrency(Number(item.price)) : 'Price TBD'}
          </Text>
          <Text style={styles.editHint}>Tap to edit ›</Text>
        </View>

        {/* Availability toggle — has its own touch handler, stops propagation */}
        <View style={styles.controls}>
          <Switch
            value={item.available}
            onValueChange={() => onToggleAvailable(item)}
            disabled={toggling}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
            accessibilityLabel={item.available ? 'Mark unavailable' : 'Mark available'}
          />
          <Text style={[styles.availLabel, !item.available && styles.unavailLabel]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
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
    alignItems: 'center',
    gap: spacing[3],
  },
  infoArea: {
    flex: 1,
    gap: spacing[0.5],
    paddingVertical: spacing[1],
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  editHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing[0.5],
  },
  controls: { alignItems: 'center', gap: spacing[0.5] },
  availLabel: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },
  unavailLabel: { color: colors.textMuted },
});
