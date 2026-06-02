import { View, Text, StyleSheet } from 'react-native';

/**
 * CRM screen — customers list, search, loyalty points.
 * Full implementation: Milestone 7.
 */
export default function CrmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRM</Text>
      <Text style={styles.subtitle}>Customer management — coming in Milestone 7</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
