import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'linear' | 'circular';
  color?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  showLabel = true,
  size = 'medium',
  variant = 'linear',
  color = colors.primary,
  backgroundColor = colors.featherLight,
  className = '',
  style,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (variant === 'circular') {
    const sizes = {
      small: { size: 40, strokeWidth: 4 },
      medium: { size: 60, strokeWidth: 6 },
      large: { size: 80, strokeWidth: 8 },
    };

    const currentSize = sizes[size];
    const radius = (currentSize.size - currentSize.strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const containerStyles: React.CSSProperties = {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
    };

    const svgStyles: React.CSSProperties = {
      transform: 'rotate(-90deg)',
    };

    const circleBackgroundStyles: React.CSSProperties = {
      fill: 'none',
      stroke: backgroundColor,
      strokeWidth: currentSize.strokeWidth,
    };

    const circleProgressStyles: React.CSSProperties = {
      fill: 'none',
      stroke: color,
      strokeWidth: currentSize.strokeWidth,
      strokeDasharray: circumference,
      strokeDashoffset,
      strokeLinecap: 'round',
      transition: transitions.normal,
    };

    const valueStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: size === 'small' ? fontSize.xs : size === 'large' ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    };

    const labelStyles: React.CSSProperties = {
      fontSize: fontSize.sm,
      color: colors.textLight,
    };

    return (
      <div className={className} style={{ ...containerStyles, ...style }}>
        <div style={{ position: 'relative', width: currentSize.size, height: currentSize.size }}>
          <svg
            width={currentSize.size}
            height={currentSize.size}
            style={svgStyles}
          >
            <circle
              cx={currentSize.size / 2}
              cy={currentSize.size / 2}
              r={radius}
              style={circleBackgroundStyles}
            />
            <circle
              cx={currentSize.size / 2}
              cy={currentSize.size / 2}
              r={radius}
              style={circleProgressStyles}
            />
          </svg>
          {showValue && (
            <div style={valueStyles}>
              {Math.round(percentage)}%
            </div>
          )}
        </div>
        {label && showLabel && <span style={labelStyles}>{label}</span>}
      </div>
    );
  }

  // Linear progress
  const heights = {
    small: '4px',
    medium: '8px',
    large: '12px',
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
  };

  const labelContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: colors.textLight,
  };

  const valueStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  };

  const trackStyles: React.CSSProperties = {
    width: '100%',
    height: heights[size],
    backgroundColor,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    position: 'relative',
  };

  const barStyles: React.CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: color,
    transition: transitions.normal,
    borderRadius: borderRadius.round,
  };

  return (
    <div className={className} style={{ ...containerStyles, ...style }}>
      {(label || showValue) && (
        <div style={labelContainerStyles}>
          {label && showLabel && <span style={labelStyles}>{label}</span>}
          {showValue && <span style={valueStyles}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        style={trackStyles}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div style={barStyles} />
      </div>
    </div>
  );
};