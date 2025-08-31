import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, transitions, gradients } from '../theme/theme';

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
    transition: `background-color ${transitions.fast}, transform ${transitions.fast}, box-shadow ${transitions.fast}`,
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
    zIndex: 1,
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

  const getHoverStyles = (): React.CSSProperties => {
    if (props.disabled) return {};
    
    const baseHover = {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: shadows.xl,
    };
    
    switch (variant) {
      case 'primary':
        return { ...baseHover, backgroundColor: colors.warning };
      case 'secondary':
        return { ...baseHover, backgroundColor: colors.secondaryLight };
      case 'outline':
        return { 
          ...baseHover, 
          backgroundColor: colors.featherLight,
          color: colors.text,
          borderColor: colors.warning,
        };
      case 'ghost':
        return { 
          backgroundColor: colors.bellyCreamy,
          transform: 'translateY(-1px)',
        };
      case 'gradient':
        return { 
          ...baseHover,
          background: gradients.sunset,
          boxShadow: `${shadows.colored} ${colors.warning}`,
        };
      default:
        return baseHover;
    }
  };
  
  const getActiveStyles = (): React.CSSProperties => {
    if (props.disabled) return {};
    return {
      transform: 'translateY(0) scale(0.98)',
      boxShadow: shadows.sm,
    };
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      {...props}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...(isHovered ? getHoverStyles() : {}),
        ...(isActive ? getActiveStyles() : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        setIsActive(false);
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setIsActive(true);
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setIsActive(false);
        props.onMouseUp?.(e);
      }}
    >
      {/* Ripple effect for gradient variant */}
      {variant === 'gradient' && isActive && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 'inherit',
            background: 'rgba(255, 255, 255, 0.3)',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      )}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};