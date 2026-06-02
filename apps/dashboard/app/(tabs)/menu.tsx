import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LoadingSpinner,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radius,
  useToast,
} from '@restaurant/shared';
import {
  useListMenuCategories,
  useListMenuItems,
  customInstance,
  type ListMenuItems200Item,
  type ListMenuCategories200Item,
  type UpdateMenuItem200,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';
import { MenuItemCard } from '../components/MenuItemCard';
import { AddEditMenuItemModal } from '../components/AddEditMenuItemModal';

export default function MenuScreen() {
  const qc = useQueryClient();
  const { show } = useToast();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ListMenuItems200Item | undefined>(undefined);
  const [showItemModal, setShowItemModal] = useState(false);

  const { data: categories = [], isLoading: loadingCats } = useListMenuCategories(
    { restaurantId: RESTAURANT_ID },
    { query: { select: (data) => data } },
  );

  // Auto-select first category when data arrives
  const typedCats = categories as ListMenuCategories200Item[];
  if (typedCats.length > 0 && selectedCategoryId === null) {
    setSelectedCategoryId(typedCats[0].id);
  }

  const itemParams =
    selectedCategoryId !== null
      ? { restaurantId: RESTAURANT_ID, categoryId: selectedCategoryId }
      : { restaurantId: RESTAURANT_ID };

  const { data: items = [], isLoading: loadingItems } = useListMenuItems(itemParams);
  const typedItems = items as ListMenuItems200Item[];

  const toggleMutation = useMutation<UpdateMenuItem200, Error, ListMenuItems200Item>({
    mutationFn: (item) =>
      customInstance<UpdateMenuItem200>({
        url: `/api/menu-items/${item.id}`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: { available: !item.available },
        params: { restaurantId: RESTAURANT_ID },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/menu-items'] });
    },
    onError: () => show('Failed to update availability', 'error'),
  });

  const handleEditItem = useCallback((item: ListMenuItems200Item) => {
    setEditItem(item);
    setShowItemModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowItemModal(false);
    setEditItem(undefined);
  }, []);

  return (
    <View style={styles.screen}>
      {/* Category tab strip */}
      {loadingCats ? (
        <View style={styles.catBarPlaceholder} />
      ) : (
        <View style={styles.catBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catContainer}
            keyboardShouldPersistTaps="handled"
          >
            {typedCats.map((cat) => {
              const active = cat.id === selectedCategoryId;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.catTab,
                    active && styles.catTabActive,
                    pressed && !active && styles.catTabPressed,
                  ]}
                >
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Sub-header: count + add button */}
      <View style={styles.subHeader}>
        <Text style={styles.count}>
          {loadingItems ? '…' : `${typedItems.length} item${typedItems.length !== 1 ? 's' : ''}`}
        </Text>
        <Pressable
          onPress={() => { setEditItem(undefined); setShowItemModal(true); }}
          accessibilityRole="button"
          accessibilityLabel="Add menu item"
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Text style={styles.addBtnText}>+ Add Item</Text>
        </Pressable>
      </View>

      {/* Item list */}
      {loadingItems ? (
        <LoadingSpinner fullscreen />
      ) : typedItems.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No items in this category"
          description="Add items to get started."
          action={{ label: '+ Add Item', onPress: () => setShowItemModal(true) }}
        />
      ) : (
        <FlatList
          data={typedItems}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onToggleAvailable={() => toggleMutation.mutate(item)}
              onEdit={handleEditItem}
              toggling={toggleMutation.isPending}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddEditMenuItemModal
        visible={showItemModal}
        item={editItem}
        categories={typedCats}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  catBarPlaceholder: { height: 52, backgroundColor: colors.surface },
  catBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  catContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  catTab: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  catTabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  catTabPressed: { backgroundColor: colors.surfaceAlt },
  catLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  catLabelActive: { color: colors.textInverse, fontWeight: fontWeight.semibold },
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
    backgroundColor: colors.accent,
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
