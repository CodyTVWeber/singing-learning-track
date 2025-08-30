import React from 'react';
import { colors, spacing, shadows, transitions, fontSize, fontWeight } from '../theme/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  sticky?: boolean;
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
  className = '',
  style,
}) => {
  const headerStyles: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: transparent ? 'transparent' : colors.surface,
    boxShadow: transparent ? 'none' : shadows.sm,
    padding: `${spacing.md} ${spacing.lg}`,
    transition: transitions.normal,
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
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: 'white',
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
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
          {title && <h1 style={titleStyles} >{title}</h1>}
          {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        </div>
        
        <div style={actionStyles}>
          {rightAction}
        </div>
      </div>
    </header>
  );
};