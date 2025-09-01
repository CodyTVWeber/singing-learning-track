import React from 'react';
import { EchoStep as EchoStepType } from '../../models/skillAssessment';
import { EchoLesson } from '../EchoLesson';

interface EchoStepProps {
  step: EchoStepType;
  onComplete: (score: number, audioUrl: string) => void;
}

export const EchoStep: React.FC<EchoStepProps> = ({ step, onComplete }) => {
  // Reuse the existing EchoLesson component with the step data
  return (
    <EchoLesson
      promptAudio={step.promptAudio}
      promptText={step.promptText}
      onComplete={onComplete}
      minVolumeThreshold={step.minVolumeThreshold}
      targetDuration={step.targetDuration}
    />
  );
};