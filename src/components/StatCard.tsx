import React from 'react';
import { Card } from './Card';
import { spacing, fontSize, fontWeight, blurs } from '../theme/theme';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  accent?: 'primary' | 'secondary' | 'success';
  minWidth?: number | string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  accent = 'primary',
  minWidth = 120,
  style,
}) => {
  const backdrop = accent === 'success' ? 'rgba(255, 255, 255, 0.15)'
    : accent === 'secondary' ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(255, 255, 255, 0.8)';

  const border = accent === 'success' ? '1px solid rgba(255, 255, 255, 0.3)'
    : '1px solid rgba(255, 255, 255, 0.5)';

  return (
    <Card
      variant="glass"
      style={{
        padding: spacing.lg,
        textAlign: 'center',
        minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
        background: backdrop,
        backdropFilter: `blur(${blurs.md})`,
        WebkitBackdropFilter: `blur(${blurs.md})`,
        border,
        ...style,
      }}
    >
      <div style={{ fontSize: fontSize.xs, opacity: 0.9, marginBottom: spacing.xs }}>
        {label}
      </div>
      <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
        {value}
      </div>
    </Card>
  );
};

export default StatCard;

