import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export function App() {
  const ctx = {
    // any custom configuration for Expo Router
  };

  return <ExpoRoot ctx={ctx} />;
}

registerRootComponent(App);
