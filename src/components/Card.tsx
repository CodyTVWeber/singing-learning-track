import React, { useState } from 'react';
import { colors, spacing, borderRadius, shadows, transitions, gradients, blurs } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  hoverEffect?: boolean;
  decorative?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'lg',
  onClick,
  className = '',
  style,
  variant = 'default',
  hoverEffect = true,
  decorative = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles: React.CSSProperties = {
    borderRadius: borderRadius.xl,
    padding: spacing[padding],
    cursor: onClick ? 'pointer' : 'default',
    transition: transitions.smooth,
    position: 'relative',
    overflow: 'hidden',
  };
  
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: colors.surface,
      boxShadow: shadows.sm,
      border: `1px solid ${colors.gray100}`,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      boxShadow: shadows.lg,
      border: 'none',
    },
    outlined: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: `2px solid ${colors.gray200}`,
    },
    gradient: {
      background: gradients.soft,
      boxShadow: shadows.md,
      border: `1px solid rgba(255, 255, 255, 0.2)`,
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: `blur(${blurs.md})`,
      WebkitBackdropFilter: `blur(${blurs.md})`,
      boxShadow: shadows.md,
      border: `1px solid rgba(255, 255, 255, 0.3)`,
    },
  };
  
  const hoverStyles: React.CSSProperties = hoverEffect && onClick ? {
    transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered ? shadows.xl : variantStyles[variant].boxShadow,
  } : {};

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...hoverStyles,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      {decorative && variant === 'gradient' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: gradients.ocean,
              borderRadius: '50%',
              filter: `blur(${blurs.xl})`,
              opacity: 0.3,
              transition: transitions.slow,
              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-50%',
              left: '-20%',
              width: '150px',
              height: '150px',
              background: gradients.sunset,
              borderRadius: '50%',
              filter: `blur(${blurs.xl})`,
              opacity: 0.3,
              transition: transitions.slow,
              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      
      {/* Hover glow effect */}
      {hoverEffect && isHovered && variant !== 'outlined' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(74, 144, 226, 0.05)',
            pointerEvents: 'none',
            transition: transitions.fast,
          }}
        />
      )}
    </div>
  );
};