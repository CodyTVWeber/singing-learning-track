import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, animations } from '../theme/theme';
import { analytics } from '../services/analytics';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useApp();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Track app open on initial mount
    analytics.trackEvent('app_opened');
    
    // Trigger content animation
    setTimeout(() => setShowContent(true), 100);

    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate('/skill-tree');
        } else {
          navigate('/onboarding');
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: gradients.soft,
        padding: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: gradients.ocean,
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: animations.pulse,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: gradients.sunset,
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: animations.pulse,
          animationDelay: '1s',
        }}
      />
      
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <img
          src="/img/kooka-burra-waiving.png"
          alt="Kooka the Kookaburra waving hello"
          style={{
            width: '280px',
            marginBottom: spacing.xxl,
            animation: animations.float,
            filter: `drop-shadow(${shadows.xl})`,
            transform: 'rotate(-5deg)',
          }}
        />
        
        <h1
          style={{
            fontSize: fontSize.huge,
            fontWeight: fontWeight.extrabold,
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: spacing.md,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          Kooka Sing
        </h1>
        
        <p
          style={{
            fontSize: fontSize.xl,
            color: colors.textLight,
            marginBottom: spacing.xl,
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: 1.6,
            fontWeight: fontWeight.medium,
          }}
        >
          Join Kooka the Kookaburra on a magical journey to discover your singing voice!
        </p>
        
        <div style={{ marginTop: spacing.xl }}>
          <LoadingSpinner size="medium" variant="musical" />
          <p
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: spacing.md,
              fontStyle: 'italic',
            }}
          >
            Preparing your adventure...
          </p>
        </div>
      </div>

      {/* Musical notes floating animation */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          fontSize: '30px',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '0.5s',
          opacity: 0.3,
        }}
      >
        🎵
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '25px',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1.5s',
          opacity: 0.3,
        }}
      >
        🎶
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          fontSize: '20px',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '2s',
          opacity: 0.3,
        }}
      >
        🎤
      </div>
    </div>
  );
};