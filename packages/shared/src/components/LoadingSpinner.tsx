import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  /** When true, centers the spinner in a full flex container */
  fullscreen?: boolean;
  style?: ViewStyle;
}

export function LoadingSpinner({
  size = 'large',
  color = colors.accent,
  fullscreen = false,
  style,
}: LoadingSpinnerProps) {
  if (fullscreen) {
    return (
      <View style={[styles.fullscreen, style]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <View style={[styles.inline, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  inline: {
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
