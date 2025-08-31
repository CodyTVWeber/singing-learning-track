import React, { useEffect, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, shadows, transitions, gradients, fontWeight, animations, blurs } from '../theme/theme';
import { Icon } from './Icon';

interface ToastProps {
  id: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  message,
  duration = 3000,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining > 0) {
          requestAnimationFrame(updateProgress);
        } else {
          handleClose();
        }
      };
      
      requestAnimationFrame(updateProgress);
      
      return () => {
        // Cleanup if needed
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const typeConfig = {
    info: { 
      gradient: gradients.feather,
      icon: 'info',
      color: colors.info,
    },
    success: { 
      gradient: gradients.forest,
      icon: 'check',
      color: colors.success,
    },
    warning: { 
      gradient: gradients.warm,
      icon: 'warning',
      color: colors.warning,
    },
    error: { 
      gradient: gradients.sunset,
      icon: 'error',
      color: colors.error,
    },
  };

  const currentConfig = typeConfig[type];

  const toastStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    background: colors.surface,
    borderRadius: borderRadius.xl,
    boxShadow: `${shadows.xl}, 0 0 0 2px ${currentConfig.color}20`,
    minWidth: '320px',
    maxWidth: '480px',
    fontSize: fontSize.md,
    transform: isVisible && !isLeaving 
      ? 'translateX(0) scale(1)' 
      : 'translateX(100%) scale(0.95)',
    opacity: isVisible && !isLeaving ? 1 : 0,
    transition: `all ${transitions.smooth}`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: `blur(${blurs.sm})`,
    WebkitBackdropFilter: `blur(${blurs.sm})`,
    border: `1px solid ${colors.gray100}`,
  };

  const iconContainerStyles: React.CSSProperties = {
    flexShrink: 0,
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.round,
    background: currentConfig.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.md,
    animation: type === 'success' ? animations.bounce : animations.pulse,
  };

  const messageStyles: React.CSSProperties = {
    flex: 1,
    lineHeight: 1.5,
    color: colors.text,
    fontWeight: fontWeight.medium,
  };

  const closeButtonStyles: React.CSSProperties = {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: borderRadius.round,
    border: 'none',
    backgroundColor: colors.gray100,
    color: colors.textLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
  };

  const progressBarStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: `${progress}%`,
    background: currentConfig.gradient,
    transition: 'width 100ms linear',
    borderRadius: borderRadius.pill,
  };

  const actionButtonStyles: React.CSSProperties = {
    marginLeft: spacing.sm,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.md,
    border: 'none',
    background: currentConfig.gradient,
    color: colors.textOnPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    cursor: 'pointer',
    transition: transitions.fast,
  };

  return (
    <div
      style={toastStyles}
      onClick={handleClose}
      role="alert"
      aria-live="polite"
    >
      {/* Icon Container with Emoji/Icon */}
      <div style={iconContainerStyles}>
        <Icon name={currentConfig.icon} size={20} color={colors.textOnPrimary} />
      </div>

      {/* Message */}
      <div style={messageStyles}>
        {message}
        {action && (
          <button
            style={actionButtonStyles}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              handleClose();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = shadows.sm;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        style={closeButtonStyles}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Close notification"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.gray200;
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.gray100;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Icon name="close" size={16} />
      </button>

      {/* Progress Bar */}
      {duration > 0 && <div style={progressBarStyles} />}

      {/* Decorative blur */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '100px',
          height: '100px',
          background: currentConfig.gradient,
          borderRadius: '50%',
          filter: `blur(${blurs.xl})`,
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onClose = () => {},
}) => {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: spacing.lg, right: spacing.lg, alignItems: 'flex-end' },
    'top-left': { top: spacing.lg, left: spacing.lg, alignItems: 'flex-start' },
    'bottom-right': { bottom: spacing.lg, right: spacing.lg, alignItems: 'flex-end' },
    'bottom-left': { bottom: spacing.lg, left: spacing.lg, alignItems: 'flex-start' },
    'top-center': { top: spacing.lg, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
    'bottom-center': { bottom: spacing.lg, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  };

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    zIndex: 2000,
    pointerEvents: 'none',
    ...positionStyles[position],
  };

  return (
    <div style={containerStyles}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            animation: `slideIn 0.3s ease-out ${index * 0.05}s`,
          }}
        >
          <Toast
            {...toast}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};