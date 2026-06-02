import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  Modal,
  Input,
  Select,
  Button,
  colors,
  spacing,
  fontSize,
  fontWeight,
  useToast,
} from '@restaurant/shared';
import {
  useCreateMenuItem,
  customInstance,
  type ListMenuItems200Item,
  type ListMenuCategories200Item,
  type UpdateMenuItem200,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

interface AddEditMenuItemModalProps {
  visible: boolean;
  item?: ListMenuItems200Item; // undefined = create mode
  categories: ListMenuCategories200Item[];
  onClose: () => void;
}

export function AddEditMenuItemModal({
  visible,
  item,
  categories,
  onClose,
}: AddEditMenuItemModalProps) {
  const qc = useQueryClient();
  const { show } = useToast();
  const isEdit = item !== undefined;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [available, setAvailable] = useState(true);

  // Populate form when editing
  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price != null ? String(item.price) : '');
      setDescription(item.description ?? '');
      setCategoryId(String(item.categoryId));
      setAvailable(item.available);
    } else {
      setName(''); setPrice(''); setDescription('');
      setCategoryId(undefined); setAvailable(true);
    }
  }, [item, visible]);

  const { mutate: createItem, isPending: creating } = useCreateMenuItem({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/menu-items'] });
        show('Item created', 'success');
        onClose();
      },
      onError: () => show('Failed to create item', 'error'),
    },
  });

  const [updating, setUpdating] = useState(false);

  async function handleEditSubmit() {
    if (!item) return;
    setUpdating(true);
    try {
      await customInstance<UpdateMenuItem200>({
        url: `/api/menu-items/${item.id}`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: {
          name: name.trim() || undefined,
          price: price ? Number(price) : undefined,
          description: description.trim() || null,
          categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
          available,
        },
        params: { restaurantId: RESTAURANT_ID },
      });
      qc.invalidateQueries({ queryKey: ['/api/menu-items'] });
      show('Item updated', 'success');
      onClose();
    } catch {
      show('Failed to update item', 'error');
    } finally {
      setUpdating(false);
    }
  }

  function handleCreateSubmit() {
    if (!name.trim() || !categoryId) {
      show('Name and category are required', 'warning');
      return;
    }
    createItem({
      data: {
        restaurantId: RESTAURANT_ID,
        categoryId: parseInt(categoryId, 10),
        name: name.trim(),
        description: description.trim() || null,
        price: price ? Number(price) : 0,
        available,
      },
    });
  }

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const isPending = creating || updating;

  return (
    <Modal visible={visible} onClose={onClose} title={isEdit ? 'Edit Item' : 'Add Item'}>
      <View style={styles.container}>
        <Input
          label="Name *"
          placeholder="e.g. Margherita Pizza"
          value={name}
          onChangeText={setName}
        />
        <Select
          label="Category *"
          placeholder="Select a category…"
          options={categoryOptions}
          value={categoryId}
          onChange={setCategoryId}
        />
        <Input
          label="Price (€)"
          placeholder="e.g. 9.99"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        <Input
          label="Description"
          placeholder="Optional description…"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
          />
        </View>
        <Button
          label={isPending ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Add Item')}
          onPress={isEdit ? handleEditSubmit : handleCreateSubmit}
          loading={isPending}
          fullWidth
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing[4] },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
