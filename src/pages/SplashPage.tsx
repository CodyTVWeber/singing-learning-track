import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors, fontSize, fontWeight, spacing } from '../theme/theme';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate('/skill-tree');
        } else {
          navigate('/onboarding');
        }
      }, 1500);

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
        backgroundColor: colors.background,
        padding: spacing.xl,
      }}
    >
      <img
        src="/img/kooka-burra-waiving.png"
        alt="Kooka the Kookaburra"
        style={{
          width: '200px',
          marginBottom: spacing.xl,
          animation: 'float 3s ease-in-out infinite',
        }}
      />
      
      <h1
        style={{
          fontSize: fontSize.xxxl,
          fontWeight: fontWeight.bold,
          color: colors.primary,
          marginBottom: spacing.md,
          textAlign: 'center',
        }}
      >
        Kooka Sing
      </h1>
      
      <p
        style={{
          fontSize: fontSize.lg,
          color: colors.textLight,
          marginBottom: spacing.xl,
          textAlign: 'center',
        }}
      >
        Learn to sing with Kooka!
      </p>
      
      <LoadingSpinner size="medium" />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};