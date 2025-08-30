import React from 'react';
import { colors, spacing, fontSize, fontWeight, borderRadius, transitions, shadows } from '../theme/theme';

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T, index: number) => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  striped = false,
  hoverable = true,
  compact = false,
  stickyHeader = false,
  className = '',
  style,
}: TableProps<T>) {
  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    boxShadow: shadows.sm,
    ...style,
  };

  const tableWrapperStyles: React.CSSProperties = {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: borderRadius.md,
  };

  const theadStyles: React.CSSProperties = {
    backgroundColor: colors.background,
    position: stickyHeader ? 'sticky' : 'relative',
    top: 0,
    zIndex: 10,
  };

  const thStyles = (align?: string): React.CSSProperties => ({
    padding: compact ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.lg}`,
    textAlign: (align || 'left') as any,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `1px solid ${colors.featherLight}`,
  });

  const trStyles = (index: number): React.CSSProperties => ({
    backgroundColor: striped && index % 2 === 1 ? colors.background : 'transparent',
    cursor: onRowClick ? 'pointer' : 'default',
    transition: transitions.fast,
  });

  const tdStyles = (align?: string): React.CSSProperties => ({
    padding: compact ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.lg}`,
    textAlign: (align || 'left') as any,
    fontSize: fontSize.md,
    color: colors.text,
    borderBottom: `1px solid ${colors.featherLight}`,
  });

  const getValue = (item: T, key: string) => {
    const keys = key.split('.');
    let value: any = item;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  return (
    <div style={tableWrapperStyles}>
      <table className={className} style={tableStyles}>
        <thead style={theadStyles}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  ...thStyles(column.align),
                  width: column.width,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              style={trStyles(rowIndex)}
              onClick={() => onRowClick?.(item, rowIndex)}
              onMouseEnter={(e) => {
                if (hoverable) {
                  e.currentTarget.style.backgroundColor = colors.featherLight;
                }
              }}
              onMouseLeave={(e) => {
                if (hoverable) {
                  e.currentTarget.style.backgroundColor = 
                    striped && rowIndex % 2 === 1 ? colors.background : 'transparent';
                }
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={tdStyles(column.align)}
                >
                  {column.render
                    ? column.render(getValue(item, column.key as string), item, rowIndex)
                    : getValue(item, column.key as string)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div
          style={{
            padding: spacing.xl,
            textAlign: 'center',
            color: colors.textLight,
            fontSize: fontSize.md,
          }}
        >
          No data available
        </div>
      )}
    </div>
  );
}

interface SimpleTableProps {
  headers?: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
  style?: React.CSSProperties;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  rows,
  className = '',
  style,
}) => {
  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    ...style,
  };

  const cellStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.featherLight}`,
    fontSize: fontSize.md,
  };

  const headerCellStyles: React.CSSProperties = {
    ...cellStyles,
    fontWeight: fontWeight.semibold,
    color: colors.textLight,
    backgroundColor: colors.background,
  };

  return (
    <table className={className} style={tableStyles}>
      {headers && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={headerCellStyles}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={cellStyles}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};