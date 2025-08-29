import React, { useEffect, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, transitions } from '../theme/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlay = true,
  showCloseButton = true,
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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizeMap = {
    small: { maxWidth: '400px', maxHeight: '70vh' },
    medium: { maxWidth: '600px', maxHeight: '80vh' },
    large: { maxWidth: '900px', maxHeight: '90vh' },
    fullscreen: { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' },
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === 'fullscreen' ? 0 : spacing.lg,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen || isAnimating ? 'visible' : 'hidden',
    transition: transitions.normal,
    zIndex: 1500,
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: size === 'fullscreen' ? 0 : borderRadius.lg,
    boxShadow: shadows.xl,
    width: '100%',
    ...sizeMap[size],
    display: 'flex',
    flexDirection: 'column',
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    opacity: isOpen ? 1 : 0,
    transition: transitions.normal,
    overflow: 'hidden',
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.featherLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.round,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
    border: 'none',
    color: colors.textLight,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.lg,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  };

  const footerStyles: React.CSSProperties = {
    padding: spacing.lg,
    borderTop: `1px solid ${colors.featherLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
    flexShrink: 0,
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      style={overlayStyles}
      onClick={closeOnOverlay ? onClose : undefined}
      role="presentation"
    >
      <div 
        className={className}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 id="modal-title" style={titleStyles}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div style={contentStyles}>
          {children}
        </div>
        
        {footer && (
          <div style={footerStyles}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};