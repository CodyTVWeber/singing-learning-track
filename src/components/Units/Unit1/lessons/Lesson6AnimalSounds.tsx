import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { RecordingStep } from '../../../LessonSteps/RecordingStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson6AnimalSoundsProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson6AnimalSounds: React.FC<Lesson6AnimalSoundsProps> = ({
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
          id: 'animal-voices-intro',
          type: 'theory' as const,
          title: 'Animal Voice Orchestra',
          instructions: 'Learn how different animals use different voice heights',
          content: `
# Animal Voices 🐱🐶🐮

Every animal has its own special voice, just like you!

## Our Animal Friends:
- 🐱 **Cat** says "MEOW" (high voice)
- 🐶 **Dog** says "WOOF" (middle voice)  
- 🐮 **Cow** says "MOO" (low voice)

## Voice Heights:
- **High** = Head voice (like when you're excited!)
- **Middle** = Speaking voice (your normal voice)
- **Low** = Chest voice (deep and rumbly)

Let's explore all these different voices!
          `,
          media: [
            {
              type: 'image' as const,
              url: '/img/animal-voices.png',
              caption: 'Animals make different sounds at different pitches'
            }
          ]
        }
      }
    },
    {
      id: 'recording-1',
      component: RecordingStep,
      props: {
        step: {
          id: 'cat-meow',
          type: 'recording' as const,
          title: 'Be a Cat',
          instructions: 'Make a high "MEOW" sound like a cat!',
          promptText: 'MEOW!',
          promptAudio: '/audio/cat-meow.mp3',
          maxDuration: 5,
          minVolumeThreshold: 25
        }
      }
    },
    {
      id: 'recording-2',
      component: RecordingStep,
      props: {
        step: {
          id: 'dog-woof',
          type: 'recording' as const,
          title: 'Be a Dog',
          instructions: 'Make a middle "WOOF" sound like a dog!',
          promptText: 'WOOF!',
          promptAudio: '/audio/dog-woof.mp3',
          maxDuration: 5,
          minVolumeThreshold: 25
        }
      }
    },
    {
      id: 'recording-3',
      component: RecordingStep,
      props: {
        step: {
          id: 'cow-moo',
          type: 'recording' as const,
          title: 'Be a Cow',
          instructions: 'Make a low "MOO" sound like a cow!',
          promptText: 'MOO!',
          promptAudio: '/audio/cow-moo.mp3',
          maxDuration: 5,
          minVolumeThreshold: 25
        }
      }
    },
    {
      id: 'recording-4',
      component: RecordingStep,
      props: {
        step: {
          id: 'animal-mix',
          type: 'recording' as const,
          title: 'Animal Mix-Up!',
          instructions: 'Now make all three sounds in a row: MEOW, WOOF, MOO!',
          promptText: 'MEOW, WOOF, MOO!',
          maxDuration: 10,
          minVolumeThreshold: 25
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
                Animal Voices
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Be the animals!
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
            src="/img/animal-voices.png"
            alt="Animal friends"
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
            "You're the best animal voice actor!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};