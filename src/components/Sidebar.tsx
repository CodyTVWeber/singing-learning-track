import React, { useState, useEffect } from 'react';
import { colors, spacing, shadows, transitions, borderRadius } from '../theme/theme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: string;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  position = 'left',
  width = '280px',
  children,
  overlay = true,
  className = '',
  style,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen || isAnimating ? 'visible' : 'hidden',
    pointerEvents: isOpen || isAnimating ? 'auto' : 'none',
    transition: transitions.normal,
    zIndex: 1100,
  };

  const sidebarStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    [position]: 0,
    width,
    maxWidth: '90vw',
    backgroundColor: colors.surface,
    boxShadow: shadows.xl,
    transform: isOpen ? 'translateX(0)' : `translateX(${position === 'left' ? '-100%' : '100%'})`,
    transition: transitions.normal,
    zIndex: 1200,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...style,
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.lg,
  };

  const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.md,
    [position === 'left' ? 'right' : 'left']: spacing.md,
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
    fontSize: '24px',
    border: 'none',
    zIndex: 1,
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {overlay && (
        <div 
          style={overlayStyles} 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside 
        className={className} 
        style={sidebarStyles}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <button
          style={closeButtonStyles}
          onClick={onClose}
          aria-label="Close sidebar"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.featherLight;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background;
          }}
        >
          ×
        </button>
        <div style={contentStyles}>
          {children}
        </div>
      </aside>
    </>
  );
};