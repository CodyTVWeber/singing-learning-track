import React, { forwardRef, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, transitions } from '../theme/theme';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  size = 'medium',
  fullWidth = false,
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: spacing.xs,
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: error ? colors.error : colors.text,
    marginBottom: spacing.xs,
  };

  const inputWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: size === 'small' ? `${spacing.sm} ${spacing.md}` :
             size === 'large' ? `${spacing.md} ${spacing.lg}` :
             `${spacing.sm} ${spacing.md}`,
    paddingLeft: icon ? 
      (size === 'small' ? '36px' : size === 'large' ? '52px' : '44px') : 
      undefined,
    fontSize: size === 'small' ? fontSize.sm : 
              size === 'large' ? fontSize.lg : 
              fontSize.md,
    lineHeight: '1.5',
    color: colors.text,
    backgroundColor: colors.surface,
    border: `2px solid ${error ? colors.error : isFocused ? colors.primary : colors.featherLight}`,
    borderRadius: borderRadius.md,
    transition: transitions.fast,
    outline: 'none',
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
    height: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
    color: error ? colors.error : isFocused ? colors.primary : colors.textLight,
    pointerEvents: 'none',
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: error ? colors.error : colors.textLight,
    marginTop: spacing.xs,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      
      <div style={inputWrapperStyles}>
        {icon && <div style={iconStyles}>{icon}</div>}
        <input
          ref={ref}
          className={className}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? 'error-message' : hint ? 'hint-message' : undefined}
          {...props}
        />
      </div>
      
      {error && (
        <span id="error-message" style={messageStyles} role="alert">
          {error}
        </span>
      )}
      
      {hint && !error && (
        <span id="hint-message" style={messageStyles}>
          {hint}
        </span>
      )}
    </div>
  );
});