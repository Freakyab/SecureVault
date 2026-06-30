import { Tabs } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

// The app renders its own floating BottomNav inside each screen, but the route
// group should still behave like tabs so screens stay mounted between switches.
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="vault" />
      <Tabs.Screen name="generator" />
      <Tabs.Screen name="health" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="my-vault" />
    </Tabs>
  );
}
