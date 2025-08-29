import React from 'react';
import { colors, spacing, fontSize, transitions } from '../theme/theme';

interface FooterProps {
  children?: React.ReactNode;
  fixed?: boolean;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({
  children,
  fixed = false,
  backgroundColor = colors.primary,
  textColor = 'white',
  className = '',
  style,
}) => {
  const footerStyles: React.CSSProperties = {
    position: fixed ? 'fixed' : 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor,
    color: textColor,
    padding: `${spacing.lg} ${spacing.md}`,
    transition: transitions.normal,
    zIndex: 900,
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: fontSize.sm,
  };

  return (
    <footer className={className} style={footerStyles}>
      <div style={containerStyles}>
        {children || (
          <p>© {new Date().getFullYear()} Kooka Sing. All rights reserved.</p>
        )}
      </div>
    </footer>
  );
};