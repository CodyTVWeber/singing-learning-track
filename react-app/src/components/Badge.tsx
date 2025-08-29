import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/theme';

interface BadgeProps {
  children: React.ReactNode;
  count?: number;
  dot?: boolean;
  max?: number;
  showZero?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  count,
  dot = false,
  max = 99,
  showZero = false,
  color = 'error',
  position = 'top-right',
  className = '',
  style,
}) => {
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  const shouldShowBadge = dot || (count !== undefined && (count > 0 || showZero));

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    minWidth: dot ? '8px' : '20px',
    height: dot ? '8px' : '20px',
    padding: dot ? 0 : `0 ${spacing.xs}`,
    backgroundColor: colorMap[color],
    color: 'white',
    borderRadius: borderRadius.round,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${colors.surface}`,
    zIndex: 1,
    ...style,
  };

  const positionMap = {
    'top-right': { top: 0, right: 0, transform: 'translate(50%, -50%)' },
    'top-left': { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
  };

  const displayCount = count !== undefined && count > max ? `${max}+` : count;

  return (
    <div className={className} style={containerStyles}>
      {children}
      {shouldShowBadge && (
        <span
          style={{
            ...badgeStyles,
            ...positionMap[position],
          }}
          aria-label={dot ? 'New notification' : `${count} notifications`}
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
};

interface StandaloneBadgeProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
  onDelete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const StandaloneBadge: React.FC<StandaloneBadgeProps> = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  icon,
  onDelete,
  className = '',
  style,
}) => {
  const colorMap = {
    primary: { bg: colors.primary, text: 'white' },
    secondary: { bg: colors.secondary, text: 'white' },
    success: { bg: colors.success, text: 'white' },
    warning: { bg: colors.warning, text: colors.darkBrown },
    error: { bg: colors.error, text: 'white' },
    default: { bg: colors.featherLight, text: colors.text },
  };

  const currentColor = colorMap[color];

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: size === 'small' ? `2px ${spacing.sm}` : `${spacing.xs} ${spacing.sm}`,
    backgroundColor: variant === 'filled' ? currentColor.bg : 'transparent',
    color: variant === 'filled' ? currentColor.text : currentColor.bg,
    border: variant === 'outlined' ? `1px solid ${currentColor.bg}` : 'none',
    borderRadius: borderRadius.round,
    fontSize: size === 'small' ? fontSize.xs : fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: 1,
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    width: size === 'small' ? '12px' : '14px',
    height: size === 'small' ? '12px' : '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const deleteButtonStyles: React.CSSProperties = {
    marginLeft: spacing.xs,
    marginRight: `-${spacing.xs}`,
    width: size === 'small' ? '14px' : '16px',
    height: size === 'small' ? '14px' : '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: transitions.fast,
    opacity: 0.7,
  };

  return (
    <span className={className} style={badgeStyles}>
      {icon && <span style={iconStyles}>{icon}</span>}
      {label}
      {onDelete && (
        <button
          style={deleteButtonStyles}
          onClick={onDelete}
          aria-label={`Remove ${label}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg viewBox="0 0 14 14" fill="currentColor">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"/>
          </svg>
        </button>
      )}
    </span>
  );
};