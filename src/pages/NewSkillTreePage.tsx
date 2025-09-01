import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Unit1StartSinging } from '../components/Units/Unit1/Unit1StartSinging';
// Import other units as they're created
// import { Unit2BreathControl } from '../components/Units/Unit2/Unit2BreathControl';
// import { Unit3PitchArticulation } from '../components/Units/Unit3/Unit3PitchArticulation';
// ... etc

import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Progress } from '../components/Progress';
import { StatCard } from '../components/StatCard';
import { Icon } from '../components/Icon';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../theme/theme';

interface UnitInfo {
  id: string;
  number: number;
  title: string;
  description: string;
  totalLessons: number;
  component: React.ComponentType<{
    onLessonComplete: (lessonId: string, score: number) => void;
    completedLessons: string[];
    onExit: () => void;
  }>;
  imageUrl: string;
  color: string;
}

const units: UnitInfo[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Start Singing!',
    description: 'Discover your voice with Kooka',
    totalLessons: 7,
    component: Unit1StartSinging,
    imageUrl: '/img/kooka-burra-singing.png',
    color: '#4ECDC4'
  },
  // Add more units as they're created
  // {
  //   id: 'unit-2',
  //   number: 2,
  //   title: 'Breath Control & Dynamics',
  //   description: 'Master breathing techniques and volume control',
  //   totalLessons: 6,
  //   component: Unit2BreathControl,
  //   imageUrl: '/img/breathing-pulse.png',
  //   color: '#FF6B6B'
  // },
];

export const NewSkillTreePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<UnitInfo | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  if (!user) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  const handleUnitSelect = (unit: UnitInfo) => {
    const previousUnit = units[unit.number - 2];
    const isPreviousComplete = !previousUnit || getUnitProgress(previousUnit.id) === 100;
    
    if (unit.number === 1 || isPreviousComplete) {
      setSelectedUnit(unit);
    }
  };

  const handleUnitExit = () => {
    setSelectedUnit(null);
  };

  const handleLessonComplete = (lessonId: string, score: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const getUnitProgress = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return 0;
    
    const unitLessonIds = getLessonIdsForUnit(unit.id);
    const completedCount = unitLessonIds.filter(id => completedLessons.includes(id)).length;
    return (completedCount / unit.totalLessons) * 100;
  };

  const getLessonIdsForUnit = (unitId: string) => {
    // Map unit IDs to their lesson IDs
    switch (unitId) {
      case 'unit-1':
        return [
          'echo-introduction',
          'breath-basics',
          'voice-discovery',
          'kooka-laugh',
          'rhythm-clap',
          'animal-sounds',
          'echo-game'
        ];
      // Add more cases as units are created
      default:
        return [];
    }
  };

  const isUnitUnlocked = (unit: UnitInfo) => {
    if (unit.number === 1) return true;
    const previousUnit = units[unit.number - 2];
    return !previousUnit || getUnitProgress(previousUnit.id) === 100;
  };

  const totalLessons = units.reduce((sum, unit) => sum + unit.totalLessons, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  // Render selected unit
  if (selectedUnit) {
    const UnitComponent = selectedUnit.component;
    const unitLessonIds = getLessonIdsForUnit(selectedUnit.id);
    const unitCompletedLessons = completedLessons.filter(id => unitLessonIds.includes(id));
    
    return (
      <UnitComponent
        onLessonComplete={handleLessonComplete}
        completedLessons={unitCompletedLessons}
        onExit={handleUnitExit}
      />
    );
  }

  // Render skill tree
  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.soft,
      paddingBottom: spacing.xxl,
    }}>
      {/* Hero Section */}
      <div style={{
        background: gradients.warm,
        color: colors.text,
        padding: `${spacing.xxl} 0`,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: spacing.xxl,
      }}>
        <Container>
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <img
              src="/img/kooka-burra-flying.png"
              alt="Kooka flying high"
              style={{
                width: '280px',
                margin: '0 auto',
                marginBottom: spacing.xl,
                filter: `drop-shadow(${shadows.xl})`,
              }}
            />
            
            <h1 style={{
              fontSize: fontSize.xxxl,
              fontWeight: fontWeight.extrabold,
              marginBottom: spacing.md,
              letterSpacing: '-0.02em',
              color: colors.text,
            }}>
              Welcome back, {user.name}!
            </h1>
            
            <p style={{
              fontSize: fontSize.lg,
              color: colors.textLight,
              fontWeight: fontWeight.medium,
              opacity: 0.75,
              maxWidth: '350px',
              margin: '0 auto',
              lineHeight: 1.4,
              marginBottom: spacing.xl,
            }}>
              Your voice is getting stronger every day!
            </p>

            {/* Overall Progress */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Progress
                value={overallProgress}
                max={100}
                size="large"
                color="success"
                animated
                title="Journey Progress"
                label={`${completedLessons.length} of ${totalLessons} lessons`}
                showValue
              />
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing.lg,
              marginTop: spacing.xl,
              flexWrap: 'wrap',
            }}>
              <StatCard label="Points Earned" value={user.totalPoints} accent="primary" />
              <StatCard label="Lessons Complete" value={completedLessons.length} accent="success" />
              {user.streakCount > 0 && (
                <StatCard label="Daily Streak" value={user.streakCount} accent="warning" />
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Units Section */}
      <Container>
        <h2 style={{
          fontSize: fontSize.xxxl,
          fontWeight: fontWeight.extrabold,
          color: colors.text,
          marginBottom: spacing.xl,
          textAlign: 'center',
        }}>
          Your Singing Journey
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: spacing.xl,
          marginBottom: spacing.xxl,
        }}>
          {units.map((unit) => {
            const progress = getUnitProgress(unit.id);
            const isUnlocked = isUnitUnlocked(unit);
            const isComplete = progress === 100;
            const unitCompletedCount = getLessonIdsForUnit(unit.id).filter(id => completedLessons.includes(id)).length;

            return (
              <Card
                key={unit.id}
                variant={isComplete ? 'gradient' : 'elevated'}
                interactive={isUnlocked}
                onClick={() => isUnlocked && handleUnitSelect(unit)}
                style={{
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.6,
                  background: isComplete ? gradients.success : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Unit Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: spacing.lg,
                  right: spacing.lg,
                  width: '60px',
                  height: '60px',
                  borderRadius: borderRadius.round,
                  backgroundColor: unit.color,
                  color: colors.textOnPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fontSize.xl,
                  fontWeight: fontWeight.bold,
                  boxShadow: shadows.md,
                }}>
                  {unit.number}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg }}>
                  <img
                    src={unit.imageUrl}
                    alt={unit.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: borderRadius.md,
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: fontSize.xl,
                      fontWeight: fontWeight.semibold,
                      color: isComplete ? colors.textOnPrimary : colors.text,
                      marginBottom: spacing.xs,
                    }}>
                      {unit.title}
                    </h3>
                    <p style={{
                      fontSize: fontSize.sm,
                      color: isComplete ? colors.textOnPrimary : colors.textLight,
                      lineHeight: 1.4,
                    }}>
                      {unit.description}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.md,
                }}>
                  <span style={{
                    fontSize: fontSize.sm,
                    color: isComplete ? colors.textOnPrimary : colors.textLight,
                  }}>
                    {unit.totalLessons} lessons
                  </span>
                  <span style={{
                    fontSize: fontSize.sm,
                    fontWeight: fontWeight.medium,
                    color: isComplete ? colors.textOnPrimary : colors.text,
                  }}>
                    {unitCompletedCount}/{unit.totalLessons} complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '8px',
                  backgroundColor: isComplete ? 'rgba(255,255,255,0.3)' : colors.border,
                  borderRadius: borderRadius.pill,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: isComplete ? colors.textOnPrimary : unit.color,
                    transition: 'width 0.3s ease',
                  }} />
                </div>

                {!isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: borderRadius.md,
                  }}>
                    <div style={{
                      textAlign: 'center',
                      color: colors.textOnPrimary,
                    }}>
                      <Icon name="warning" size={32} />
                      <p style={{ marginTop: spacing.sm, fontSize: fontSize.sm }}>
                        Complete Unit {unit.number - 1} to unlock
                      </p>
                    </div>
                  </div>
                )}

                {isUnlocked && !isComplete && (
                  <div style={{
                    marginTop: spacing.md,
                    textAlign: 'center',
                  }}>
                    <span style={{
                      fontSize: fontSize.md,
                      color: unit.color,
                      fontWeight: fontWeight.medium,
                    }}>
                      Start Learning →
                    </span>
                  </div>
                )}

                {isComplete && (
                  <div style={{
                    marginTop: spacing.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.xs,
                  }}>
                    <Icon name="check" size={20} color={colors.textOnPrimary} />
                    <span style={{
                      fontSize: fontSize.md,
                      color: colors.textOnPrimary,
                      fontWeight: fontWeight.medium,
                    }}>
                      Complete!
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Coming Soon */}
        <Card variant="glass" style={{ textAlign: 'center', padding: spacing.xxl }}>
          <Icon name="info" size={48} color={colors.primary} />
          <h3 style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginTop: spacing.lg,
            marginBottom: spacing.md,
          }}>
            More Units Coming Soon!
          </h3>
          <p style={{
            fontSize: fontSize.md,
            color: colors.textLight,
          }}>
            We're working on Units 2-24 to complete your singing journey. Check back soon!
          </p>
        </Card>
      </Container>
    </div>
  );
};