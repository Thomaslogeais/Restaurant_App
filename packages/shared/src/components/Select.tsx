import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal as RNModal,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { fontSize, fontWeight } from '../tokens/typography';

export interface SelectOption<V extends string = string> {
  label: string;
  value: V;
}

export interface SelectProps<V extends string = string> {
  options: SelectOption<V>[];
  value?: V;
  onChange: (value: V) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function Select<V extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  error,
  disabled = false,
  containerStyle,
}: SelectProps<V>) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;
  const isPlaceholder = !selected;

  const borderColor = error ? colors.error : open ? colors.primary : colors.border;

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open, disabled }}
        style={({ pressed }) => [
          styles.trigger,
          { borderColor, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            isPlaceholder && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <RNModal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, shadows.lg]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value as V);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    item.value === value && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2.5],
    gap: spacing[2],
  },
  triggerText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textMuted,
  },
  chevron: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  error: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing[0.5],
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: 320,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.infoBg,
  },
  optionPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  checkmark: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});
