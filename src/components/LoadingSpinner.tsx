import React from 'react';
import { colors, gradients, animations, shadows } from '../theme/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'dots' | 'musical' | 'kookaburra';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  variant = 'default',
  color = colors.primary 
}) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const spinnerSize = sizeMap[size];
  const dotSize = spinnerSize / 4;

  if (variant === 'dots') {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: dotSize / 2,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: gradients.primary,
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'musical') {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: dotSize / 3,
          alignItems: 'flex-end',
          height: spinnerSize,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: dotSize / 2,
              height: '100%',
              background: gradients.secondary,
              borderRadius: dotSize / 4,
              animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'kookaburra') {
    const kookaImages = [
      '/img/kooka-burra-flying.png',
      '/img/kooka-burra-dancing.png',
      '/img/kooka-burra-calling-out.png',
    ];
    const kookaImage = kookaImages[Math.floor(Math.random() * kookaImages.length)];
    
    return (
      <div
        style={{
          display: 'inline-block',
          animation: animations.wiggle,
        }}
      >
        <img
          src={kookaImage}
          alt="Kooka loading"
          style={{
            width: spinnerSize,
            borderRadius: '50%',
            filter: `drop-shadow(${shadows.md})`,
          }}
        />
      </div>
    );
  }

  // Default spinner
  return (
    <div
      style={{
        display: 'inline-block',
        width: spinnerSize,
        height: spinnerSize,
        position: 'relative',
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: `3px solid transparent`,
          borderTop: `3px solid ${color}`,
          borderRight: `3px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          top: '15%',
          left: '15%',
          border: `2px solid transparent`,
          borderBottom: `2px solid ${colors.secondary}`,
          borderLeft: `2px solid ${colors.secondary}`,
          borderRadius: '50%',
          animation: 'spinReverse 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        }}
      />
    </div>
  );
};