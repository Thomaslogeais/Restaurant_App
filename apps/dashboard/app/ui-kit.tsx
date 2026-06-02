/**
 * UI Kit — Design system showcase for @restaurant/shared.
 * Route: /ui-kit (accessible from the dev menu or direct navigation)
 *
 * This screen is for development reference only and is not part of
 * the production navigation.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Badge,
  Card,
  DataList,
  Input,
  Select,
  Skeleton,
  EmptyState,
  LoadingSpinner,
  Modal,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radius,
} from '@restaurant/shared';

export default function UiKitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>UI Kit</Text>
      <Text style={styles.pageSubtitle}>@restaurant/shared component showcase</Text>

      {/* ------------------------------------------------------------------ */}
      {/* Colors                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Color Tokens">
        <View style={styles.colorGrid}>
          {COLOR_SWATCHES.map(({ label, color }) => (
            <View key={label} style={styles.swatchItem}>
              <View style={[styles.swatch, { backgroundColor: color }]} />
              <Text style={styles.swatchLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Buttons                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Button">
        <Button label="Primary (default)" onPress={() => {}} />
        <Button label="Secondary" variant="secondary" onPress={() => {}} />
        <Button label="Danger" variant="danger" onPress={() => {}} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <Button label="Loading…" loading onPress={() => {}} />
        <Button label="Disabled" disabled onPress={() => {}} />
        <Button label="Full Width" fullWidth onPress={() => {}} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Badges                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Badge">
        <View style={styles.row}>
          <Badge label="Pending" variant="pending" />
          <Badge label="Accepted" variant="accepted" />
          <Badge label="Preparing" variant="preparing" />
          <Badge label="Ready" variant="ready" />
        </View>
        <View style={styles.row}>
          <Badge label="Completed" variant="completed" />
          <Badge label="Cancelled" variant="cancelled" />
          <Badge label="Default" variant="default" />
        </View>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Cards                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Card">
        <Card shadow="none">
          <Text style={styles.cardText}>Card — shadow none</Text>
        </Card>
        <Card shadow="sm">
          <Text style={styles.cardText}>Card — shadow sm (default)</Text>
        </Card>
        <Card shadow="md">
          <Text style={styles.cardText}>Card — shadow md</Text>
        </Card>
        <Card shadow="lg">
          <Text style={styles.cardText}>Card — shadow lg</Text>
        </Card>
        <Card onPress={() => {}}>
          <Text style={styles.cardText}>Card — pressable (tap me)</Text>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Inputs                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Input">
        <Input
          label="Default input"
          placeholder="Type something…"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Input
          label="With error"
          placeholder="Invalid value"
          value=""
          onChangeText={() => {}}
          error="This field is required"
        />
        <Input
          label="Multiline"
          placeholder="Long description…"
          value=""
          onChangeText={() => {}}
          multiline
          numberOfLines={3}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Select                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Select">
        <Select
          label="Pick an option"
          placeholder="Select…"
          options={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' },
          ]}
          value={selectValue}
          onChange={setSelectValue}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Skeleton                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Skeleton">
        <Skeleton width="100%" height={20} />
        <Skeleton width="70%" height={20} />
        <Skeleton width="100%" height={80} />
        <Skeleton width={80} height={80} borderRadius={40} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Empty State                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Section title="EmptyState">
        <EmptyState
          icon="📋"
          title="Nothing here yet"
          description="Items will appear once you add some data."
        />
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: () => {} }}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Loading Spinner                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section title="LoadingSpinner">
        <View style={styles.row}>
          <LoadingSpinner size="small" />
          <LoadingSpinner size="large" />
        </View>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* DataList                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Section title="DataList">
        <Text style={styles.cardText}>
          Responsive list-table. Header + striped rows + empty state. ReactNode cells (e.g. Badge) supported.
        </Text>
        <DataList
          columns={[
            { key: 'rank', label: '#', flex: 0.4 },
            { key: 'item', label: 'Item', flex: 2 },
            { key: 'status', label: 'Status', flex: 1 },
            { key: 'total', label: 'Total', flex: 0.8, align: 'right' },
          ]}
          data={[
            { rank: '1', item: 'Truffle Burger', status: <Badge label="Ready" variant="ready" />, total: '€24.00' },
            { rank: '2', item: 'Caesar Salad', status: <Badge label="Preparing" variant="preparing" />, total: '€14.50' },
            { rank: '3', item: 'Crème Brûlée', status: <Badge label="Pending" variant="pending" />, total: '€9.00' },
          ]}
          scrollable={false}
        />
        <DataList
          columns={[{ key: 'x', label: 'Column' }]}
          data={[]}
          emptyText="Nothing to show yet."
          scrollable={false}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Modal                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Modal">
        <Button label="Open Modal" variant="secondary" onPress={() => setModalVisible(true)} />
        <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Example Modal">
          <View style={styles.modalContent}>
            <Text style={styles.cardText}>
              This is a modal dialog. Tap the × or the backdrop to close.
            </Text>
            <Button label="Close" onPress={() => setModalVisible(false)} fullWidth />
          </View>
        </Modal>
      </Section>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Color swatches data
// ---------------------------------------------------------------------------
const COLOR_SWATCHES = [
  { label: 'primary', color: colors.primary },
  { label: 'accent', color: colors.accent },
  { label: 'background', color: colors.background },
  { label: 'surface', color: colors.surface },
  { label: 'success', color: colors.success },
  { label: 'warning', color: colors.warning },
  { label: 'error', color: colors.error },
  { label: 'info', color: colors.info },
  { label: 'textPrimary', color: colors.textPrimary },
  { label: 'textMuted', color: colors.textMuted },
  { label: 'border', color: colors.border },
  { label: 'statusPending', color: colors.statusPending },
  { label: 'statusPreparing', color: colors.statusPreparing },
  { label: 'statusReady', color: colors.statusReady },
  { label: 'statusCompleted', color: colors.statusCompleted },
  { label: 'statusCancelled', color: colors.statusCancelled },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4], paddingBottom: spacing[10], gap: spacing[6] },
  pageTitle: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.textPrimary },
  pageSubtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: -spacing[4] },
  section: { gap: spacing[3] },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionContent: { gap: spacing[3] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  swatchItem: { alignItems: 'center', width: 64, gap: spacing[1] },
  swatch: { width: 40, height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  swatchLabel: { fontSize: 9, color: colors.textMuted, textAlign: 'center' },
  cardText: { fontSize: fontSize.sm, color: colors.textSecondary },
  modalContent: { gap: spacing[4] },
});
