import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, fontSize, borderRadius, shadows, transitions } from '../theme/theme';
import { Icon } from './Icon';

export const DevNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const links = [
    { path: '/', label: 'Home' },
    { path: '/onboarding', label: 'Onboarding' },
    { path: '/skill-tree', label: 'Skill Tree' },
    { path: '/showcase', label: 'Component Showcase' },
  ];

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  };

  const buttonStyles: React.CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.round,
    backgroundColor: colors.secondary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.lg,
    cursor: 'pointer',
    border: 'none',
    fontSize: fontSize.xl,
    transition: transitions.fast,
  };

  const menuStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '70px',
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    boxShadow: shadows.xl,
    padding: spacing.sm,
    minWidth: '200px',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
    transition: transitions.fast,
  };

  const linkStyles = (isActive: boolean): React.CSSProperties => ({
    display: 'block',
    padding: `${spacing.sm} ${spacing.md}`,
    color: isActive ? colors.primary : colors.text,
    backgroundColor: isActive ? colors.featherLight : 'transparent',
    borderRadius: borderRadius.sm,
    textDecoration: 'none',
    fontSize: fontSize.md,
    fontWeight: isActive ? 600 : 400,
    transition: transitions.fast,
    cursor: 'pointer',
  });

  const labelStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '70px',
    right: '60px',
    backgroundColor: colors.darkBrown,
    color: 'white',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.xs,
    whiteSpace: 'nowrap',
    opacity: isOpen ? 0 : 1,
    transition: transitions.fast,
  };

  return (
    <div style={containerStyles}>
      <div style={labelStyles}>Dev Menu</div>
      
      <button
        style={buttonStyles}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle development navigation"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Icon name="settings" color="white" />
      </button>

      <div style={menuStyles}>
        <div style={{ marginBottom: spacing.xs, padding: `${spacing.xs} ${spacing.md}`, fontSize: fontSize.sm, color: colors.textLight }}>
          Development Navigation
        </div>
        {links.map((link) => (
          <a
            key={link.path}
            href={link.path}
            style={linkStyles(location.pathname === link.path)}
            onClick={(e) => {
              e.preventDefault();
              navigate(link.path);
              setIsOpen(false);
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== link.path) {
                e.currentTarget.style.backgroundColor = colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== link.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};