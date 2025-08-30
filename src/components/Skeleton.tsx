import React from 'react';
import { colors, spacing, borderRadius } from '../theme/theme';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
}) => {
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'text':
        return { width: '100%', height: '1em' };
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'rectangular':
        return { width: '100%', height: '120px' };
      default:
        return {};
    }
  };

  const defaultDimensions = getDefaultDimensions();

  const baseStyles: React.CSSProperties = {
    backgroundColor: colors.featherLight,
    borderRadius: variant === 'circular' ? borderRadius.round : 
                  variant === 'text' ? borderRadius.sm : 
                  borderRadius.md,
    width: width || defaultDimensions.width,
    height: height || defaultDimensions.height,
    display: 'inline-block',
    ...style,
  };

  const animationStyles: React.CSSProperties = animation === 'pulse' ? {
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  } : animation === 'wave' ? {
    overflow: 'hidden',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
      animation: 'skeleton-wave 1.5s linear infinite',
    },
  } : {};

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        
        @keyframes skeleton-wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .skeleton-wave::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          animation: skeleton-wave 1.5s linear infinite;
        }
      `}</style>
      <span 
        className={`${className} ${animation === 'wave' ? 'skeleton-wave' : ''}`} 
        style={{ ...baseStyles, ...animationStyles }}
        aria-hidden="true"
      />
    </>
  );
};

interface SkeletonGroupProps {
  count?: number;
  direction?: 'horizontal' | 'vertical';
  gap?: keyof typeof spacing;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  direction = 'vertical',
  gap = 'sm',
  children,
  className = '',
  style,
}) => {
  const groupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: spacing[gap],
    ...style,
  };

  return (
    <div className={className} style={groupStyles}>
      {children || Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};