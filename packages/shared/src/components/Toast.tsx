import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { fontSize, fontWeight } from '../tokens/typography';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'ADD'; toast: ToastMessage }
  | { type: 'REMOVE'; id: string };

function reducer(state: ToastMessage[], action: Action): ToastMessage[] {
  switch (action.type) {
    case 'ADD':
      return [action.toast, ...state].slice(0, 3); // max 3 toasts
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD', toast: { id, message, type } });
    // Auto-dismiss after 3 s
    setTimeout(() => dispatch({ type: 'REMOVE', id }), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Toast stack — rendered on top of everything */}
      <View style={styles.stack} pointerEvents="none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Single toast item with slide-in animation
// ---------------------------------------------------------------------------

type ToastStyle = { bg: string; text: string; accent: string };

const TOAST_STYLES: Record<ToastType, ToastStyle> = {
  success: { bg: colors.successBg, text: colors.successDark, accent: colors.success },
  error: { bg: colors.errorBg, text: colors.errorDark, accent: colors.error },
  warning: { bg: colors.warningBg, text: colors.warningDark, accent: colors.warning },
  info: { bg: colors.infoBg, text: colors.infoDark, accent: colors.info },
};

const TYPE_ICON: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const { bg, text, accent } = TOAST_STYLES[toast.type];

  return (
    <Animated.View
      style={[
        styles.toast,
        shadows.md,
        { backgroundColor: bg, transform: [{ translateY }], opacity },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <Text style={[styles.icon, { color: accent }]}>{TYPE_ICON[toast.type]}</Text>
      <Text style={[styles.message, { color: text }]} numberOfLines={2}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    top: spacing[12],
    left: spacing[4],
    right: spacing[4],
    gap: spacing[2],
    zIndex: 9999,
    pointerEvents: 'none',
  } as unknown as object,
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    overflow: 'hidden',
    gap: spacing[3],
    paddingRight: spacing[4],
    paddingVertical: spacing[3],
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  icon: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    width: spacing[5],
    textAlign: 'center',
  },
  message: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
