import { Stack } from 'expo-router';

// The app uses a custom floating BottomNav rendered per-screen and switches
// tabs via router.replace, so this group is a plain stack with no transition
// animation between tabs.
export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'none' }} />;
}
