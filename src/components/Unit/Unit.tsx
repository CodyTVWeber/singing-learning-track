import React, { useState } from 'react';
import { Unit as UnitType, Lesson as LessonType, LessonProgress } from '../../models/skillAssessment';
import { Lesson } from '../Lesson/Lesson';
import { Card } from '../Card';
import { Container } from '../Container';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../../theme/theme';

interface UnitProps {
  unit: UnitType;
  lessonsProgress: LessonProgress[];
  onLessonComplete: (lessonId: string, progress: LessonProgress) => void;
  onExit: () => void;
}

export const Unit: React.FC<UnitProps> = ({ unit, lessonsProgress, onLessonComplete, onExit }) => {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [showLessonList, setShowLessonList] = useState(true);

  const getLessonProgress = (lessonId: string) => {
    return lessonsProgress.find(lp => lp.lessonId === lessonId);
  };

  const isLessonUnlocked = (lesson: LessonType, index: number) => {
    if (index === 0) return true; // First lesson is always unlocked
    
    // Check if prerequisites are met
    if (lesson.prerequisites) {
      return lesson.prerequisites.every(prereqId => {
        const prereqProgress = getLessonProgress(prereqId);
        return prereqProgress?.completed;
      });
    }
    
    // Check if previous lesson is completed
    const previousLesson = unit.lessons[index - 1];
    const previousProgress = getLessonProgress(previousLesson.id);
    return previousProgress?.completed || false;
  };

  const handleLessonSelect = (lesson: LessonType, index: number) => {
    if (isLessonUnlocked(lesson, index)) {
      setSelectedLesson(lesson);
      setShowLessonList(false);
    }
  };

  const handleLessonComplete = (lessonId: string, stepProgress: any) => {
    const progress: LessonProgress = {
      lessonId,
      userId: '', // Will be filled by parent
      started: true,
      completed: true,
      stepProgress,
      totalScore: stepProgress.reduce((sum: number, sp: any) => sum + (sp.score || 0), 0) / stepProgress.length,
      completedAt: new Date(),
    };
    
    onLessonComplete(lessonId, progress);
    setSelectedLesson(null);
    setShowLessonList(true);
  };

  const handleLessonExit = () => {
    setSelectedLesson(null);
    setShowLessonList(true);
  };

  const completedLessons = lessonsProgress.filter(lp => lp.completed).length;
  const unitProgress = (completedLessons / unit.lessons.length) * 100;

  if (selectedLesson && !showLessonList) {
    return (
      <Lesson
        lesson={selectedLesson}
        onComplete={(stepProgress) => handleLessonComplete(selectedLesson.id, stepProgress)}
        onExit={handleLessonExit}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: unit.color ? `linear-gradient(135deg, ${unit.color}20 0%, ${colors.background} 100%)` : gradients.soft,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    }}>
      <Container maxWidth="1000px">
        {/* Unit Header */}
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
              {unit.imageUrl && (
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
              )}
              <div>
                <h1 style={{
                  fontSize: fontSize.huge,
                  fontWeight: fontWeight.bold,
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}>
                  Unit {unit.number}: {unit.title}
                </h1>
                <p style={{
                  fontSize: fontSize.lg,
                  color: colors.textLight,
                }}>
                  {unit.description}
                </p>
              </div>
            </div>
            <Button onClick={onExit} variant="outline" icon={<Icon name="back" />}>
              Back to Units
            </Button>
          </div>
        </Card>

        {/* Unit Progress */}
        <Card variant="elevated" style={{ marginBottom: spacing.xl }}>
          <h3 style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Unit Progress
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{
              flex: 1,
              height: '20px',
              backgroundColor: colors.surface,
              borderRadius: borderRadius.pill,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${unitProgress}%`,
                height: '100%',
                background: gradients.primary,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              color: colors.text,
            }}>
              {completedLessons}/{unit.lessons.length} Lessons
            </span>
          </div>
        </Card>

        {/* Lessons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: spacing.lg,
        }}>
          {unit.lessons.map((lesson, index) => {
            const progress = getLessonProgress(lesson.id);
            const isUnlocked = isLessonUnlocked(lesson, index);
            const isCompleted = progress?.completed || false;
            
            return (
              <Card
                key={lesson.id}
                variant={isCompleted ? 'gradient' : 'elevated'}
                interactive={isUnlocked}
                onClick={() => handleLessonSelect(lesson, index)}
                style={{
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.6,
                  background: isCompleted ? gradients.success : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Lesson Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.round,
                  backgroundColor: isCompleted ? colors.success : colors.primary,
                  color: colors.textOnPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.bold,
                }}>
                  {index + 1}
                </div>

                {lesson.imageUrl && (
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      marginBottom: spacing.md,
                      borderRadius: borderRadius.sm,
                    }}
                  />
                )}

                <h3 style={{
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.semibold,
                  color: isCompleted ? colors.textOnPrimary : colors.text,
                  marginBottom: spacing.sm,
                }}>
                  {lesson.title}
                </h3>

                <p style={{
                  fontSize: fontSize.sm,
                  color: isCompleted ? colors.textOnPrimary : colors.textLight,
                  marginBottom: spacing.md,
                  lineHeight: 1.5,
                }}>
                  {lesson.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    fontSize: fontSize.sm,
                    color: isCompleted ? colors.textOnPrimary : colors.textLight,
                  }}>
                    <Icon name="info" size={14} />
                    {lesson.estimatedDuration} min
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}>
                    {isCompleted && (
                      <>
                        <Icon name="check" size={16} color={colors.textOnPrimary} />
                        <span style={{
                          fontSize: fontSize.sm,
                          color: colors.textOnPrimary,
                          fontWeight: fontWeight.medium,
                        }}>
                          {Math.round(progress.totalScore)}%
                        </span>
                      </>
                    )}
                    {!isUnlocked && (
                      <Icon name="warning" size={16} color={colors.warning} />
                    )}
                  </div>
                </div>

                {/* Steps indicator */}
                <div style={{
                  marginTop: spacing.md,
                  paddingTop: spacing.md,
                  borderTop: `1px solid ${isCompleted ? 'rgba(255,255,255,0.2)' : colors.border}`,
                }}>
                  <p style={{
                    fontSize: fontSize.xs,
                    color: isCompleted ? colors.textOnPrimary : colors.textLight,
                  }}>
                    {lesson.steps.length} lesson steps • {lesson.difficulty}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
};