import React, { useEffect, useState } from 'react';
import { colors, spacing, shadows, transitions, fontSize, fontWeight, gradients, blurs, borderRadius } from '../theme/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  sticky?: boolean;
  variant?: 'default' | 'gradient' | 'glass' | 'minimal';
  showKookaburra?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  transparent = false,
  sticky = true,
  variant = 'default',
  showKookaburra = false,
  className = '',
  style,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (sticky && !transparent) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 10);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sticky, transparent]);

  const getVariantStyles = (): React.CSSProperties => {
    if (transparent) return { backgroundColor: 'transparent', boxShadow: 'none' };
    
    switch (variant) {
      case 'gradient':
        return {
          background: gradients.feather,
          boxShadow: scrolled ? shadows.lg : shadows.md,
          backdropFilter: `blur(${blurs.sm})`,
          WebkitBackdropFilter: `blur(${blurs.sm})`,
        };
      case 'glass':
        return {
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: `blur(${blurs.md})`,
          WebkitBackdropFilter: `blur(${blurs.md})`,
          boxShadow: scrolled ? shadows.md : shadows.sm,
          borderBottom: `1px solid ${colors.gray100}`,
        };
      case 'minimal':
        return {
          backgroundColor: colors.background,
          boxShadow: 'none',
          borderBottom: `1px solid ${scrolled ? colors.gray200 : colors.gray100}`,
        };
      default:
        return {
          backgroundColor: colors.surface,
          boxShadow: scrolled ? shadows.md : shadows.sm,
        };
    }
  };

  const headerStyles: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: `${spacing.md} ${spacing.lg}`,
    transition: transitions.smooth,
    ...getVariantStyles(),
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };

  const titleSectionStyles: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const getTitleColor = () => {
    if (variant === 'gradient') return colors.text;
    if (variant === 'glass' || variant === 'minimal') return colors.text;
    return colors.text;
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: getTitleColor(),
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    letterSpacing: '-0.02em',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: variant === 'gradient' ? colors.text : colors.textLight,
    margin: 0,
    opacity: 0.9,
  };

  const actionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minWidth: '44px',
    minHeight: '44px',
  };

  return (
    <header className={className} style={headerStyles}>
      <div style={containerStyles}>
        <div style={actionStyles}>
          {leftAction}
        </div>
        
        <div style={titleSectionStyles}>
          {title && (
            <h1 style={titleStyles}>
              {showKookaburra && (
                <img
                  src="/img/kooka-burra-waiving.png"
                  alt="Kooka"
                  style={{
                    width: '32px',
                    objectFit: 'contain',
                  }}
                />
              )}
              {title}
            </h1>
          )}
          {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        </div>
        
        <div style={actionStyles}>
          {rightAction}
        </div>
      </div>
      
      {/* Decorative gradient line for gradient variant */}
      {variant === 'gradient' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: gradients.sunset,
            opacity: scrolled ? 1 : 0.5,
            transition: transitions.normal,
          }}
        />
      )}
    </header>
  );
};