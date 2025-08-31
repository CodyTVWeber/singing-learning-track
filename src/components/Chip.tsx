import React, { useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions, shadows, gradients } from '../theme/theme';

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
  type ChipColorKey = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  interface ChipColorConfig { bg: string; text: string; border: string; gradient: string }
  const colorMap: Record<ChipColorKey, ChipColorConfig> = {
    primary: { bg: colors.primary, text: colors.textOnPrimary, border: colors.primary, gradient: gradients.primary },
    secondary: { bg: colors.secondary, text: colors.textOnSecondary, border: colors.secondary, gradient: gradients.secondary },
    success: { bg: colors.success, text: colors.textOnPrimary, border: colors.success, gradient: gradients.forest },
    warning: { bg: colors.warning, text: colors.text, border: colors.warning, gradient: gradients.warm },
    error: { bg: colors.error, text: colors.textOnPrimary, border: colors.error, gradient: gradients.sunset },
    default: { bg: colors.gray100, text: colors.text, border: colors.gray300, gradient: colors.gray100 },
  };

  const currentColor = colorMap[color];

  const [isHovered, setIsHovered] = useState(false);

  const chipStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    height: size === 'small' ? '28px' : '36px',
    padding: avatar ? `2px ${spacing.md} 2px 2px` : `0 ${spacing.md}`,
    background: variant === 'filled' ? 
      (selected ? currentColor.gradient : currentColor.gradient) : 
      'transparent',
    backgroundColor: variant === 'filled' && !currentColor.gradient ? currentColor.bg : 'transparent',
    color: variant === 'filled' ? currentColor.text : currentColor.border,
    border: variant === 'outlined' ? `2px solid ${currentColor.border}` : 'none',
    borderRadius: borderRadius.pill,
    fontSize: size === 'small' ? fontSize.xs : fontSize.sm,
    fontWeight: fontWeight.semibold,
    cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    transition: transitions.smooth,
    transform: isHovered && !disabled ? 'scale(1.05)' : 'scale(1)',
    boxShadow: selected || (isHovered && !disabled) ? shadows.md : 'none',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
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
        setIsHovered(true);
        if (!disabled && onClick) {
          e.currentTarget.style.boxShadow = shadows.sm;
          if (variant === 'outlined') {
            e.currentTarget.style.backgroundColor = `${currentColor.bg}10`;
          }
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
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