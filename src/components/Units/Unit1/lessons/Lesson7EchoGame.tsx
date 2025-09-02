import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { EchoStep } from '../../../LessonSteps/EchoStep';
import { AssessmentStep } from '../../../LessonSteps/AssessmentStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson7EchoGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson7EchoGame: React.FC<Lesson7EchoGameProps> = ({
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
          id: 'echo-game-intro',
          type: 'theory' as const,
          title: 'The Echo Game',
          instructions: 'Learn how to be a perfect echo!',
          content: `
# Echo Echo! 🔊

An echo is when a sound bounces back to you. When you shout in a big canyon, you hear your voice come back!

## How to Play:
1. **Listen** carefully to the sound
2. **Wait** for your turn
3. **Copy** exactly what you heard
4. **Have fun!**

## Tips for Success:
- Take a deep breath before you echo
- Try to match the volume
- Copy the rhythm too
- Don't worry about being perfect - just try your best!

Ready to be Kooka's echo?
          `
        }
      }
    },
    {
      id: 'echo-1',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-simple',
          type: 'echo' as const,
          title: 'Simple Echo',
          instructions: 'Echo this simple sound',
          promptText: 'La la la',
          promptAudio: '/audio/echo-la-la-la.mp3',
          minVolumeThreshold: 30,
          targetDuration: 3
        }
      }
    },
    {
      id: 'echo-2',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-pattern',
          type: 'echo' as const,
          title: 'Pattern Echo',
          instructions: 'Echo this rhythm pattern',
          promptText: 'Ta ta ti-ti ta',
          promptAudio: '/audio/echo-pattern.mp3',
          minVolumeThreshold: 30,
          targetDuration: 3
        }
      }
    },
    {
      id: 'echo-3',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-melody',
          type: 'echo' as const,
          title: 'Melody Echo',
          instructions: 'Echo this little melody',
          promptText: 'Do re mi',
          promptAudio: '/audio/echo-do-re-mi.mp3',
          minVolumeThreshold: 30,
          targetDuration: 3
        }
      }
    },
    {
      id: 'assessment-1',
      component: AssessmentStep,
      props: {
        step: {
          id: 'echo-quiz',
          type: 'assessment' as const,
          title: 'Echo Challenge',
          instructions: 'Test your echo knowledge!',
          questions: [
            {
              id: 'q1',
              question: 'What should you do FIRST in the echo game?',
              options: ['Start singing', 'Listen carefully', 'Clap your hands', 'Jump up'],
              correctAnswer: 1
            },
            {
              id: 'q2',
              question: 'When you echo, you should try to...',
              options: ['Sing louder', 'Sing softer', 'Copy exactly', 'Change the words'],
              correctAnswer: 2
            },
            {
              id: 'q3',
              question: 'What makes a good echo?',
              options: ['Being very loud', 'Being very quiet', 'Matching what you heard', 'Singing fast'],
              correctAnswer: 2
            }
          ]
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
                Echo Echo
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Copy me!
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
            src="/img/echo-practice.png"
            alt="Echo practice"
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
            "You're an echo expert now!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};