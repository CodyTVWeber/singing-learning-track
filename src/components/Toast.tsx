import React, { useEffect, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, shadows, transitions } from '../theme/theme';

interface ToastProps {
  id: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const typeColors = {
    info: { bg: colors.secondary, text: 'white' },
    success: { bg: colors.success, text: 'white' },
    warning: { bg: colors.warning, text: colors.darkBrown },
    error: { bg: colors.error, text: 'white' },
  };

  const currentColors = typeColors[type];

  const toastStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: currentColors.bg,
    color: currentColors.text,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    minWidth: '280px',
    maxWidth: '400px',
    fontSize: fontSize.sm,
    transform: isVisible && !isLeaving ? 'translateY(0)' : 'translateY(-20px)',
    opacity: isVisible && !isLeaving ? 1 : 0,
    transition: transitions.normal,
    cursor: 'pointer',
  };

  const iconStyles: React.CSSProperties = {
    flexShrink: 0,
    width: '20px',
    height: '20px',
  };

  const messageStyles: React.CSSProperties = {
    flex: 1,
    lineHeight: 1.4,
  };

  const icons = {
    info: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyles}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyles}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyles}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyles}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div style={toastStyles} onClick={handleClose} role="alert">
      {icons[type]}
      <span style={messageStyles}>{message}</span>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
  }>;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onClose,
}) => {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: spacing.lg, left: spacing.lg },
    'top-center': { top: spacing.lg, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: spacing.lg, right: spacing.lg },
    'bottom-left': { bottom: spacing.lg, left: spacing.lg },
    'bottom-center': { bottom: spacing.lg, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: spacing.lg, right: spacing.lg },
  };

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 2000,
    display: 'flex',
    flexDirection: position.includes('bottom') ? 'column-reverse' : 'column',
    gap: spacing.sm,
    pointerEvents: 'none',
  };

  const toastWrapperStyles: React.CSSProperties = {
    pointerEvents: 'auto',
  };

  return (
    <div style={containerStyles}>
      {toasts.map((toast) => (
        <div key={toast.id} style={toastWrapperStyles}>
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};