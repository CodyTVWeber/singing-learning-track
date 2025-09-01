import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { ClapTheBeatStep } from '../../../LessonSteps/ClapTheBeatStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson5RhythmClapProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson5RhythmClap: React.FC<Lesson5RhythmClapProps> = ({
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
          id: 'rhythm-intro',
          type: 'theory' as const,
          title: 'What is Rhythm?',
          instructions: 'Learn about beats and rhythm',
          content: `
# Rhythm and Beat 🥁

Rhythm is the pattern of sounds in music. It's like the heartbeat of a song!

## Key Ideas:
- **Beat** = The steady pulse (like your heartbeat)
- **Rhythm** = The pattern of claps and rests
- **Tempo** = How fast or slow we go

## Let's Practice:
1. Pat your lap steadily - that's the beat!
2. Now clap different patterns - that's rhythm!
3. We can go slow... or fast!

Remember: Stay relaxed and have fun!
          `
        }
      }
    },
    {
      id: 'clap-1',
      component: ClapTheBeatStep,
      props: {
        step: {
          id: 'steady-beat',
          type: 'clap-the-beat' as const,
          title: 'Steady Beat',
          instructions: 'Start with a simple steady beat. Clap with me!',
          pattern: ['clap', 'clap', 'clap', 'clap'],
          bpm: 80,
          audioExample: '/audio/steady-beat.mp3'
        }
      }
    },
    {
      id: 'clap-2',
      component: ClapTheBeatStep,
      props: {
        step: {
          id: 'slow-fast',
          type: 'clap-the-beat' as const,
          title: 'Slow and Fast',
          instructions: 'Now let\'s try a faster beat!',
          pattern: ['clap', 'clap', 'clap', 'clap', 'clap', 'clap', 'clap', 'clap'],
          bpm: 120,
          audioExample: '/audio/fast-beat.mp3'
        }
      }
    },
    {
      id: 'clap-3',
      component: ClapTheBeatStep,
      props: {
        step: {
          id: 'pattern-1',
          type: 'clap-the-beat' as const,
          title: 'Fun Pattern',
          instructions: 'Can you copy this pattern? Listen first!',
          pattern: ['clap', 'clap', 'rest', 'clap', 'rest', 'clap', 'clap', 'rest'],
          bpm: 100,
          audioExample: '/audio/rhythm-pattern.mp3'
        }
      }
    },
    {
      id: 'clap-4',
      component: ClapTheBeatStep,
      props: {
        step: {
          id: 'your-pattern',
          type: 'clap-the-beat' as const,
          title: 'Make Your Own!',
          instructions: 'Create your own rhythm pattern!',
          pattern: ['clap', 'rest', 'clap', 'clap', 'rest', 'clap', 'rest', 'clap'],
          bpm: 100
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
                Clap the Beat
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Follow the rhythm!
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
            src="/img/rhythm-practice.png"
            alt="Rhythm practice"
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
            "You've got rhythm! Keep it up!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};