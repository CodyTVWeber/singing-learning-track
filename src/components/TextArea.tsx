import React, { forwardRef, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  hint,
  resize = 'vertical',
  fullWidth = false,
  className = '',
  style,
  onFocus,
  onBlur,
  children: _children,
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

  const textareaStyles: React.CSSProperties = {
    width: '100%',
    minHeight: '120px',
    padding: `${spacing.md} ${spacing.md}`,
    fontSize: fontSize.md,
    lineHeight: '1.5',
    color: colors.text,
    backgroundColor: colors.surface,
    border: `2px solid ${error ? colors.error : isFocused ? colors.primary : colors.featherLight}`,
    borderRadius: borderRadius.md,
    transition: transitions.fast,
    outline: 'none',
    resize,
    fontFamily: 'inherit',
    ...style,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: error ? colors.error : colors.textLight,
    marginTop: spacing.xs,
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      
      <textarea
        ref={ref}
        className={className}
        style={textareaStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? 'error-message' : hint ? 'hint-message' : undefined}
        {...props}
      />
      
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