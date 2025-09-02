import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { RecordingStep } from '../../../LessonSteps/RecordingStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson3VoiceDiscoveryProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson3VoiceDiscovery: React.FC<Lesson3VoiceDiscoveryProps> = ({
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
          id: 'high-low-theory',
          type: 'theory' as const,
          title: 'High and Low Sounds',
          instructions: 'Learn about different voice heights',
          content: `
# High & Low Voices 🎵

Our voices can make different sounds - **high** like a bird and **low** like a bear!

## Listen and Learn:
- **High sounds** = Baby birds chirping 🐦
- **Middle sounds** = Talking voice 🗣️
- **Low sounds** = Papa bear growling 🐻

## Remember:
All sounds are good! We're just exploring what our voice can do.
          `,
          media: [
            {
              type: 'image' as const,
              url: '/img/animal-voices.png',
              caption: 'Different animals make different pitched sounds'
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
          id: 'baby-bird-high',
          type: 'recording' as const,
          title: 'Baby Bird Voice',
          instructions: 'Make a high sound like a baby bird! Tweet tweet!',
          promptText: 'Tweet tweet!',
          promptAudio: '/audio/high-bird.mp3',
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
          id: 'papa-bear-low',
          type: 'recording' as const,
          title: 'Papa Bear Voice',
          instructions: 'Make a low sound like papa bear! Grrr!',
          promptText: 'Grrr!',
          promptAudio: '/audio/low-bear.mp3',
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
          id: 'your-voice',
          type: 'recording' as const,
          title: 'Find YOUR Voice',
          instructions: 'Now sing "La la la" in your comfortable middle voice',
          promptText: 'La la la',
          maxDuration: 5,
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
                High & Low
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Copy the sounds!
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
            src="/img/kooka-burra-calling-out.png"
            alt="Kooka cheering"
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
            "Wow! You can make so many different sounds!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};