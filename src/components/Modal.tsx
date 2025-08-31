import React, { useEffect, useState, useRef } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, transitions, gradients, blurs } from '../theme/theme';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  variant?: 'default' | 'gradient' | 'glass';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  showKookaburra?: boolean;
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
  variant = 'default',
  closeOnOverlay = true,
  showCloseButton = true,
  showKookaburra = false,
  className = '',
  style,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Randomize kooka image for modal variety
  const kookaImages = [
    '/img/kooka-burra-waiving.png',
    '/img/kooka-burra-calling-out.png',
    '/img/kooka-burra-singing.png',
  ];
  const [kookaImage] = useState(() => kookaImages[Math.floor(Math.random() * kookaImages.length)]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          (firstFocusable as HTMLElement).focus();
        }
      }
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
    medium: { maxWidth: '600px', maxHeight: '85vh' },
    large: { maxWidth: '900px', maxHeight: '90vh' },
    fullscreen: { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' },
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: variant === 'glass' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: variant === 'glass' ? `blur(${blurs.md})` : 'none',
    WebkitBackdropFilter: variant === 'glass' ? `blur(${blurs.md})` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === 'fullscreen' ? 0 : spacing.lg,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen || isAnimating ? 'visible' : 'hidden',
    pointerEvents: isOpen || isAnimating ? 'auto' : 'none',
    transition: transitions.smooth,
    zIndex: 1500,
  };

  const getModalVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'gradient':
        return {
          backgroundColor: colors.surface,
          backgroundImage: gradients.soft,
          border: `1px solid ${colors.gray100}`,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: `blur(${blurs.lg})`,
          WebkitBackdropFilter: `blur(${blurs.lg})`,
          border: `1px solid rgba(255, 255, 255, 0.3)`,
        };
      default:
        return {
          backgroundColor: colors.surface,
          border: 'none',
        };
    }
  };

  const modalStyles: React.CSSProperties = {
    ...getModalVariantStyles(),
    borderRadius: size === 'fullscreen' ? 0 : borderRadius.xxl,
    boxShadow: shadows.xxl,
    width: '100%',
    ...sizeMap[size],
    display: 'flex',
    flexDirection: 'column',
    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
    opacity: isOpen ? 1 : 0,
    transition: `all ${transitions.smooth}`,
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    borderBottom: variant === 'gradient' ? 'none' : `1px solid ${colors.gray100}`,
    background: variant === 'gradient' ? gradients.primary : 'transparent',
    color: variant === 'gradient' ? colors.textOnPrimary : colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: variant === 'gradient' ? colors.textOnPrimary : colors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const closeButtonStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: borderRadius.round,
    border: 'none',
    backgroundColor: variant === 'gradient' ? 'rgba(255, 255, 255, 0.2)' : colors.gray100,
    color: variant === 'gradient' ? colors.textOnPrimary : colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
    flexShrink: 0,
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.xl,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.gray300} ${colors.gray100}`,
  };

  const footerStyles: React.CSSProperties = {
    padding: spacing.lg,
    borderTop: `1px solid ${colors.gray100}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.md,
    flexShrink: 0,
    background: variant === 'glass' ? 'rgba(255, 255, 255, 0.5)' : colors.background,
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={className}
      style={overlayStyles}
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Decorative elements */}
        {variant === 'gradient' && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '200px',
                height: '200px',
                background: gradients.secondary,
                borderRadius: '50%',
                filter: `blur(${blurs.xl})`,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '150px',
                height: '150px',
                background: gradients.sunset,
                borderRadius: '50%',
                filter: `blur(${blurs.xl})`,
                opacity: 0.3,
              }}
            />
          </>
        )}

        {(title || showCloseButton) && (
          <div style={headerStyles}>
            <h2 id="modal-title" style={titleStyles}>
              {showKookaburra && (
                <img
                  src={kookaImage}
                  alt="Kooka"
                  style={{
                    width: '32px',
                  }}
                />
              )}
              {title}
            </h2>
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = variant === 'gradient' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : colors.gray200;
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = variant === 'gradient' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : colors.gray100;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>
        )}

        <div style={contentStyles}>
          {children}
        </div>

        {footer && <div style={footerStyles}>{footer}</div>}
      </div>
    </div>
  );
};

// Modal Context for nested modals
interface ModalContextProps {
  openModals: string[];
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
}

export const ModalContext = React.createContext<ModalContextProps>({
  openModals: [],
  registerModal: () => {},
  unregisterModal: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openModals, setOpenModals] = useState<string[]>([]);

  const registerModal = (id: string) => {
    setOpenModals((prev) => [...prev, id]);
  };

  const unregisterModal = (id: string) => {
    setOpenModals((prev) => prev.filter((modalId) => modalId !== id));
  };

  return (
    <ModalContext.Provider value={{ openModals, registerModal, unregisterModal }}>
      {children}
    </ModalContext.Provider>
  );
};