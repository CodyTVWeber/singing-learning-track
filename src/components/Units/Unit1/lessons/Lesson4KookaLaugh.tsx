import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { ClapTheBeatStep } from '../../../LessonSteps/ClapTheBeatStep';
import { EchoStep } from '../../../LessonSteps/EchoStep';
import { RecordingStep } from '../../../LessonSteps/RecordingStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson4KookaLaughProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson4KookaLaugh: React.FC<Lesson4KookaLaughProps> = ({
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
          id: 'kookaburra-intro',
          type: 'theory' as const,
          title: 'The Kookaburra Song',
          instructions: 'Learn about the famous Kookaburra song',
          content: `
# Kookaburra Song 🎵

This is a special song about me, Kooka! It's been sung by children all over the world.

## The Words:
**Kookaburra sits in the old gum tree**  
**Merry, merry king of the bush is he**  
**Laugh, Kookaburra! Laugh, Kookaburra!**  
**Gay your life must be!**

## Fun Fact:
Did you know? Kookaburras really do laugh! Our call sounds like "kook-kook-kook-ka-ka-ka!"
          `,
          media: [
            {
              type: 'image' as const,
              url: '/img/kooka-burra-singing.png',
              caption: 'Kooka loves this song!'
            }
          ]
        }
      }
    },
    {
      id: 'clap-1',
      component: ClapTheBeatStep,
      props: {
        step: {
          id: 'kookaburra-rhythm',
          type: 'clap-the-beat' as const,
          title: 'Clap the Song Rhythm',
          instructions: 'Let\'s clap the rhythm of the Kookaburra song!',
          pattern: ['clap', 'clap', 'rest', 'clap', 'clap', 'rest', 'clap', 'rest'],
          bpm: 100,
          audioExample: '/audio/kookaburra-rhythm.mp3'
        }
      }
    },
    {
      id: 'echo-1',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-line-1',
          type: 'echo' as const,
          title: 'Echo First Line',
          instructions: 'Listen and repeat the first line',
          promptText: 'Kookaburra sits in the old gum tree',
          promptAudio: '/audio/kookaburra-line1.mp3',
          minVolumeThreshold: 30,
          targetDuration: 4
        }
      }
    },
    {
      id: 'echo-2',
      component: EchoStep,
      props: {
        step: {
          id: 'echo-laugh',
          type: 'echo' as const,
          title: 'Practice the Laugh',
          instructions: 'Let\'s practice the kookaburra laugh!',
          promptText: 'Laugh, Kookaburra! Laugh, Kookaburra!',
          promptAudio: '/audio/kookaburra-laugh.mp3',
          minVolumeThreshold: 30,
          targetDuration: 3
        }
      }
    },
    {
      id: 'recording-1',
      component: RecordingStep,
      props: {
        step: {
          id: 'sing-whole-song',
          type: 'recording' as const,
          title: 'Sing the Whole Song!',
          instructions: 'Now sing the whole Kookaburra song! You can do it!',
          promptAudio: '/audio/kookaburra-backing.mp3',
          maxDuration: 30,
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
                Kooka Laugh Song
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Sing along!
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
            src="/img/kooka-burra-dancing.png"
            alt="Kooka dancing"
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
            "You're singing my song! I love it!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};