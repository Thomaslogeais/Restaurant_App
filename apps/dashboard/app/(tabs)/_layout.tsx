import { Tabs } from 'expo-router';
import { colors } from '@restaurant/shared';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="crm" options={{ title: 'CRM' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
