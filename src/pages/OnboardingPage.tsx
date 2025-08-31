import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import type { UserProfile } from '../models/user';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing, borderRadius, gradients, shadows, transitions, animations } from '../theme/theme';
import { Icon } from '../components/Icon';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<'kid' | 'teen' | 'adult'>('kid');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, [step]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setShowContent(false);
      setTimeout(() => {
        setStep(1);
        setShowContent(true);
      }, 300);
    }
  };

  const handleComplete = async () => {
    const newUser: UserProfile = {
      id: uuidv4(),
      name: name.trim(),
      ageGroup,
      currentLevel: 1,
      totalPoints: 0,
      streakCount: 0,
      lastStreakDate: null,
    };

    await setUser(newUser);
    navigate('/skill-tree');
  };

  const ageOptions = [
    { 
      value: 'kid' as const, 
      label: 'Young Explorer', 
      subtitle: 'Under 12 years',
      icon: '🎈',
      color: colors.secondary
    },
    { 
      value: 'teen' as const, 
      label: 'Rising Star', 
      subtitle: '13-17 years',
      icon: '⭐',
      color: colors.primary
    },
    { 
      value: 'adult' as const, 
      label: 'Singing Enthusiast', 
      subtitle: '18+ years',
      icon: '🎵',
      color: colors.accent
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: spacing.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: gradients.wing,
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          animation: animations.pulse,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '350px',
          height: '350px',
          background: gradients.feather,
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          animation: animations.pulse,
          animationDelay: '1s',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="500px" style={{ position: 'relative', zIndex: 10 }}>
        <div 
          style={{ 
            textAlign: 'center', 
            marginBottom: spacing.xxl,
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(-20px)',
            transition: transitions.smooth,
          }}
        >
          <img
            src="/img/kooka-burra-calling-out.png"
            alt="Kooka the Kookaburra welcoming you"
            style={{
              width: '250px',
              margin: '0 auto',
              marginBottom: spacing.xl,
              filter: `drop-shadow(${shadows.xl})`,
              transform: 'scale(1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          />
          <h1
            style={{
              fontSize: fontSize.xxxl,
              fontWeight: fontWeight.extrabold,
              color: colors.text,
              marginBottom: spacing.sm,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to Kooka Sing!
          </h1>
          <p style={{ 
            color: colors.textLight, 
            fontSize: fontSize.lg,
            fontWeight: fontWeight.medium,
          }}>
            {step === 0 
              ? "Let's start your singing adventure together!" 
              : "You're almost ready to begin!"}
          </p>
        </div>

        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {step === 0 ? (
            <Card variant="glass" padding="xl">
              <form onSubmit={handleNameSubmit}>
                <h2
                  style={{
                    fontSize: fontSize.xxl,
                    fontWeight: fontWeight.bold,
                    marginBottom: spacing.md,
                    color: colors.text,
                    textAlign: 'center',
                  }}
                >
                  What should Kooka call you?
                </h2>
                <p
                  style={{
                    fontSize: fontSize.md,
                    color: colors.textLight,
                    marginBottom: spacing.xl,
                    textAlign: 'center',
                  }}
                >
                  Choose a name that makes you smile!
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your amazing name"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontSize: fontSize.lg,
                    borderRadius: borderRadius.pill,
                    border: `2px solid ${colors.gray200}`,
                    backgroundColor: colors.surface,
                    marginBottom: spacing.xl,
                    transition: transitions.smooth,
                    textAlign: 'center',
                    fontWeight: fontWeight.medium,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primaryLight}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.gray200;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="gradient"
                  disabled={!name.trim()}
                  icon={<Icon name="forward" />}
                  iconPosition="right"
                >
                  Let's Go!
                </Button>
              </form>
            </Card>
          ) : (
            <Card variant="glass" padding="xl">
              <h2
                style={{
                  fontSize: fontSize.xxl,
                  fontWeight: fontWeight.bold,
                  marginBottom: spacing.md,
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                Hi {name}!
              </h2>
              <p
                style={{
                  fontSize: fontSize.lg,
                  color: colors.textLight,
                  marginBottom: spacing.xl,
                  textAlign: 'center',
                }}
              >
                Which adventure level fits you best?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {ageOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => setAgeGroup(option.value)}
                    style={{
                      padding: spacing.lg,
                      borderRadius: borderRadius.xl,
                      border: `2px solid ${
                        ageGroup === option.value ? option.color : colors.gray200
                      }`,
                      backgroundColor:
                        ageGroup === option.value 
                          ? `${option.color}15` 
                          : colors.surface,
                      fontSize: fontSize.lg,
                      fontWeight: fontWeight.semibold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.md,
                      transition: transitions.smooth,
                      cursor: 'pointer',
                      transform: ageGroup === option.value ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: ageGroup === option.value ? shadows.md : 'none',
                      opacity: 0,
                      animation: `slideUp 0.4s ease-out ${index * 0.1}s forwards`,
                    }}

                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <Icon name={option.value === 'kid' ? 'starOutline' : option.value === 'teen' ? 'star' : 'play'} size={28} color={option.color} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: colors.text }}>{option.label}</div>
                        <div style={{ 
                          fontSize: fontSize.sm, 
                          color: colors.textLight,
                          fontWeight: fontWeight.normal,
                        }}>
                          {option.subtitle}
                        </div>
                      </div>
                    </div>
                    {ageGroup === option.value && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: option.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: fontWeight.bold,
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
                <img
                  src="/img/kooka-burra-dancing.png"
                  alt="Kooka dancing with excitement"
                  style={{
                    width: '120px',
                    marginBottom: spacing.lg,
                    filter: `drop-shadow(${shadows.lg})`,
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
              </div>
              <Button
                onClick={handleComplete}
                fullWidth
                size="large"
                variant="gradient"
                style={{ marginTop: spacing.md }}
                icon={<Icon name="play" />}
                iconPosition="right"
              >
                Start My Journey!
              </Button>
            </Card>
          )}
        </div>

        {/* Floating kooka elements */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            animation: 'float 5s ease-in-out infinite',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img
            src="/img/kooka-burra-flying.png"
            alt="Floating Kooka"
            style={{
              width: '60px',
              borderRadius: '50%',
              filter: `drop-shadow(${shadows.sm})`,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img
            src="/img/kooka-burra-singing.png"
            alt="Floating Kooka"
            style={{
              width: '50px',
              borderRadius: '50%',
              filter: `drop-shadow(${shadows.sm})`,
            }}
          />
        </div>
      </Container>
    </div>
  );
};