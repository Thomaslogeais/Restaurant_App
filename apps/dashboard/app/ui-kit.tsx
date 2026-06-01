import { ScrollView, Text, StyleSheet, View } from 'react-native';

/**
 * UI Kit screen — showcases all components from @restaurant/shared.
 * Full implementation: Milestone 8.
 */
export default function UiKitScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>UI Kit</Text>
      <Text style={styles.description}>
        Component showcase for @restaurant/shared — coming in Milestone 8
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Components will appear here:</Text>
        <Text style={styles.item}>• Button (primary, secondary, danger)</Text>
        <Text style={styles.item}>• Card</Text>
        <Text style={styles.item}>• Badge (status variants)</Text>
        <Text style={styles.item}>• Input</Text>
        <Text style={styles.item}>• EmptyState</Text>
        <Text style={styles.item}>• LoadingSpinner</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    color: '#374151',
  },
});
