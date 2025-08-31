import React, { forwardRef, useState, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, transitions, fontWeight, shadows, gradients, animations } from '../theme/theme';
import { Icon } from './Icon';
import { LoadingSpinner } from './LoadingSpinner';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  loading?: boolean;
  animated?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success = false,
  hint,
  icon,
  endIcon,
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  loading = false,
  animated = true,
  className = '',
  style,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  children: _children,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const getStateColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    if (isFocused) return colors.primary;
    return colors.gray300;
  };

  const getVariantStyles = (): React.CSSProperties => {
    const stateColor = getStateColor();
    
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: isFocused ? colors.gray50 : colors.gray100,
          border: `2px solid transparent`,
          borderBottomColor: stateColor,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${stateColor}`,
        };
      default:
        return {
          backgroundColor: colors.surface,
          border: `2px solid ${stateColor}`,
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: spacing.xs,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: error ? colors.error : success ? colors.success : colors.text,
    marginBottom: spacing.xs,
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const inputWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const sizeConfig = {
    small: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: fontSize.sm,
      height: '36px',
      iconSize: '16px',
    },
    medium: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: fontSize.md,
      height: '44px',
      iconSize: '20px',
    },
    large: {
      padding: `${spacing.md} ${spacing.xl}`,
      fontSize: fontSize.lg,
      height: '52px',
      iconSize: '24px',
    },
  };

  const currentSize = sizeConfig[size];

  const inputStyles: React.CSSProperties = {
    width: '100%',
    height: currentSize.height,
    padding: currentSize.padding,
    paddingLeft: icon ? `calc(${currentSize.iconSize} + ${spacing.lg} + ${spacing.sm})` : currentSize.padding,
    paddingRight: endIcon || loading ? `calc(${currentSize.iconSize} + ${spacing.lg} + ${spacing.sm})` : currentSize.padding,
    fontSize: currentSize.fontSize,
    lineHeight: '1.5',
    color: colors.text,
    borderRadius: borderRadius.lg,
    transition: animated ? transitions.smooth : 'none',
    outline: 'none',
    fontWeight: fontWeight.medium,
    ...getVariantStyles(),
    boxShadow: isFocused ? `0 0 0 4px ${getStateColor()}20` : 'none',
    transform: animated && isFocused ? 'translateY(-1px)' : 'translateY(0)',
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
    width: currentSize.iconSize,
    height: currentSize.iconSize,
    color: error ? colors.error : success ? colors.success : isFocused ? colors.primary : colors.textLight,
    pointerEvents: 'none',
    transition: transitions.fast,
  };

  const endIconStyles: React.CSSProperties = {
    ...iconStyles,
    left: 'auto',
    right: spacing.md,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: error ? colors.error : success ? colors.success : colors.textLight,
    marginTop: spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontWeight: fontWeight.medium,
  };

  const floatingLabelStyles: React.CSSProperties = {
    position: 'absolute',
    left: icon ? `calc(${currentSize.iconSize} + ${spacing.lg} + ${spacing.sm})` : spacing.lg,
    top: '50%',
    transform: (isFocused || hasValue) 
      ? `translateY(-${spacing.xl}) scale(0.85)` 
      : 'translateY(-50%)',
    transformOrigin: 'left center',
    fontSize: currentSize.fontSize,
    color: (isFocused || hasValue) 
      ? (error ? colors.error : success ? colors.success : colors.primary)
      : colors.textLight,
    backgroundColor: colors.surface,
    padding: `0 ${spacing.xs}`,
    pointerEvents: 'none',
    transition: transitions.smooth,
    fontWeight: (isFocused || hasValue) ? fontWeight.semibold : fontWeight.normal,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const showFloatingLabel = variant !== 'outlined' && label && !props.placeholder;

  return (
    <div style={containerStyles} className={className}>
      {label && !showFloatingLabel && (
        <label style={labelStyles}>
          {label}
          {props.required && <span style={{ color: colors.error }}>*</span>}
        </label>
      )}
      
      <div style={inputWrapperStyles}>
        {icon && <div style={iconStyles}>{icon}</div>}
        
        {showFloatingLabel && (
          <label style={floatingLabelStyles}>
            {label}
            {props.required && <span style={{ color: colors.error }}>*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? 'error-message' : hint ? 'hint-message' : undefined}
          placeholder={showFloatingLabel ? undefined : props.placeholder}
          {...props}
        />
        
        {loading && (
          <div style={endIconStyles}>
            <LoadingSpinner size="small" variant="dots" />
          </div>
        )}
        
        {!loading && endIcon && <div style={endIconStyles}>{endIcon}</div>}
        
        {!loading && !endIcon && success && (
          <div style={{ ...endIconStyles, color: colors.success }}>
            <Icon name="check_circle" size={parseInt(currentSize.iconSize)} />
          </div>
        )}
        
        {!loading && !endIcon && error && (
          <div style={{ ...endIconStyles, color: colors.error }}>
            <Icon name="error" size={parseInt(currentSize.iconSize)} />
          </div>
        )}
      </div>
      
      {error && (
        <span id="error-message" style={messageStyles} role="alert">
          <Icon name="error_outline" size={14} />
          {error}
        </span>
      )}
      
      {success && !error && hint && (
        <span id="hint-message" style={{ ...messageStyles, color: colors.success }}>
          <Icon name="check_circle" size={14} />
          {hint}
        </span>
      )}
      
      {!error && !success && hint && (
        <span id="hint-message" style={messageStyles}>
          {hint}
        </span>
      )}

      {/* Ripple effect on focus */}
      {animated && isFocused && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: gradients.primary,
            animation: 'shimmer 2s infinite',
            borderRadius: borderRadius.pill,
          }}
        />
      )}
    </div>
  );
});

Input.displayName = 'Input';