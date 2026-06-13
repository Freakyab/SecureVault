import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ColorScheme } from '@/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof ColorScheme;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme.colors[type ?? 'background'] }, style]} {...otherProps} />;
}
