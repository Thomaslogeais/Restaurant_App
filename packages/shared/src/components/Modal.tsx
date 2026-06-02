import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { fontSize, fontWeight } from '../tokens/typography';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Max height of the content area as a fraction of the screen (0–1). Default 0.85 */
  maxHeightFraction?: number;
  style?: ViewStyle;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  style,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop — use no accessibilityRole so RN Web renders a <div>, not a
          <button>. A nested <button> inside a <button> is invalid HTML. */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop propagation so taps inside the sheet don't close the modal */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centeredView}
        >
          <Pressable style={[styles.sheet, shadows.lg, style]}>
            {/* Header */}
            {title ? (
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                  style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
                >
                  <Text style={styles.closeX}>✕</Text>
                </Pressable>
              </View>
            ) : null}
            {/* Body */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  centeredView: {
    width: '100%',
    maxWidth: 520,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  closeBtn: {
    marginLeft: spacing[3],
    padding: spacing[1],
    borderRadius: radius.full,
  },
  closeBtnPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  closeX: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  body: {
    padding: spacing[6],
  },
});
