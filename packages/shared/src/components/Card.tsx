import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows, ShadowToken } from '../tokens/shadows';

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  shadow?: ShadowToken;
  onPress?: () => void;
  style?: ViewStyle;
}

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
        style={({ pressed }) => [
          styles.card,
          shadowStyle,
          { padding },
          style,
          pressed && styles.pressed,
        ]}
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
  pressed: {
    opacity: 0.92,
    backgroundColor: colors.surfaceAlt,
  },
});
