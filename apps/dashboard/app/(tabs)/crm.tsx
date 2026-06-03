import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Modal,
  Input,
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
import { formatCurrency, formatDate } from '@restaurant/shared';
import {
  useListCustomers,
  useCreateCustomer,
  type ListCustomers200Item,
  type CreateCustomerBody,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';
import { CustomerDetailModal } from '../_components/CustomerDetailModal';

export default function CrmScreen() {
  const qc = useQueryClient();
  const { show } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ListCustomers200Item | null>(null);

  const { data: customers = [], isLoading, isError, refetch } = useListCustomers({
    restaurantId: RESTAURANT_ID,
  });

  const typedCustomers = customers as ListCustomers200Item[];

  const { mutate: createCustomer, isPending: creating } = useCreateCustomer({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/customers'] });
        show('Customer created', 'success');
        setShowCreate(false);
      },
      onError: (err) => show(extractApiError(err, 'Failed to create customer'), 'error'),
    },
  });

  return (
    <View style={styles.screen}>
      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.count}>
          {isLoading ? '…' : `${typedCustomers.length} customer${typedCustomers.length !== 1 ? 's' : ''}`}
        </Text>
        <Pressable
          onPress={() => setShowCreate(true)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Text style={styles.addBtnText}>+ Add Customer</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner fullscreen />
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Could not load customers"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: refetch }}
        />
      ) : typedCustomers.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No customers yet"
          description="Add your first customer to get started."
          action={{ label: '+ Add Customer', onPress: () => setShowCreate(true) }}
        />
      ) : (
        <FlatList
          data={typedCustomers}
          keyExtractor={(c) => String(c.id)}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onPress={() => setSelectedCustomer(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create customer modal */}
      <CreateCustomerModal
        visible={showCreate}
        creating={creating}
        onClose={() => setShowCreate(false)}
        onSubmit={(body) => createCustomer({ data: body })}
      />

      {/* Customer detail modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Customer card
// ---------------------------------------------------------------------------
function CustomerCard({
  customer,
  onPress,
}: {
  customer: ListCustomers200Item;
  onPress: () => void;
}) {
  return (
    <Card shadow="sm" style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {customer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.customerEmail} numberOfLines={1}>
            {customer.email}
          </Text>
          {customer.phone ? (
            <Text style={styles.customerPhone}>{customer.phone}</Text>
          ) : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.cardFooter}>
        <Stat label="Orders" value={String(customer.orderCount)} />
        <Stat label="Total Spend" value={formatCurrency(customer.totalSpend)} />
        <Stat label="Loyalty Pts" value={String(customer.loyaltyPoints)} />
        {customer.createdAt ? (
          <Stat label="Since" value={formatDate(customer.createdAt)} />
        ) : null}
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Create customer modal (inline — no separate file needed)
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Same regex as the backend (zod-schemas.ts) — 7-20 chars, digits/spaces/hyphens/parens, optional leading +
const PHONE_RE = /^\+?[\d\s\-\(\)]{7,20}$/;

type CustomerFormErrors = { name?: string; email?: string; phone?: string };

function CreateCustomerModal({
  visible,
  creating,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  creating: boolean;
  onClose: () => void;
  onSubmit: (body: CreateCustomerBody) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<CustomerFormErrors>({});

  function clearErr(field: keyof CustomerFormErrors) {
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  }

  function handleClose() {
    setName(''); setEmail(''); setPhone('');
    setErrors({});
    onClose();
  }

  function handleSubmit() {
    const errs: CustomerFormErrors = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!EMAIL_RE.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    if (phone.trim() && !PHONE_RE.test(phone.trim())) {
      errs.phone = 'Enter a valid phone number (e.g. +33 6 12 34 56 78)';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onSubmit({
      restaurantId: RESTAURANT_ID,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
    });
  }

  return (
    <Modal visible={visible} onClose={handleClose} title="Add Customer">
      <View style={styles.form}>
        <Input
          label="Name *"
          placeholder="e.g. Marie Dupont"
          value={name}
          onChangeText={(v) => { setName(v); clearErr('name'); }}
          error={errors.name}
        />
        <Input
          label="Email *"
          placeholder="marie@example.com"
          value={email}
          onChangeText={(v) => { setEmail(v); clearErr('email'); }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Phone (optional)"
          placeholder="+33 6 00 00 00 00"
          value={phone}
          onChangeText={(v) => { setPhone(v); clearErr('phone'); }}
          keyboardType="phone-pad"
          error={errors.phone}
        />
        <Button
          label={creating ? 'Creating…' : 'Add Customer'}
          onPress={handleSubmit}
          loading={creating}
          fullWidth
        />
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
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
  count: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.md,
  },
  addBtnPressed: { opacity: 0.8 },
  addBtnText: { color: colors.textInverse, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  list: { paddingVertical: spacing[2], paddingBottom: spacing[8] },
  card: { marginHorizontal: spacing[4], marginVertical: spacing[1.5] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textInverse, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  cardInfo: { flex: 1 },
  customerName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  customerEmail: { fontSize: fontSize.sm, color: colors.textSecondary },
  customerPhone: { fontSize: fontSize.sm, color: colors.textMuted },
  chevron: { fontSize: 20, color: colors.textMuted },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing[3] },
  stat: { alignItems: 'center' },
  statValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  form: { gap: spacing[4] },
});
