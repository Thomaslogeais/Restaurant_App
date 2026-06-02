/**
 * DataList — a responsive list-table primitive for @restaurant/shared.
 *
 * Works as a full-width data table on web and a clean list on mobile.
 * Each column is defined by a key + label; each row is a Record of those keys.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { fontSize, fontWeight } from '../tokens/typography';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DataListColumn {
  /** Matches the key in DataListRow */
  key: string;
  /** Column header text */
  label: string;
  /** Flex ratio — defaults to 1 */
  flex?: number;
  /** Optional text alignment */
  align?: 'left' | 'center' | 'right';
}

export type DataListRow = Record<string, React.ReactNode>;

export interface DataListProps {
  columns: DataListColumn[];
  data: DataListRow[];
  /** Shown when data is empty */
  emptyText?: string;
  /** Horizontal scroll on overflow (default true) */
  scrollable?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DataList({
  columns,
  data,
  emptyText = 'No data',
  scrollable = true,
}: DataListProps) {
  const inner = (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        {columns.map((col) => (
          <View
            key={col.key}
            style={[styles.cell, { flex: col.flex ?? 1 }]}
          >
            <Text
              style={[
                styles.headerText,
                col.align === 'right' && styles.alignRight,
                col.align === 'center' && styles.alignCenter,
              ]}
              numberOfLines={1}
            >
              {col.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Rows */}
      {data.length === 0 ? (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        data.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={[styles.row, styles.dataRow, rowIdx % 2 === 1 && styles.stripeRow]}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                style={[styles.cell, { flex: col.flex ?? 1 }]}
              >
                {typeof row[col.key] === 'string' || typeof row[col.key] === 'number' ? (
                  <Text
                    style={[
                      styles.cellText,
                      col.align === 'right' && styles.alignRight,
                      col.align === 'center' && styles.alignCenter,
                    ]}
                    numberOfLines={1}
                  >
                    {row[col.key] as string}
                  </Text>
                ) : (
                  <View
                    style={[
                      styles.cellNode,
                      col.align === 'right' && styles.nodeRight,
                      col.align === 'center' && styles.nodeCenter,
                    ]}
                  >
                    {row[col.key] as React.ReactNode}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );

  if (!scrollable) return inner;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {inner}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  dataRow: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stripeRow: {
    backgroundColor: colors.background,
  },
  emptyRow: {
    paddingVertical: spacing[6],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  cell: {
    paddingHorizontal: spacing[1],
  },
  headerText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  cellNode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignRight: { textAlign: 'right' },
  alignCenter: { textAlign: 'center' },
  nodeRight: { justifyContent: 'flex-end' },
  nodeCenter: { justifyContent: 'center' },
});
