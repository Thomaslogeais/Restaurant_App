import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  Modal,
  Input,
  Select,
  Button,
  LoadingSpinner,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radius,
  useToast,
  extractApiError,
} from '@restaurant/shared';
import { formatCurrency } from '@restaurant/shared';
import {
  useListCustomers,
  useListMenuItems,
  useCreateOrder,
  type ListCustomers200Item,
  type ListMenuItems200Item,
  type CreateOrderBodyItemsItem,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

interface CartItem { menuItem: ListMenuItems200Item; quantity: number }

interface CreateOrderModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateOrderModal({ visible, onClose }: CreateOrderModalProps) {
  const qc = useQueryClient();
  const { show } = useToast();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: customers = [], isLoading: loadingCustomers } = useListCustomers(
    { restaurantId: RESTAURANT_ID },
    { query: { enabled: visible } },
  );

  const { data: menuItems = [], isLoading: loadingItems } = useListMenuItems(
    { restaurantId: RESTAURANT_ID, available: 'true' },
    { query: { enabled: visible } },
  );

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/orders'] });
        show('Order created', 'success');
        handleClose();
      },
      onError: (err) => {
        const msg = extractApiError(err, 'Failed to create order');
        setSubmitError(msg);
        show(msg, 'error');
      },
    },
  });

  function handleClose() {
    setCart([]);
    setNotes('');
    setSelectedCustomerId(undefined);
    setSubmitError(null);
    onClose();
  }

  function adjustQty(item: ListMenuItems200Item, delta: number) {
    if (submitError) setSubmitError(null);
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (!existing) {
        if (delta < 1) return prev;
        return [...prev, { menuItem: item, quantity: 1 }];
      }
      const next = existing.quantity + delta;
      if (next < 1) return prev.filter((c) => c.menuItem.id !== item.id);
      return prev.map((c) => c.menuItem.id === item.id ? { ...c, quantity: next } : c);
    });
  }

  function handleSubmit() {
    if (cart.length === 0) {
      show('Add at least one item', 'warning');
      return;
    }
    const items: CreateOrderBodyItemsItem[] = cart.map((c) => ({
      menuItemId: c.menuItem.id,
      quantity: c.quantity,
    }));
    createOrder({
      data: {
        restaurantId: RESTAURANT_ID,
        customerId: selectedCustomerId ? parseInt(selectedCustomerId, 10) : undefined,
        notes: notes.trim() || undefined,
        items,
      },
    });
  }

  const customerOptions = (customers as ListCustomers200Item[]).map((c) => ({
    label: `${c.name} (${c.email})`,
    value: String(c.id),
  }));

  const cartTotal = cart.reduce(
    (sum, c) => sum + (c.menuItem.price != null ? Number(c.menuItem.price) * c.quantity : 0),
    0,
  );

  return (
    <Modal visible={visible} onClose={handleClose} title="New Order">
      <View style={styles.container}>
        {/* Customer (optional) */}
        <Select
          label="Customer (optional)"
          placeholder="Walk-in / no customer"
          options={customerOptions}
          value={selectedCustomerId}
          onChange={setSelectedCustomerId}
          disabled={loadingCustomers}
        />

        {/* Notes */}
        <Input
          label="Notes"
          placeholder="Allergy info, special requests…"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
        />

        {/* Items */}
        <Text style={styles.sectionTitle}>Menu Items</Text>
        {loadingItems ? (
          <LoadingSpinner size="small" />
        ) : menuItems.length === 0 ? (
          <EmptyState title="No available items" description="All items are currently unavailable." />
        ) : (
          <View style={styles.itemList}>
            {(menuItems as ListMenuItems200Item[]).map((item) => {
              const cartItem = cart.find((c) => c.menuItem.id === item.id);
              const qty = cartItem?.quantity ?? 0;
              return (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {item.price != null ? formatCurrency(Number(item.price)) : 'Price TBD'}
                    </Text>
                  </View>
                  <View style={styles.qtyRow}>
                    <Pressable
                      onPress={() => adjustQty(item, -1)}
                      style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed]}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.qty}>{qty}</Text>
                    <Pressable
                      onPress={() => adjustQty(item, 1)}
                      style={({ pressed }) => [styles.qtyBtn, styles.qtyBtnAdd, pressed && styles.qtyBtnPressed]}
                    >
                      <Text style={[styles.qtyBtnText, { color: colors.textInverse }]}>+</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Cart summary */}
        {cart.length > 0 ? (
          <View style={styles.cartSummary}>
            <Text style={styles.cartText}>
              {cart.reduce((s, c) => s + c.quantity, 0)} items — {formatCurrency(cartTotal)}
            </Text>
          </View>
        ) : null}

        {/* Inline error banner — shown when the API rejects the order */}
        {submitError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {submitError}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <Button
          label={isPending ? 'Creating…' : 'Create Order'}
          onPress={handleSubmit}
          loading={isPending}
          disabled={cart.length === 0}
          fullWidth
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing[4] },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemList: { gap: spacing[1] },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[3],
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textPrimary },
  itemPrice: { fontSize: fontSize.xs, color: colors.textSecondary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  qtyBtn: {
    width: 28, height: 28,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAdd: { backgroundColor: colors.primary, borderColor: colors.primary },
  qtyBtnPressed: { opacity: 0.7 },
  qtyBtnText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, lineHeight: 20 },
  qty: { minWidth: 20, textAlign: 'center', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  cartSummary: {
    backgroundColor: colors.infoBg,
    borderRadius: radius.md,
    padding: spacing[3],
    alignItems: 'center',
  },
  cartText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.infoDark },
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing[3],
  },
  errorBannerText: {
    fontSize: fontSize.sm,
    color: colors.errorDark,
    fontWeight: fontWeight.medium,
    lineHeight: 20,
  },
});
