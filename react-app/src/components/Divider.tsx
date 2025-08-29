import React from 'react';
import { colors, spacing, fontSize } from '../theme/theme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  spacing?: keyof typeof spacing | number;
  children?: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  color = colors.featherLight,
  spacing: spacingProp = 'md',
  children,
  textAlign = 'center',
  className = '',
  style,
}) => {
  const spacingValue = typeof spacingProp === 'string' ? spacing[spacingProp] : `${spacingProp}px`;

  if (orientation === 'vertical') {
    const verticalStyles: React.CSSProperties = {
      display: 'inline-block',
      width: `${thickness}px`,
      height: '100%',
      minHeight: '20px',
      backgroundColor: variant === 'solid' ? color : 'transparent',
      borderLeft: variant !== 'solid' ? `${thickness}px ${variant} ${color}` : 'none',
      margin: `0 ${spacingValue}`,
      ...style,
    };

    return <div className={className} style={verticalStyles} aria-orientation="vertical" />;
  }

  // Horizontal divider
  if (children) {
    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      margin: `${spacingValue} 0`,
      ...style,
    };

    const lineStyles: React.CSSProperties = {
      flex: textAlign === 'center' ? 1 : textAlign === 'left' ? '0 0 auto' : 1,
      height: `${thickness}px`,
      backgroundColor: variant === 'solid' ? color : 'transparent',
      borderTop: variant !== 'solid' ? `${thickness}px ${variant} ${color}` : 'none',
    };

    const textStyles: React.CSSProperties = {
      padding: `0 ${spacing.md}`,
      fontSize: fontSize.sm,
      color: colors.textLight,
      whiteSpace: 'nowrap',
    };

    return (
      <div className={className} style={containerStyles} role="separator" aria-orientation="horizontal">
        {textAlign !== 'right' && <div style={lineStyles} />}
        <span style={textStyles}>{children}</span>
        {textAlign !== 'left' && <div style={lineStyles} />}
      </div>
    );
  }

  const horizontalStyles: React.CSSProperties = {
    width: '100%',
    height: `${thickness}px`,
    backgroundColor: variant === 'solid' ? color : 'transparent',
    borderTop: variant !== 'solid' ? `${thickness}px ${variant} ${color}` : 'none',
    margin: `${spacingValue} 0`,
    ...style,
  };

  return <div className={className} style={horizontalStyles} role="separator" aria-orientation="horizontal" />;
};