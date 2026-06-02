import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
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
  // Card has NO onPress → renders as a plain <div> on web, not a <button>.
  // The edit area and the switch are separate interactive children; nesting
  // an <input> or <button> inside a <button> is invalid HTML.
  return (
    <Card shadow="sm" style={styles.card}>
      <View style={styles.row}>
        {/* Tappable info area → opens edit modal */}
        <Pressable
          onPress={() => onEdit(item)}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
          style={({ pressed }) => [styles.infoArea, pressed && styles.infoAreaPressed]}
        >
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <Text style={styles.price}>
            {item.price != null ? formatCurrency(Number(item.price)) : 'Price TBD'}
          </Text>
        </Pressable>

        {/* Availability toggle — separate from the edit pressable */}
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
  infoAreaPressed: { opacity: 0.7 },
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
  controls: { alignItems: 'center', gap: spacing[0.5] },
  availLabel: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },
  unavailLabel: { color: colors.textMuted },
});
