import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions, shadows } from '../theme/theme';

interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  onClick?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  icon,
  avatar,
  onClick,
  onDelete,
  selected = false,
  disabled = false,
  className = '',
  style,
}) => {
  const colorMap = {
    primary: { bg: colors.primary, text: 'white', border: colors.primary },
    secondary: { bg: colors.secondary, text: 'white', border: colors.secondary },
    success: { bg: colors.success, text: 'white', border: colors.success },
    warning: { bg: colors.warning, text: colors.darkBrown, border: colors.warning },
    error: { bg: colors.error, text: 'white', border: colors.error },
    default: { bg: colors.featherLight, text: colors.text, border: colors.featherLight },
  };

  const currentColor = colorMap[color];

  const chipStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    height: size === 'small' ? '24px' : '32px',
    padding: avatar ? `0 ${spacing.sm} 0 0` : `0 ${spacing.sm}`,
    backgroundColor: variant === 'filled' ? 
      (selected ? currentColor.bg : currentColor.bg) : 
      (selected ? `${currentColor.bg}20` : 'transparent'),
    color: variant === 'filled' ? currentColor.text : currentColor.border,
    border: `1px solid ${variant === 'outlined' ? currentColor.border : 'transparent'}`,
    borderRadius: borderRadius.round,
    fontSize: size === 'small' ? fontSize.xs : fontSize.sm,
    fontWeight: fontWeight.medium,
    cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    transition: transitions.fast,
    boxShadow: selected ? shadows.sm : 'none',
    userSelect: 'none',
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    width: size === 'small' ? '16px' : '18px',
    height: size === 'small' ? '16px' : '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: avatar ? 0 : `-${spacing.xs}`,
  };

  const avatarStyles: React.CSSProperties = {
    width: size === 'small' ? '24px' : '32px',
    height: size === 'small' ? '24px' : '32px',
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginLeft: '-1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const deleteButtonStyles: React.CSSProperties = {
    marginLeft: spacing.xs,
    marginRight: `-${spacing.xs}`,
    width: size === 'small' ? '16px' : '18px',
    height: size === 'small' ? '16px' : '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: transitions.fast,
    opacity: 0.7,
    padding: 0,
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  return (
    <div
      className={className}
      style={chipStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      aria-pressed={selected}
      onMouseEnter={(e) => {
        if (!disabled && onClick) {
          e.currentTarget.style.boxShadow = shadows.sm;
          if (variant === 'outlined') {
            e.currentTarget.style.backgroundColor = `${currentColor.bg}10`;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && onClick) {
          e.currentTarget.style.boxShadow = selected ? shadows.sm : 'none';
          if (variant === 'outlined' && !selected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }
      }}
    >
      {avatar && <div style={avatarStyles}>{avatar}</div>}
      {icon && !avatar && <span style={iconStyles}>{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          style={deleteButtonStyles}
          onClick={handleDelete}
          aria-label={`Delete ${label}`}
          disabled={disabled}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <svg viewBox="0 0 14 14" fill="currentColor">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

interface ChipGroupProps {
  children: React.ReactNode;
  gap?: keyof typeof spacing;
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  gap = 'sm',
  wrap = true,
  className = '',
  style,
}) => {
  const groupStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing[gap],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    alignItems: 'center',
    ...style,
  };

  return (
    <div className={className} style={groupStyles}>
      {children}
    </div>
  );
};