import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { BreathingExerciseStep } from '../../../LessonSteps/BreathingExerciseStep';
import { VocalExerciseStep } from '../../../LessonSteps/VocalExerciseStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson1BookLiftBreathingProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson1BookLiftBreathing: React.FC<Lesson1BookLiftBreathingProps> = ({
  onComplete,
  onExit
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepScores, setStepScores] = useState<number[]>([]);

  const steps = [
    {
      id: 'theory-1',
      component: TheoryStep,
      props: {
        step: {
          id: 'book-breathing-theory',
          type: 'theory' as const,
          title: 'Book Breathing Technique',
          instructions: 'Learn the book breathing method',
          content: `
# Book Lift Breathing 📚

This is a powerful technique to help you feel and see your breathing!

## Why Book Breathing?
- You can **see** your belly move
- You can **feel** the weight
- It helps you breathe **deeper**
- It's fun and easy!

## How It Works:
1. Lie down on your back
2. Place a light book on your belly
3. Breathe in = book goes UP
4. Breathe out = book goes DOWN

## Remember:
- Your chest should stay still
- Only your belly (and the book) should move
- Breathe slowly and smoothly
          `,
          media: [
            {
              type: 'image' as const,
              url: '/img/book-breathing.png',
              caption: 'Book goes up when you breathe in, down when you breathe out'
            }
          ]
        }
      }
    },
    {
      id: 'breathing-1',
      component: BreathingExerciseStep,
      props: {
        step: {
          id: 'book-lift-practice',
          type: 'breathing-exercise' as const,
          title: 'Book Lift Practice',
          instructions: 'Lie down with a book on your belly. Watch it rise and fall!',
          pattern: {
            inhale: 4,
            hold: 2,
            exhale: 4,
            rest: 2
          },
          repetitions: 6,
          visualGuide: '/img/book-lift-animation.gif'
        }
      }
    },
    {
      id: 'breathing-2',
      component: BreathingExerciseStep,
      props: {
        step: {
          id: 'candle-breathing',
          type: 'breathing-exercise' as const,
          title: 'Candle Breathing',
          instructions: 'Breathe out slowly like blowing out a candle far away',
          pattern: {
            inhale: 3,
            exhale: 6
          },
          repetitions: 5
        }
      }
    },
    {
      id: 'vocal-1',
      component: VocalExerciseStep,
      props: {
        step: {
          id: 'breath-flow-ah',
          type: 'vocal-exercise' as const,
          title: 'Breath Flow "Ah"',
          instructions: 'Use your book breathing to sing a steady "Ah" sound',
          exerciseType: 'vowels' as const,
          audioGuide: '/audio/breath-flow-ah.mp3',
          visualGuide: '/img/vowel-ah.png'
        }
      }
    }
  ];

  const handleStepComplete = (score: number) => {
    const newScores = [...stepScores, score];
    setStepScores(newScores);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const avgScore = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      onComplete(Math.round(avgScore));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.soft,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    }}>
      <Container maxWidth="800px">
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div>
              <h2 style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                Book Lift Breathing
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Feel your belly lift and lower.
              </p>
            </div>
            <Button onClick={onExit} variant="outline" icon={<Icon name="back" />}>
              Exit Lesson
            </Button>
          </div>
        </Card>

        <div style={{ marginBottom: spacing.xl }}>
          <Progress 
            value={progress} 
            max={100} 
            size="medium"
            color="primary"
            animated
            label={`Step ${currentStep + 1} of ${steps.length}`}
            showValue
          />
        </div>

        <StepComponent
          {...currentStepData.props}
          onComplete={handleStepComplete}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: spacing.md,
          marginTop: spacing.xl,
        }}>
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            icon={<Icon name="back" />}
          >
            Previous
          </Button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: spacing.xxl,
          opacity: 0.8,
        }}>
          <img
            src="/img/breathing-book.png"
            alt="Book breathing"
            style={{
              width: '120px',
              marginBottom: spacing.md,
            }}
          />
          <p style={{
            fontSize: fontSize.md,
            color: colors.textLight,
            fontStyle: 'italic',
          }}>
            "Feel that book moving? That's perfect breathing!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};