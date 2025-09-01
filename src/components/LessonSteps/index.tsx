import React from 'react';
import { LessonStep } from '../../models/skillAssessment';
import { AssessmentStep } from './AssessmentStep';
import { RecordingStep } from './RecordingStep';
import { EchoStep } from './EchoStep';
import { ClapTheBeatStep } from './ClapTheBeatStep';
import { BreathingExerciseStep } from './BreathingExerciseStep';
import { Card } from '../Card';
import { colors, fontSize, spacing } from '../../theme/theme';

interface LessonStepRendererProps {
  step: LessonStep;
  onComplete: (score: number, data?: any) => void;
}

export const LessonStepRenderer: React.FC<LessonStepRendererProps> = ({ step, onComplete }) => {
  switch (step.type) {
    case 'assessment':
      return <AssessmentStep step={step} onComplete={onComplete} />;
    
    case 'recording':
      return <RecordingStep step={step} onComplete={onComplete} />;
    
    case 'echo':
      return <EchoStep step={step} onComplete={onComplete} />;
    
    case 'clap-the-beat':
      return <ClapTheBeatStep step={step} onComplete={onComplete} />;
    
    case 'breathing-exercise':
      return <BreathingExerciseStep step={step} onComplete={onComplete} />;
    
    // Placeholder for unimplemented step types
    default:
      return (
        <Card variant="elevated">
          <h3 style={{
            fontSize: fontSize.xl,
            color: colors.text,
            marginBottom: spacing.md
          }}>
            {step.title}
          </h3>
          <p style={{
            fontSize: fontSize.md,
            color: colors.textLight,
            marginBottom: spacing.lg
          }}>
            {step.instructions}
          </p>
          <p style={{
            fontSize: fontSize.sm,
            color: colors.warning,
            fontStyle: 'italic'
          }}>
            Step type "{step.type}" is coming soon!
          </p>
        </Card>
      );
  }
};

export { AssessmentStep } from './AssessmentStep';
export { RecordingStep } from './RecordingStep';
export { EchoStep } from './EchoStep';
export { ClapTheBeatStep } from './ClapTheBeatStep';
export { BreathingExerciseStep } from './BreathingExerciseStep';