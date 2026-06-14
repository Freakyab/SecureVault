import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ONBOARDING_COMPLETE_KEY = 'securevault:onboarding-complete';

export async function getOnboardingComplete() {
  if (Platform.OS === 'web') return false;
  return (await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY)) === 'true';
}

export async function setOnboardingComplete() {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
}

export async function clearOnboardingComplete() {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(ONBOARDING_COMPLETE_KEY);
}
