import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'md',
  onClick,
  className = '',
  style 
}) => {
  const cardStyles: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[padding],
    boxShadow: shadows.md,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 300ms ease-in-out',
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = shadows.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = shadows.md;
        }
      }}
    >
      {children}
    </div>
  );
};