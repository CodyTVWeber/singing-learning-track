import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Unit } from '../components/Unit/Unit';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Header } from '../components/Header';
import { IconButton } from '../components/Icon';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../theme/theme';
import { 
  SkillAssessment, 
  Unit as UnitType, 
  LessonProgress, 
  UnitProgress 
} from '../models/skillAssessment';
import { beginnerVocalAssessment } from '../data/skillAssessmentData';

export const SkillAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const [lessonsProgress, setLessonsProgress] = useState<LessonProgress[]>([]);
  const [unitsProgress, setUnitsProgress] = useState<UnitProgress[]>([]);

  if (!user) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  const handleUnitSelect = (unit: UnitType) => {
    setSelectedUnit(unit);
  };

  const handleUnitExit = () => {
    setSelectedUnit(null);
  };

  const handleLessonComplete = (lessonId: string, progress: LessonProgress) => {
    // Update lesson progress
    setLessonsProgress(prev => {
      const existing = prev.findIndex(lp => lp.lessonId === lessonId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...progress, userId: user.id };
        return updated;
      }
      return [...prev, { ...progress, userId: user.id }];
    });

    // Update unit progress
    if (selectedUnit) {
      const unitLessons = selectedUnit.lessons;
      const completedInUnit = lessonsProgress.filter(lp => 
        unitLessons.some(ul => ul.id === lp.lessonId) && lp.completed
      ).length + 1; // +1 for the just completed lesson

      setUnitsProgress(prev => {
        const existing = prev.findIndex(up => up.unitId === selectedUnit.id);
        const unitProgress: UnitProgress = {
          unitId: selectedUnit.id,
          userId: user.id,
          lessonsCompleted: completedInUnit,
          totalLessons: unitLessons.length,
          averageScore: 0, // Calculate this properly
          isUnlocked: true,
          completedAt: completedInUnit === unitLessons.length ? new Date() : undefined,
        };

        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = unitProgress;
          return updated;
        }
        return [...prev, unitProgress];
      });
    }
  };

  const getUnitProgress = (unitId: string) => {
    return unitsProgress.find(up => up.unitId === unitId);
  };

  const isUnitUnlocked = (unit: UnitType, index: number) => {
    if (index === 0) return true; // First unit is always unlocked
    
    // Check if previous unit is completed
    const previousUnit = beginnerVocalAssessment.units[index - 1];
    const previousProgress = getUnitProgress(previousUnit.id);
    return previousProgress?.lessonsCompleted === previousProgress?.totalLessons;
  };

  const totalCompletedLessons = lessonsProgress.filter(lp => lp.completed).length;
  const totalLessons = beginnerVocalAssessment.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0;

  if (selectedUnit) {
    const unitLessonsProgress = lessonsProgress.filter(lp => 
      selectedUnit.lessons.some(lesson => lesson.id === lp.lessonId)
    );

    return (
      <Unit
        unit={selectedUnit}
        lessonsProgress={unitLessonsProgress}
        onLessonComplete={handleLessonComplete}
        onExit={handleUnitExit}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.soft,
    }}>
      <Header 
        title={beginnerVocalAssessment.title}
        subtitle={beginnerVocalAssessment.description}
        variant="gradient"
        leftAction={
          <IconButton
            icon="back"
            onClick={() => navigate('/skill-tree')}
            ariaLabel="Back to skill tree"
          />
        }
      />

      <Container style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        {/* Overall Progress */}
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <h2 style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.lg,
          }}>
            Your Progress
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg }}>
            <div>
              <p style={{ fontSize: fontSize.sm, color: colors.textLight, marginBottom: spacing.sm }}>
                Overall Completion
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
                <span style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary }}>
                  {Math.round(overallProgress)}%
                </span>
                <span style={{ fontSize: fontSize.sm, color: colors.textLight }}>
                  ({totalCompletedLessons}/{totalLessons} lessons)
                </span>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: fontSize.sm, color: colors.textLight, marginBottom: spacing.sm }}>
                Units Completed
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
                <span style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.success }}>
                  {unitsProgress.filter(up => up.lessonsCompleted === up.totalLessons).length}
                </span>
                <span style={{ fontSize: fontSize.sm, color: colors.textLight }}>
                  of {beginnerVocalAssessment.units.length}
                </span>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: fontSize.sm, color: colors.textLight, marginBottom: spacing.sm }}>
                Target Age
              </p>
              <span style={{ fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: colors.text }}>
                {beginnerVocalAssessment.targetAge}
              </span>
            </div>
          </div>
        </Card>

        {/* Units Grid */}
        <h2 style={{
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginBottom: spacing.lg,
        }}>
          Learning Units
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: spacing.lg,
        }}>
          {beginnerVocalAssessment.units.map((unit, index) => {
            const unitProgress = getUnitProgress(unit.id);
            const isUnlocked = isUnitUnlocked(unit, index);
            const isCompleted = unitProgress?.lessonsCompleted === unitProgress?.totalLessons;
            const progressPercent = unitProgress 
              ? (unitProgress.lessonsCompleted / unitProgress.totalLessons) * 100 
              : 0;

            return (
              <Card
                key={unit.id}
                variant={isCompleted ? 'gradient' : 'elevated'}
                interactive={isUnlocked}
                onClick={() => isUnlocked && handleUnitSelect(unit)}
                style={{
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.6,
                  background: isCompleted ? gradients.success : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Unit Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  width: '50px',
                  height: '50px',
                  borderRadius: borderRadius.round,
                  backgroundColor: unit.color || colors.primary,
                  color: colors.textOnPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.bold,
                  boxShadow: shadows.md,
                }}>
                  {unit.number}
                </div>

                {unit.imageUrl && (
                  <img
                    src={unit.imageUrl}
                    alt={unit.title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      marginBottom: spacing.md,
                      borderRadius: borderRadius.sm,
                    }}
                  />
                )}

                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: fontWeight.semibold,
                  color: isCompleted ? colors.textOnPrimary : colors.text,
                  marginBottom: spacing.sm,
                }}>
                  {unit.title}
                </h3>

                <p style={{
                  fontSize: fontSize.sm,
                  color: isCompleted ? colors.textOnPrimary : colors.textLight,
                  marginBottom: spacing.lg,
                  lineHeight: 1.5,
                }}>
                  {unit.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.md,
                }}>
                  <span style={{
                    fontSize: fontSize.sm,
                    color: isCompleted ? colors.textOnPrimary : colors.textLight,
                  }}>
                    {unit.lessons.length} lessons
                  </span>
                  <span style={{
                    fontSize: fontSize.sm,
                    fontWeight: fontWeight.medium,
                    color: isCompleted ? colors.textOnPrimary : colors.text,
                  }}>
                    {unitProgress?.lessonsCompleted || 0}/{unit.lessons.length} complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '8px',
                  backgroundColor: isCompleted ? 'rgba(255,255,255,0.3)' : colors.border,
                  borderRadius: borderRadius.pill,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: isCompleted ? colors.textOnPrimary : colors.primary,
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
                        Complete previous unit to unlock
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        {beginnerVocalAssessment.units.length === 0 && (
          <Card variant="glass" style={{ textAlign: 'center', padding: spacing.xxl }}>
            <Icon name="info" size={48} color={colors.primary} />
            <h3 style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.semibold,
              color: colors.text,
              marginTop: spacing.lg,
              marginBottom: spacing.md,
            }}>
              Content Coming Soon
            </h3>
            <p style={{
              fontSize: fontSize.md,
              color: colors.textLight,
              marginBottom: spacing.lg,
            }}>
              We're working on migrating all the lessons to the new structure. Check back soon!
            </p>
            <Button onClick={() => navigate('/skill-tree')} variant="outline">
              Back to Skill Tree
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
};