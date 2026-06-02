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
  extractApiError,
} from '@restaurant/shared';
import {
  useCreateMenuItem,
  customInstance,
  type ListMenuItems200Item,
  type ListMenuCategories200Item,
  type UpdateMenuItem200,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
/** Accepts "9", "9.5", "9.99" — rejects commas, letters, negatives, >2dp */
const PRICE_RE = /^\d+(\.\d{1,2})?$/;

type FormErrors = { name?: string; categoryId?: string; price?: string };

function validate(
  name: string,
  categoryId: string | undefined,
  price: string,
): FormErrors {
  const errs: FormErrors = {};
  if (!name.trim()) {
    errs.name = 'Name is required';
  }
  if (!categoryId) {
    errs.categoryId = 'Please select a category';
  }
  const p = price.trim();
  if (p && (!PRICE_RE.test(p) || parseFloat(p) <= 0)) {
    errs.price = 'Enter a valid price, e.g. 9.99 (use a dot, not a comma)';
  }
  return errs;
}

// ---------------------------------------------------------------------------

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
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form when editing; clear errors on every open/close
  useEffect(() => {
    setErrors({});
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

  // Helper: clear a single field's error as soon as the user edits it
  function clearErr(field: keyof FormErrors) {
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  }

  const { mutate: createItem, isPending: creating } = useCreateMenuItem({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/menu-items'] });
        show('Item created', 'success');
        onClose();
      },
      onError: (err) => show(extractApiError(err, 'Failed to create item'), 'error'),
    },
  });

  const [updating, setUpdating] = useState(false);

  async function handleEditSubmit() {
    if (!item) return;
    const errs = validate(name, categoryId, price);
    if (Object.keys(errs).length) { setErrors(errs); return; }

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
    } catch (err) {
      show(extractApiError(err, 'Failed to update item'), 'error');
    } finally {
      setUpdating(false);
    }
  }

  function handleCreateSubmit() {
    const errs = validate(name, categoryId, price);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    createItem({
      data: {
        restaurantId: RESTAURANT_ID,
        categoryId: parseInt(categoryId!, 10),
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
          onChangeText={(v) => { setName(v); clearErr('name'); }}
          error={errors.name}
        />
        <Select
          label="Category *"
          placeholder="Select a category…"
          options={categoryOptions}
          value={categoryId}
          onChange={(v) => { setCategoryId(v); clearErr('categoryId'); }}
          error={errors.categoryId}
        />
        <Input
          label="Price (€)"
          placeholder="e.g. 9.99"
          value={price}
          onChangeText={(v) => { setPrice(v); clearErr('price'); }}
          keyboardType="decimal-pad"
          error={errors.price}
          hint={errors.price ? undefined : 'Use a dot as the decimal separator (e.g. 9.99)'}
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
