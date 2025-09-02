import React, { useState } from 'react';
import { Lesson1BookLiftBreathing } from './lessons/Lesson1BookLiftBreathing';
import { Lesson2PulseBreath } from './lessons/Lesson2PulseBreath';
import { Lesson3LoudLionSoftMouse } from './lessons/Lesson3LoudLionSoftMouse';
import { Lesson4PostureTree } from './lessons/Lesson4PostureTree';
import { Lesson5YouAreMySunshine } from './lessons/Lesson5YouAreMySunshine';
import { Lesson6EchoHelloSunshine } from './lessons/Lesson6EchoHelloSunshine';
import { Card } from '../../Card';
import { Container } from '../../Container';
import { Button } from '../../Button';
import { Progress } from '../../Progress';
import { Icon } from '../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../../../theme/theme';

interface Unit2BreathControlProps {
  onLessonComplete: (lessonId: string, score: number) => void;
  completedLessons: string[];
  onExit: () => void;
}

export const Unit2BreathControl: React.FC<Unit2BreathControlProps> = ({
  onLessonComplete,
  completedLessons,
  onExit
}) => {
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);

  const lessons = [
    { 
      id: 'u2-breath-book-lift', 
      component: Lesson1BookLiftBreathing, 
      title: 'Book Lift Breathing', 
      description: 'Feel your belly lift and lower.' 
    },
    { 
      id: 'u2-pulse-breath', 
      component: Lesson2PulseBreath, 
      title: 'Pulse Breath Support', 
      description: 'Pff-pff-pff to strengthen your breath.' 
    },
    { 
      id: 'u2-dynamics-lion-mouse', 
      component: Lesson3LoudLionSoftMouse, 
      title: 'Loud Lion, Soft Mouse', 
      description: 'Change volume while keeping control.' 
    },
    { 
      id: 'u2-posture-check', 
      component: Lesson4PostureTree, 
      title: 'Posture: Tall Like a Tree', 
      description: 'Stand balanced for better singing.' 
    },
    { 
      id: 'u2-song-you-are-my-sunshine', 
      component: Lesson5YouAreMySunshine, 
      title: 'Song: You Are My Sunshine', 
      description: 'Sing with happy and soft parts.' 
    },
    { 
      id: 'u2-echo-hello-sunshine', 
      component: Lesson6EchoHelloSunshine, 
      title: 'Echo: Hello Sunshine', 
      description: 'Listen, then echo the phrase.' 
    }
  ];

  const isLessonUnlocked = (lessonId: string, index: number) => {
    if (index === 0) return true;
    const previousLessonId = lessons[index - 1].id;
    return completedLessons.includes(previousLessonId);
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLesson(lessonId);
  };

  const handleLessonComplete = (score: number) => {
    if (currentLesson) {
      onLessonComplete(currentLesson, score);
      setCurrentLesson(null);
    }
  };

  const handleLessonExit = () => {
    setCurrentLesson(null);
  };

  // Render current lesson if selected
  if (currentLesson) {
    const LessonComponent = lessons.find(l => l.id === currentLesson)?.component;
    if (LessonComponent) {
      return (
        <LessonComponent
          onComplete={handleLessonComplete}
          onExit={handleLessonExit}
        />
      );
    }
  }

  const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = (completedCount / lessons.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #FF6B6B20 0%, ${colors.background} 100%)`,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    }}>
      <Container maxWidth="1000px">
        {/* Unit Header */}
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
              <img
                src="/img/breathing-book.png"
                alt="Breath Control & Dynamics"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: borderRadius.md,
                  objectFit: 'cover',
                }}
              />
              <div>
                <h1 style={{
                  fontSize: fontSize.huge,
                  fontWeight: fontWeight.bold,
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}>
                  Unit 2: Breath Control & Dynamics
                </h1>
                <p style={{
                  fontSize: fontSize.lg,
                  color: colors.textLight,
                }}>
                  Stronger breath, posture, and volume control
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
          <Progress 
            value={progress} 
            max={100} 
            size="medium"
            color="primary"
            animated
            label={`${completedCount}/${lessons.length} Lessons Complete`}
            showValue
          />
        </Card>

        {/* Lessons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: spacing.lg,
        }}>
          {lessons.map((lesson, index) => {
            const isUnlocked = isLessonUnlocked(lesson.id, index);
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <Card
                key={lesson.id}
                variant={isCompleted ? 'gradient' : 'elevated'}
                interactive={isUnlocked}
                onClick={() => isUnlocked && handleLessonSelect(lesson.id)}
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

                <h3 style={{
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.semibold,
                  color: isCompleted ? colors.textOnPrimary : colors.text,
                  marginBottom: spacing.sm,
                  paddingRight: '50px',
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
                }}>
                  {isCompleted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      <Icon name="check" size={16} color={colors.textOnPrimary} />
                      <span style={{
                        fontSize: fontSize.sm,
                        color: colors.textOnPrimary,
                        fontWeight: fontWeight.medium,
                      }}>
                        Complete
                      </span>
                    </div>
                  )}
                  {!isUnlocked && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      <Icon name="warning" size={16} color={colors.warning} />
                      <span style={{
                        fontSize: fontSize.sm,
                        color: colors.textLight,
                      }}>
                        Locked
                      </span>
                    </div>
                  )}
                  {isUnlocked && !isCompleted && (
                    <span style={{
                      fontSize: fontSize.sm,
                      color: colors.primary,
                      fontWeight: fontWeight.medium,
                    }}>
                      Start →
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
};