import React, { forwardRef } from 'react';
import { colors, spacing, borderRadius, fontSize, transitions } from '../theme/theme';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  error,
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

  const radioWrapperStyles: React.CSSProperties = {
    position: 'relative',
    width: '20px',
    height: '20px',
  };

  const radioStyles: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  };

  const customRadioStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20px',
    height: '20px',
    backgroundColor: colors.surface,
    border: `2px solid ${error ? colors.error : colors.primary}`,
    borderRadius: borderRadius.round,
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dotStyles: React.CSSProperties = {
    width: '8px',
    height: '8px',
    backgroundColor: error ? colors.error : colors.primary,
    borderRadius: borderRadius.round,
    opacity: props.checked ? 1 : 0,
    transform: props.checked ? 'scale(1)' : 'scale(0)',
    transition: transitions.fast,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    color: error ? colors.error : colors.text,
    userSelect: 'none',
  };

  return (
    <label style={containerStyles}>
      <div style={radioWrapperStyles}>
        <input
          ref={ref}
          type="radio"
          className={className}
          style={{ ...radioStyles, ...style }}
          aria-invalid={!!error}
          {...props}
        />
        <div style={customRadioStyles}>
          <div style={dotStyles} />
        </div>
      </div>
      {label && <span style={labelStyles}>{label}</span>}
    </label>
  );
});

interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  error,
  direction = 'vertical',
  className = '',
  style,
}) => {
  const groupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: direction === 'horizontal' ? spacing.lg : spacing.md,
    flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
    ...style,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  };

  return (
    <div className={className}>
      <div style={groupStyles} role="radiogroup" aria-invalid={!!error}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={(e) => {
              if (e.target.checked && onChange) {
                onChange(option.value);
              }
            }}
          />
        ))}
      </div>
      {error && (
        <span style={errorStyles} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};