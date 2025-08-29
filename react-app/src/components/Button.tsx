import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, transitions } from '../theme/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  children,
  style,
  ...props 
}) => {
  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? `${spacing.sm} ${spacing.md}` : 
             size === 'large' ? `${spacing.md} ${spacing.xl}` : 
             `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: size === 'small' ? fontSize.sm : 
              size === 'large' ? fontSize.lg : 
              fontSize.md,
    fontWeight: fontWeight.semibold,
    transition: transitions.fast,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: fullWidth ? '100%' : 'auto',
    minHeight: size === 'small' ? '36px' : 
               size === 'large' ? '56px' : 
               '44px',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary,
      color: 'white',
      boxShadow: shadows.md,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: 'white',
      boxShadow: shadows.md,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
    },
  };

  const hoverStyles: React.CSSProperties = props.disabled ? {} : {
    filter: 'brightness(1.1)',
    transform: 'translateY(-1px)',
    boxShadow: shadows.lg,
  };

  return (
    <button
      {...props}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
};