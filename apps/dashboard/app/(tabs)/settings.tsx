import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Input,
  Select,
  Button,
  Skeleton,
  EmptyState,
  colors,
  spacing,
  fontSize,
  fontWeight,
  useToast,
  extractApiError,
} from '@restaurant/shared';
import {
  customInstance,
  type GetSettings200,
  type UpdateSettings200,
  type UpdateSettingsBody,
  UpdateSettingsBodyServiceAvailability,
} from '@restaurant/api-client';
import { RESTAURANT_ID } from '../constants';

// ---------------------------------------------------------------------------
// NOTE — Orval path-param limitation (same as Home screen)
// useGetSettings() / useUpdateSettings() contain literal URLs with `:restaurantId`
// that Orval never substitutes. We use useQuery/useMutation + customInstance
// directly. See index.tsx for the full explanation.
// ---------------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { label: 'All services', value: UpdateSettingsBodyServiceAvailability.all },
  { label: 'Dine-in only', value: UpdateSettingsBodyServiceAvailability.dine_in },
  { label: 'Takeaway only', value: UpdateSettingsBodyServiceAvailability.takeaway },
  { label: 'Delivery only', value: UpdateSettingsBodyServiceAvailability.delivery },
];

// ---------------------------------------------------------------------------
// Settings form validation helpers
// ---------------------------------------------------------------------------
const DECIMAL_RE = /^\d+(\.\d{1,2})?$/;

type SettingsErrors = { prepTime?: string; minOrder?: string };

function validateSettings(prepTime: string, minOrder: string): SettingsErrors {
  const errs: SettingsErrors = {};
  if (prepTime.trim()) {
    const n = parseInt(prepTime.trim(), 10);
    if (!/^\d+$/.test(prepTime.trim()) || n < 1) {
      errs.prepTime = 'Enter a whole number ≥ 1 (e.g. 20)';
    }
  }
  if (minOrder.trim()) {
    if (!DECIMAL_RE.test(minOrder.trim()) || parseFloat(minOrder.trim()) < 0) {
      errs.minOrder = 'Enter a valid amount ≥ 0, e.g. 10.00 (use a dot, not a comma)';
    }
  }
  return errs;
}

export default function SettingsScreen() {
  const qc = useQueryClient();
  const { show } = useToast();

  // Form state — mirrors UpdateSettingsBody
  const [orderingEnabled, setOrderingEnabled] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [prepTime, setPrepTime] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [serviceAvailability, setServiceAvailability] = useState<string>(
    UpdateSettingsBodyServiceAvailability.all,
  );
  const [openingHoursNotes, setOpeningHoursNotes] = useState('');
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<SettingsErrors>({});

  function clearErr(field: keyof SettingsErrors) {
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  }

  const queryKey = [`/api/settings/${RESTAURANT_ID}`];

  const { data: settings, isLoading, isError, refetch } = useQuery<GetSettings200>({
    queryKey,
    queryFn: () =>
      customInstance<GetSettings200>({
        url: `/api/settings/${RESTAURANT_ID}`,
        method: 'GET',
      }),
  });

  // Pre-fill form whenever data arrives
  useEffect(() => {
    if (!settings) return;
    setOrderingEnabled(settings.orderingEnabled);
    setAutoAccept(settings.autoAccept);
    setPrepTime(String(settings.defaultPrepTimeMinutes));
    setMinOrder(settings.minimumOrderAmount != null ? String(settings.minimumOrderAmount) : '');
    setServiceAvailability(settings.serviceAvailability);
    setOpeningHoursNotes(settings.openingHoursNotes ?? '');
    setDirty(false);
  }, [settings]);

  const { mutate: save, isPending: saving } = useMutation<UpdateSettings200, Error, UpdateSettingsBody>({
    mutationFn: (body) =>
      customInstance<UpdateSettings200>({
        url: `/api/settings/${RESTAURANT_ID}`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      show('Settings saved', 'success');
      setDirty(false);
    },
    onError: (err) => show(extractApiError(err, 'Failed to save settings'), 'error'),
  });

  function handleSave() {
    const errs = validateSettings(prepTime, minOrder);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const body: UpdateSettingsBody = {
      orderingEnabled,
      autoAccept,
      defaultPrepTimeMinutes: prepTime ? parseInt(prepTime, 10) : settings?.defaultPrepTimeMinutes,
      minimumOrderAmount: minOrder ? parseFloat(minOrder) : undefined,
      serviceAvailability: serviceAvailability as typeof UpdateSettingsBodyServiceAvailability[keyof typeof UpdateSettingsBodyServiceAvailability],
      openingHoursNotes: openingHoursNotes.trim() || null,
    };
    save(body);
  }

  function markDirty() { setDirty(true); }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {isLoading ? (
        <View style={styles.skeletons}>
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} width="100%" height={56} />)}
        </View>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Could not load settings"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: refetch }}
        />
      ) : settings ? (
        <>
          {/* Ordering enabled */}
          <SectionTitle title="Ordering" />
          <SettingRow label="Ordering enabled" description="Accept new orders from customers">
            <Switch
              value={orderingEnabled}
              onValueChange={(v) => { setOrderingEnabled(v); markDirty(); }}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={colors.surface}
            />
          </SettingRow>

          <SettingRow label="Auto-accept orders" description="Automatically accept incoming orders">
            <Switch
              value={autoAccept}
              onValueChange={(v) => { setAutoAccept(v); markDirty(); }}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={colors.surface}
            />
          </SettingRow>

          {/* Timing */}
          <SectionTitle title="Timing & Minimums" />
          <Input
            label="Default prep time (minutes)"
            placeholder="e.g. 20"
            value={prepTime}
            onChangeText={(v) => { setPrepTime(v); markDirty(); clearErr('prepTime'); }}
            keyboardType="number-pad"
            error={errors.prepTime}
          />
          <Input
            label="Minimum order amount (€, optional)"
            placeholder="e.g. 10.00"
            value={minOrder}
            onChangeText={(v) => { setMinOrder(v); markDirty(); clearErr('minOrder'); }}
            keyboardType="decimal-pad"
            error={errors.minOrder}
            hint={errors.minOrder ? undefined : 'Use a dot as the decimal separator (e.g. 10.00)'}
          />

          {/* Service */}
          <SectionTitle title="Service" />
          <Select
            label="Service availability"
            options={SERVICE_OPTIONS}
            value={serviceAvailability}
            onChange={(v) => { if (v) { setServiceAvailability(v); markDirty(); } }}
          />
          <Input
            label="Opening hours notes (optional)"
            placeholder="e.g. Mon–Fri 11:00–22:00, Sat–Sun 12:00–23:00"
            value={openingHoursNotes}
            onChangeText={(v) => { setOpeningHoursNotes(v); markDirty(); }}
            multiline
            numberOfLines={3}
          />

          {/* Save */}
          <Button
            label={saving ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            loading={saving}
            disabled={!dirty}
            fullWidth
          />
        </>
      ) : null}
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? <Text style={styles.settingDesc}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4], paddingBottom: spacing[8], gap: spacing[4] },
  skeletons: { gap: spacing[3] },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing[2],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  settingText: { flex: 1 },
  settingLabel: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textPrimary },
  settingDesc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
