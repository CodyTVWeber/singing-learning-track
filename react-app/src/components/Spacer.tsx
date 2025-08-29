import React from 'react';
import { spacing as themeSpacing } from '../theme/theme';

interface SpacerProps {
  size?: keyof typeof themeSpacing | number;
  direction?: 'horizontal' | 'vertical' | 'both';
  flex?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  flex = false,
  className = '',
  style,
}) => {
  const spacingValue = typeof size === 'number' ? `${size}px` : themeSpacing[size];

  const spacerStyles: React.CSSProperties = {
    ...(flex ? { flex: 1 } : {
      width: direction === 'horizontal' || direction === 'both' ? spacingValue : undefined,
      height: direction === 'vertical' || direction === 'both' ? spacingValue : undefined,
      minWidth: direction === 'horizontal' || direction === 'both' ? spacingValue : undefined,
      minHeight: direction === 'vertical' || direction === 'both' ? spacingValue : undefined,
    }),
    ...style,
  };

  return <div className={className} style={spacerStyles} aria-hidden="true" />;
};