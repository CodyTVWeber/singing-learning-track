import type { ReactNode } from 'react';
import { StepText } from '../components/lessonSteps/StepText';
import { StepAudio } from '../components/lessonSteps/StepAudio';
import { StepEcho } from '../components/lessonSteps/StepEcho';

export function makeStepsFromStrings(steps: string[], audioId?: string): ReactNode[] {
  const nodes: ReactNode[] = steps.map((s, idx) => (
    <StepText key={`text-${idx}`} content={s} />
  ));
  if (audioId) {
    nodes.push(<StepAudio key="audio" audioId={audioId} />);
  }
  return nodes;
}

export function makeEchoSteps(promptText: string, promptAudio: string): ReactNode[] {
  return [
    <StepEcho key="echo" promptText={promptText} promptAudio={promptAudio} onComplete={() => {}} />,
  ];
}

