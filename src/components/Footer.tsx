import React from 'react';
import { colors, spacing, fontSize, transitions, gradients, fontWeight } from '../theme/theme';
import { Icon } from './Icon';

interface FooterProps {
  children?: React.ReactNode;
  fixed?: boolean;
  variant?: 'default' | 'gradient' | 'minimal' | 'playful';
  showKookaburra?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({
  children,
  fixed = false,
  variant = 'gradient',
  showKookaburra = true,
  className = '',
  style,
}) => {
  // Randomize kooka image for footer variety
  const kookaImages = [
    '/img/kooka-burra-waiving.png',
    '/img/kooka-burra-breathing.png',
    '/img/kooka-burra-dancing.png',
  ];
  const [kookaImage] = React.useState(() => kookaImages[Math.floor(Math.random() * kookaImages.length)]);
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'gradient':
        return {
          background: gradients.primary,
          color: colors.textOnPrimary,
          borderTop: 'none',
        };
      case 'minimal':
        return {
          backgroundColor: colors.background,
          color: colors.text,
          borderTop: `1px solid ${colors.gray200}`,
        };
      case 'playful':
        return {
          background: gradients.warm,
          color: colors.text,
          borderTop: 'none',
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.textOnPrimary,
          borderTop: 'none',
        };
    }
  };

  const footerStyles: React.CSSProperties = {
    position: fixed ? 'fixed' : 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${spacing.xl} ${spacing.md}`,
    transition: transitions.smooth,
    zIndex: 900,
    ...getVariantStyles(),
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const defaultContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md }}>
      {showKookaburra && (
        <img
          src={kookaImage}
          alt="Kooka saying goodbye"
          style={{
            width: '64px',
            filter: `drop-shadow(${shadows.md})`,
            transform: 'scale(1)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
        />
      )}
      
      <div>
        <p style={{ 
          fontSize: fontSize.md, 
          fontWeight: fontWeight.medium,
          marginBottom: spacing.xs,
          opacity: 0.95,
        }}>
          Made with care by Kooka Sing
        </p>
        <p style={{ 
          fontSize: fontSize.sm,
          opacity: 0.8,
        }}>
          © {new Date().getFullYear()} • Helping voices soar since today!
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: spacing.md,
        marginTop: spacing.sm,
      }}>
        {[0,1,2].map((index) => (
          <span
            key={index}
            style={{
              fontSize: '20px',
              opacity: 0.6,
              animation: `float ${3 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={index === 1 ? 'microphone' : 'play'} size={20} color={getVariantStyles().color || colors.text} />
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <footer className={className} style={footerStyles}>
      <div style={containerStyles}>
        {children || defaultContent}
      </div>
      
      {/* Decorative wave for playful variant */}
      {variant === 'playful' && (
        <svg
          style={{
            position: 'absolute',
            top: '-1px',
            left: 0,
            width: '100%',
            height: '40px',
            transform: 'rotate(180deg)',
          }}
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z"
            fill={colors.background}
            opacity="0.5"
          />
          <path
            d="M0,25 C200,45 400,5 600,25 C800,45 1000,5 1200,25 L1200,40 L0,40 Z"
            fill={colors.background}
          />
        </svg>
      )}
    </footer>
  );
};