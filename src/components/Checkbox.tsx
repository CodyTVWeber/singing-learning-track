import React, { forwardRef } from 'react';
import { colors, spacing, borderRadius, fontSize, transitions } from '../theme/theme';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  indeterminate = false,
  className = '',
  style,
  children: _children,
  ...props
}, ref) => {
  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
  };

  const checkboxWrapperStyles: React.CSSProperties = {
    position: 'relative',
    width: '20px',
    height: '20px',
  };

  const checkboxStyles: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  };

  const customCheckboxStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20px',
    height: '20px',
    backgroundColor: colors.surface,
    border: `2px solid ${error ? colors.error : colors.primary}`,
    borderRadius: borderRadius.sm,
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkStyles: React.CSSProperties = {
    width: '12px',
    height: '12px',
    opacity: props.checked || indeterminate ? 1 : 0,
    transform: props.checked || indeterminate ? 'scale(1)' : 'scale(0)',
    transition: transitions.fast,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    color: error ? colors.error : colors.text,
    userSelect: 'none',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: colors.error,
    marginLeft: '28px',
    marginTop: spacing.xs,
    display: 'block',
  };

  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  return (
    <div>
      <label style={containerStyles}>
        <div style={checkboxWrapperStyles}>
          <input
            ref={ref}
            type="checkbox"
            className={className}
            style={{ ...checkboxStyles, ...style }}
            aria-invalid={!!error}
            aria-describedby={error ? 'checkbox-error' : undefined}
            {...props}
          />
          <div style={customCheckboxStyles}>
            <svg
              style={checkmarkStyles}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {indeterminate && !props.checked ? (
                <rect x="2" y="5" width="8" height="2" fill={colors.primary} />
              ) : (
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </div>
        {label && <span style={labelStyles}>{label}</span>}
      </label>
      {error && (
        <span id="checkbox-error" style={errorStyles} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});