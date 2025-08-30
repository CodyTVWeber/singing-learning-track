import React, { forwardRef, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  placeholder = 'Select an option',
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

  const selectWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const selectStyles: React.CSSProperties = {
    width: '100%',
    padding: size === 'small' ? `${spacing.sm} ${spacing.md}` :
             size === 'large' ? `${spacing.md} ${spacing.lg}` :
             `${spacing.sm} ${spacing.md}`,
    paddingRight: size === 'small' ? '36px' : size === 'large' ? '52px' : '44px',
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
    appearance: 'none',
    cursor: 'pointer',
    ...style,
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: `6px solid ${error ? colors.error : isFocused ? colors.primary : colors.textLight}`,
    pointerEvents: 'none',
    transition: transitions.fast,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: error ? colors.error : colors.textLight,
    marginTop: spacing.xs,
  };

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      
      <div style={selectWrapperStyles}>
        <select
          ref={ref}
          className={className}
          style={selectStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? 'error-message' : hint ? 'hint-message' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div style={arrowStyles} />
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