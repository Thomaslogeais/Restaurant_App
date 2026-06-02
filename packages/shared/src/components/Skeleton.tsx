import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = radius.md, style }: SkeletonProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as number, height, borderRadius, opacity: pulse },
        style,
      ]}
    />
  );
}

/** Convenience: a row of skeleton lines */
export function SkeletonText({
  lines = 2,
  style,
}: {
  lines?: number;
  style?: ViewStyle;
}) {
  return (
    <Animated.View style={[{ gap: 8 }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={14}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceAlt,
  },
});
