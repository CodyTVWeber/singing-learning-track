import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, gradients } from '../theme/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  ...props 
}) => {
  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? `${spacing.sm} ${spacing.md}` : 
             size === 'large' ? `${spacing.md} ${spacing.xl}` : 
             `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.pill,
    fontSize: size === 'small' ? fontSize.sm : 
              size === 'large' ? fontSize.lg : 
              fontSize.md,
    fontWeight: fontWeight.semibold,
    transition: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: fullWidth ? '100%' : 'auto',
    minHeight: size === 'small' ? '36px' : 
               size === 'large' ? '56px' : 
               '44px',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.textOnPrimary,
      boxShadow: shadows.md,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.textOnSecondary,
      boxShadow: shadows.md,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text,
      boxShadow: 'none',
    },
    gradient: {
      background: gradients.primary,
      color: colors.textOnPrimary,
      boxShadow: shadows.lg,
    },
  };

  // Simplified button: no hover/active animations

  return (
    <button
      {...props}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};