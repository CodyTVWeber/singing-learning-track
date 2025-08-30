import React, { forwardRef } from 'react';
import { colors, spacing, borderRadius, fontSize, transitions, shadows } from '../theme/theme';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  labelPosition = 'right',
  size = 'medium',
  className = '',
  style,
  ...props
}, ref) => {
  const sizes = {
    small: { width: 36, height: 20, thumb: 16 },
    medium: { width: 48, height: 26, thumb: 22 },
    large: { width: 60, height: 32, thumb: 28 },
  };

  const currentSize = sizes[size];

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
    flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
  };

  const switchWrapperStyles: React.CSSProperties = {
    position: 'relative',
    width: `${currentSize.width}px`,
    height: `${currentSize.height}px`,
  };

  const switchStyles: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  };

  const trackStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: props.checked ? colors.primary : colors.featherLight,
    borderRadius: borderRadius.round,
    transition: transitions.fast,
  };

  const thumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: `translateY(-50%) translateX(${props.checked ? currentSize.width - currentSize.thumb - 2 : 2}px)`,
    width: `${currentSize.thumb}px`,
    height: `${currentSize.thumb}px`,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    boxShadow: shadows.sm,
    transition: transitions.fast,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: size === 'small' ? fontSize.sm : size === 'large' ? fontSize.lg : fontSize.md,
    color: colors.text,
    userSelect: 'none',
  };

  return (
    <label style={containerStyles}>
      <div style={switchWrapperStyles}>
        <input
          ref={ref}
          type="checkbox"
          className={className}
          style={{ ...switchStyles, ...style }}
          role="switch"
          aria-checked={props.checked}
          {...props}
        />
        <div style={trackStyles} />
        <div style={thumbStyles} />
      </div>
      {label && <span style={labelStyles}>{label}</span>}
    </label>
  );
});