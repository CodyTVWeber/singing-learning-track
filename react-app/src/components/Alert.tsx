import React from 'react';
import { colors, spacing, borderRadius, fontSize, shadows, transitions } from '../theme/theme';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  className = '',
  style,
}) => {
  const typeColors = {
    info: { bg: colors.skyLight, text: colors.darkBrown, icon: colors.secondary },
    success: { bg: '#E8F5E9', text: colors.darkBrown, icon: colors.success },
    warning: { bg: '#FFF3E0', text: colors.darkBrown, icon: colors.warning },
    error: { bg: '#FFEBEE', text: colors.darkBrown, icon: colors.error },
  };

  const currentColors = typeColors[type];

  const alertStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: currentColors.bg,
    borderRadius: borderRadius.md,
    boxShadow: shadows.sm,
    position: 'relative',
    ...style,
  };

  const iconWrapperStyles: React.CSSProperties = {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: currentColors.icon,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: currentColors.text,
    marginBottom: spacing.xs,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: currentColors.text,
    lineHeight: 1.5,
  };

  const closeButtonStyles: React.CSSProperties = {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: transitions.fast,
    border: 'none',
    color: currentColors.text,
  };

  const defaultIcons = {
    info: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
      </svg>
    ),
  };

  return (
    <div className={className} style={alertStyles} role="alert">
      <div style={iconWrapperStyles}>
        {icon || defaultIcons[type]}
      </div>
      
      <div style={contentStyles}>
        {title && <div style={titleStyles}>{title}</div>}
        <div style={messageStyles}>{message}</div>
      </div>
      
      {onClose && (
        <button
          style={closeButtonStyles}
          onClick={onClose}
          aria-label="Close alert"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      )}
    </div>
  );
};