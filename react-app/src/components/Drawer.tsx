import React, { useEffect, useState } from 'react';
import { colors, spacing, shadows, transitions, borderRadius } from '../theme/theme';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'top';
  height?: string;
  showHandle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
  height = '50vh',
  showHandle = true,
  className = '',
  style,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragging, setDragging] = useState(false);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    
    const deltaY = e.touches[0].clientY - startY;
    const shouldClose = position === 'bottom' ? deltaY > 100 : deltaY < -100;
    
    if (shouldClose) {
      onClose();
      setDragging(false);
    }
    
    setCurrentY(deltaY);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setCurrentY(0);
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen || isAnimating ? 'visible' : 'hidden',
    transition: transitions.normal,
    zIndex: 1100,
  };

  const drawerStyles: React.CSSProperties = {
    position: 'fixed',
    [position]: 0,
    left: 0,
    right: 0,
    height,
    maxHeight: '90vh',
    backgroundColor: colors.surface,
    borderTopLeftRadius: position === 'bottom' ? borderRadius.xl : 0,
    borderTopRightRadius: position === 'bottom' ? borderRadius.xl : 0,
    borderBottomLeftRadius: position === 'top' ? borderRadius.xl : 0,
    borderBottomRightRadius: position === 'top' ? borderRadius.xl : 0,
    boxShadow: shadows.xl,
    transform: isOpen 
      ? `translateY(${currentY}px)` 
      : `translateY(${position === 'bottom' ? '100%' : '-100%'})`,
    transition: dragging ? 'none' : transitions.normal,
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  const handleStyles: React.CSSProperties = {
    width: '48px',
    height: '4px',
    backgroundColor: colors.featherLight,
    borderRadius: borderRadius.round,
    margin: `${spacing.sm} auto`,
    cursor: 'grab',
  };

  const headerStyles: React.CSSProperties = {
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid ${colors.featherLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  };

  const closeButtonStyles: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
    fontSize: '20px',
    border: 'none',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.lg,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div 
        style={overlayStyles} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={className} 
        style={drawerStyles}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Drawer"}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {showHandle && position === 'bottom' && (
          <div style={handleStyles} />
        )}
        
        {title && (
          <div style={headerStyles}>
            <h2 style={titleStyles}>{title}</h2>
            <button
              style={closeButtonStyles}
              onClick={onClose}
              aria-label="Close drawer"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.featherLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background;
              }}
            >
              ×
            </button>
          </div>
        )}
        
        {showHandle && position === 'top' && (
          <div style={handleStyles} />
        )}
        
        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </>
  );
};