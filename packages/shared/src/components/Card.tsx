import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows, ShadowToken } from '../tokens/shadows';

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  shadow?: ShadowToken;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// React Native Web extends PressableStateCallbackType with `hovered` and `focused`.
type PressableState = { pressed: boolean; hovered?: boolean; focused?: boolean };

export function Card({
  children,
  padding = spacing[4],
  shadow = 'sm',
  onPress,
  style,
}: CardProps) {
  const shadowStyle = shadows[shadow];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={((state: PressableState) => {
          const hovered = state.hovered === true;
          const pressed = state.pressed;

          return [
            styles.card,
            shadowStyle,
            { padding },
            style,
            hovered && !pressed && styles.hovered,
            pressed && styles.pressed,
          ];
        }) as any}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, shadowStyle, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hovered: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    opacity: 0.9,
  },
});
