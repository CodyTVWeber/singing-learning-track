import React, { useState } from 'react';
import { colors, spacing, shadows, transitions, fontSize, fontWeight, borderRadius } from '../theme/theme';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavLink[];
  onLinkClick?: (link: NavLink) => void;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  links = [],
  onLinkClick,
  sticky = true,
  transparent = false,
  className = '',
  style,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navbarStyles: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: transparent ? 'transparent' : colors.surface,
    boxShadow: transparent ? 'none' : shadows.sm,
    transition: transitions.normal,
    zIndex: 1000,
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing.md} ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const brandStyles: React.CSSProperties = {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const desktopLinksStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  };

  const linkStyles = (active?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    fontSize: fontSize.md,
    fontWeight: active ? fontWeight.semibold : fontWeight.normal,
    color: active ? colors.primary : colors.text,
    backgroundColor: active ? colors.featherLight : 'transparent',
    transition: transitions.fast,
    cursor: 'pointer',
  });

  const mobileMenuButtonStyles: React.CSSProperties = {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
    width: '40px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: transitions.fast,
  };

  const mobileMenuStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    boxShadow: shadows.lg,
    maxHeight: mobileMenuOpen ? '400px' : '0',
    overflow: 'hidden',
    transition: transitions.normal,
  };

  const mobileLinksContainerStyles: React.CSSProperties = {
    padding: spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  };

  const hamburgerLineStyles: React.CSSProperties = {
    width: '24px',
    height: '2px',
    backgroundColor: colors.text,
    transition: transitions.fast,
  };

  return (
    <nav className={className} style={navbarStyles}>
      <div style={containerStyles}>
        {brand && <div style={brandStyles}>{brand}</div>}
        
        {/* Desktop Links */}
        <div style={desktopLinksStyles}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              style={linkStyles(link.active)}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.(link);
              }}
              onMouseEnter={(e) => {
                if (!link.active) {
                  e.currentTarget.style.backgroundColor = colors.background;
                }
              }}
              onMouseLeave={(e) => {
                if (!link.active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          style={mobileMenuButtonStyles}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              ...hamburgerLineStyles,
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
            }} />
            <div style={{
              ...hamburgerLineStyles,
              opacity: mobileMenuOpen ? 0 : 1,
            }} />
            <div style={{
              ...hamburgerLineStyles,
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
            }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyles}>
        <div style={mobileLinksContainerStyles}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              style={linkStyles(link.active)}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onLinkClick?.(link);
              }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-mobile-button { display: flex !important; }
        }
        @media (min-width: 769px) {
          .navbar-desktop-links { display: flex !important; }
          .navbar-mobile-button { display: none !important; }
        }
      `}</style>
    </nav>
  );
};