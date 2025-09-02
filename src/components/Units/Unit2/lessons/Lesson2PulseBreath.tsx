import React, { useState } from 'react';
import { TheoryStep } from '../../../LessonSteps/TheoryStep';
import { RecordingStep } from '../../../LessonSteps/RecordingStep';
import { VocalExerciseStep } from '../../../LessonSteps/VocalExerciseStep';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { Progress } from '../../../Progress';
import { Icon } from '../../../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../../../theme/theme';

interface Lesson2PulseBreathProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson2PulseBreath: React.FC<Lesson2PulseBreathProps> = ({
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
          id: 'pulse-breath-theory',
          type: 'theory' as const,
          title: 'Pulse Breath Power',
          instructions: 'Learn about pulse breathing',
          content: `
# Pulse Breath Support 💨

This exercise makes your breathing muscles strong like a superhero!

## What are Pulses?
Pulses are quick, short bursts of air: **pff-pff-pff**

## Why Do Pulses?
- Makes your belly muscles **strong**
- Helps you sing **longer** phrases
- Gives you **control** over your breath
- It's like exercise for your voice!

## How to Do It:
1. Stand tall like a tree 🌳
2. Take a deep breath in
3. Make quick "pff" sounds
4. Feel your belly bounce!

## Pro Tip:
Put your hand on your belly to feel the pulses!
          `
        }
      }
    },
    {
      id: 'recording-1',
      component: RecordingStep,
      props: {
        step: {
          id: 'pulse-practice-slow',
          type: 'recording' as const,
          title: 'Slow Pulses',
          instructions: 'Take a deep breath and make 5 slow "pff" sounds',
          promptText: 'Pff... Pff... Pff... Pff... Pff',
          promptAudio: '/audio/pulse-slow.mp3',
          maxDuration: 10,
          minVolumeThreshold: 20
        }
      }
    },
    {
      id: 'recording-2',
      component: RecordingStep,
      props: {
        step: {
          id: 'pulse-practice-fast',
          type: 'recording' as const,
          title: 'Fast Pulses',
          instructions: 'Now make 10 quick "pff" sounds in one breath!',
          promptText: 'Pff-pff-pff-pff-pff-pff-pff-pff-pff-pff!',
          promptAudio: '/audio/pulse-fast.mp3',
          maxDuration: 10,
          minVolumeThreshold: 20
        }
      }
    },
    {
      id: 'vocal-1',
      component: VocalExerciseStep,
      props: {
        step: {
          id: 'pulse-scales',
          type: 'vocal-exercise' as const,
          title: 'Pulse Scales',
          instructions: 'Use pulses while going up and down a scale',
          exerciseType: 'scales' as const,
          audioGuide: '/audio/pulse-scales.mp3'
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
                Pulse Breath Support
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                Pff-pff-pff to strengthen your breath.
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
            src="/img/breathing-pulse.png"
            alt="Pulse breathing"
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
            "Your breath is getting stronger! Keep pulsing!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};