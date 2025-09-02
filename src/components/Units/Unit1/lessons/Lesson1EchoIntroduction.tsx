import React, { useState } from 'react';
import { EchoStep } from '../../../LessonSteps/EchoStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson1EchoIntroductionProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson1EchoIntroduction: React.FC<Lesson1EchoIntroductionProps> = ({
  onComplete,
  onExit
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepScores, setStepScores] = useState<number[]>([]);

  const steps = [
    {
      id: 'echo-1',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-introduction-1',
          type: 'echo' as const,
          title: 'Echo with Kooka',
          instructions: 'Listen carefully and repeat what you hear!',
          promptText: 'Koo-ka-bur-ra!',
          promptAudio: '/audio/echo_prompt.mp3',
          minVolumeThreshold: 30,
          targetDuration: 3
        }
      }
    }
  ];

  const handleStepComplete = (score: number, audioUrl?: string) => {
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
                Echo with Kooka
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Listen and repeat!
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

        {/* Motivational Message */}
        <div style={{
          textAlign: 'center',
          marginTop: spacing.xxl,
          opacity: 0.8,
        }}>
          <img
            src="/img/kooka-burra-dancing.png"
            alt="Kooka encouraging you"
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
            "Great job echoing! You're a natural!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};