import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { BreathingExerciseStep } from '../../../LessonSteps/BreathingExerciseStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson2BreathBasicsProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson2BreathBasics: React.FC<Lesson2BreathBasicsProps> = ({
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
          id: 'breath-theory',
          type: 'theory' as const,
          title: 'Why Breathing Matters',
          instructions: 'Learn about belly breathing',
          content: `
# Belly Breathing 🎈

When we sing, we need lots of air! But not just any breathing - we need **belly breathing**.

## Watch Kooka!
See how Kooka's belly gets big when breathing in? That's what we want to do!

## Try This:
1. Put your hand on your belly
2. Breathe in slowly - feel your belly push out
3. Breathe out slowly - feel your belly go in

Remember: Your shoulders should stay still. Only your belly moves!
          `,
          media: [
            {
              type: 'image' as const,
              url: '/img/kooka-burra-breathing.png',
              caption: 'Kooka shows belly breathing'
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
          id: 'belly-breathing-exercise',
          type: 'breathing-exercise' as const,
          title: 'Belly Breathing Practice',
          instructions: 'Place one hand on your belly and breathe with the circle',
          pattern: {
            inhale: 4,
            hold: 2,
            exhale: 4,
            rest: 2
          },
          repetitions: 5,
          visualGuide: '/img/breathing-circle.gif'
        }
      }
    },
    {
      id: 'breathing-2',
      component: BreathingExerciseStep,
      props: {
        step: {
          id: 'book-breathing',
          type: 'breathing-exercise' as const,
          title: 'Book on Belly',
          instructions: 'Lie down with a light book on your belly. Make it go up and down!',
          pattern: {
            inhale: 3,
            exhale: 3
          },
          repetitions: 8
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
      // Calculate average score
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
        {/* Lesson Header */}
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div>
              <h2 style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                Belly Breathing
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Blow up your belly!
              </p>
            </div>
            <Button onClick={onExit} variant="outline" icon={<Icon name="back" />}>
              Exit Lesson
            </Button>
          </div>
        </Card>

        {/* Progress */}
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

        {/* Current Step */}
        <StepComponent
          {...currentStepData.props}
          onComplete={handleStepComplete}
        />

        {/* Navigation */}
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

        {/* Motivational Message */}
        <div style={{
          textAlign: 'center',
          marginTop: spacing.xxl,
          opacity: 0.8,
        }}>
          <img
            src="/img/kooka-burra-breathing.png"
            alt="Kooka breathing"
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
            "Feel that belly moving? You're doing great!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};