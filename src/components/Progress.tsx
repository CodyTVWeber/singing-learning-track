import React, { useEffect, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions, gradients, shadows } from '../theme/theme';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | string;
  backgroundColor?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'medium',
  variant = 'linear',
  color = 'primary',
  backgroundColor = colors.gray100,
  animated = false,
  striped = false,
  indeterminate = false,
  className = '',
  style,
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (animated && !indeterminate) {
      const timer = setTimeout(() => setDisplayPercentage(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated, indeterminate]);

  const getColor = () => {
    const colorMap = {
      primary: gradients.primary,
      secondary: gradients.secondary,
      success: gradients.forest,
      warning: gradients.warm,
      error: gradients.sunset,
    };
    return colorMap[color as keyof typeof colorMap] || color;
  };

  const progressColor = getColor();

  if (variant === 'circular') {
    const sizes = {
      small: { size: 48, strokeWidth: 4 },
      medium: { size: 72, strokeWidth: 6 },
      large: { size: 96, strokeWidth: 8 },
    };

    const currentSize = sizes[size];
    const radius = (currentSize.size - currentSize.strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

    const containerStyles: React.CSSProperties = {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
    };

    const svgStyles: React.CSSProperties = {
      transform: 'rotate(-90deg)',
      filter: `drop-shadow(${shadows.sm})`,
    };

    const circleBackgroundStyles: React.CSSProperties = {
      fill: 'none',
      stroke: backgroundColor,
      strokeWidth: currentSize.strokeWidth,
      opacity: 0.3,
    };

    const circleProgressStyles: React.CSSProperties = {
      fill: 'none',
      stroke: `url(#gradient-${color})`,
      strokeWidth: currentSize.strokeWidth,
      strokeDasharray: circumference,
      strokeDashoffset: indeterminate ? circumference * 0.25 : strokeDashoffset,
      strokeLinecap: 'round',
      transition: animated && !indeterminate ? transitions.smooth : 'none',
      transformOrigin: 'center',
      animation: indeterminate ? 'spin 2s linear infinite' : animated ? 'scaleIn 0.5s ease-out' : 'none',
    };

    const valueStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: size === 'small' ? fontSize.md : size === 'large' ? fontSize.xxl : fontSize.xl,
      fontWeight: fontWeight.bold,
      background: progressColor,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: fontSize.sm,
      color: colors.textLight,
      fontWeight: fontWeight.medium,
    };

    return (
      <div className={className} style={{ ...containerStyles, ...style }}>
        <div style={{ position: 'relative', width: currentSize.size, height: currentSize.size }}>
          <svg
            width={currentSize.size}
            height={currentSize.size}
            style={svgStyles}
          >
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor={colors.primaryLight} />
              </linearGradient>
            </defs>
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
          {showValue && !indeterminate && (
            <div style={valueStyles}>
              {Math.round(displayPercentage)}%
            </div>
          )}
          {indeterminate && (
            <div style={{ ...valueStyles, fontSize: '24px' }}>
              ⚡
            </div>
          )}
        </div>
        {label && <span style={labelStyles}>{label}</span>}
      </div>
    );
  }

  // Linear progress
  const heights = {
    small: '6px',
    medium: '10px',
    large: '16px',
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
    fontWeight: fontWeight.medium,
  };

  const valueStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  };

  const trackStyles: React.CSSProperties = {
    width: '100%',
    height: heights[size],
    backgroundColor,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  };

  const barStyles: React.CSSProperties = {
    height: '100%',
    width: indeterminate ? '40%' : `${displayPercentage}%`,
    background: progressColor,
    borderRadius: borderRadius.pill,
    transition: animated && !indeterminate ? `width ${transitions.smooth}` : 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: shadows.sm,
    animation: indeterminate ? 'indeterminate 1.5s ease-in-out infinite' : 'none',
  };

  const stripedStyles: React.CSSProperties = striped ? {
    backgroundImage: `linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    )`,
    backgroundSize: '1rem 1rem',
    animation: animated ? 'stripes 1s linear infinite' : 'none',
  } : {};

  return (
    <div className={className} style={{ ...containerStyles, ...style }}>
      {(label || showValue) && (
        <div style={labelContainerStyles}>
          {label && <span style={labelStyles}>{label}</span>}
          {showValue && !indeterminate && (
            <span style={valueStyles}>{Math.round(displayPercentage)}%</span>
          )}
          {showValue && indeterminate && (
            <span style={valueStyles}>Loading...</span>
          )}
        </div>
      )}
      <div
        style={trackStyles}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div style={{...barStyles, ...stripedStyles}}>
          {/* Shimmer effect */}
          {animated && !indeterminate && !striped && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shimmer 2s infinite',
              }}
            />
          )}
        </div>
        {displayPercentage === 100 && (
          <div
            style={{
              position: 'absolute',
              right: '-15px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '30px',
              height: '30px',
              animation: 'bounce 1s ease-in-out infinite',
            }}
          >
            <img
              src="/img/kooka-burra-dancing.png"
              alt="Kooka celebrating completion"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                border: `2px solid ${colors.surface}`,
                boxShadow: shadows.md,
              }}
            />
          </div>
        )}
      </div>
      
      {/* Add keyframes */}
      <style>
        {`
          @keyframes indeterminate {
            0% { left: -40%; }
            100% { left: 100%; }
          }
          @keyframes stripes {
            0% { background-position: 0 0; }
            100% { background-position: 1rem 0; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(-50%) scale(1); }
            40% { transform: translateY(-60%) scale(1.1); }
            60% { transform: translateY(-40%) scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};