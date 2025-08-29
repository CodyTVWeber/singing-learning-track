import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import type { UserProfile } from '../models/user';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../theme/theme';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<'kid' | 'teen' | 'adult'>('kid');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(1);
    }
  };

  const handleComplete = async () => {
    const newUser: UserProfile = {
      id: uuidv4(),
      name: name.trim(),
      ageGroup,
      currentLevel: 1,
      totalPoints: 0,
      streak: 0,
    };

    await setUser(newUser);
    navigate('/skill-tree');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: spacing.md,
      }}
    >
      <Container maxWidth="500px">
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <img
            src="/img/kooka-burra-waiving.png"
            alt="Kooka the Kookaburra"
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}
          />
          <h1
            style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              color: colors.primary,
              marginBottom: spacing.sm,
            }}
          >
            Welcome to Kooka Sing!
          </h1>
          <p style={{ color: colors.textLight, fontSize: fontSize.lg }}>
            Let's get to know each other
          </p>
        </div>

        {step === 0 ? (
          <Card>
            <form onSubmit={handleNameSubmit}>
              <h2
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: fontWeight.semibold,
                  marginBottom: spacing.lg,
                  color: colors.darkBrown,
                }}
              >
                What's your name?
              </h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                style={{
                  width: '100%',
                  padding: spacing.md,
                  fontSize: fontSize.lg,
                  borderRadius: borderRadius.md,
                  border: `2px solid ${colors.featherLight}`,
                  marginBottom: spacing.lg,
                  transition: 'border-color 300ms',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.featherLight;
                }}
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={!name.trim()}
              >
                Continue
              </Button>
            </form>
          </Card>
        ) : (
          <Card>
            <h2
              style={{
                fontSize: fontSize.xl,
                fontWeight: fontWeight.semibold,
                marginBottom: spacing.lg,
                color: colors.darkBrown,
              }}
            >
              Hi {name}! How old are you?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {[
                { value: 'kid' as const, label: '👶 Under 12', emoji: '🎈' },
                { value: 'teen' as const, label: '🎸 13-17', emoji: '🎵' },
                { value: 'adult' as const, label: '🎤 18+', emoji: '🎭' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAgeGroup(option.value)}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    border: `2px solid ${
                      ageGroup === option.value ? colors.primary : colors.featherLight
                    }`,
                    backgroundColor:
                      ageGroup === option.value ? colors.skyLight : colors.surface,
                    fontSize: fontSize.lg,
                    fontWeight: fontWeight.medium,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 300ms',
                    cursor: 'pointer',
                  }}
                >
                  <span>{option.label}</span>
                  <span style={{ fontSize: fontSize.xxl }}>{option.emoji}</span>
                </button>
              ))}
            </div>
            <Button
              onClick={handleComplete}
              fullWidth
              size="large"
              style={{ marginTop: spacing.xl }}
            >
              Start Learning!
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
};