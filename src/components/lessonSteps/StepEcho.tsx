import React from 'react';
import { EchoLesson } from '../EchoLesson';

interface StepEchoProps {
  promptText: string;
  promptAudio: string;
  onComplete: (score: number) => void;
}

export const StepEcho: React.FC<StepEchoProps> = ({ promptText, promptAudio, onComplete }) => {
  return (
    <EchoLesson
      promptAudio={promptAudio}
      promptText={promptText}
      onComplete={(score) => onComplete(score)}
    />
  );
};

export default StepEcho;
