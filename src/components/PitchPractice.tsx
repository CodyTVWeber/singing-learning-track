import React, { useMemo, useState } from 'react';
import { colors, spacing, fontSize, fontWeight } from '../theme/theme';
import { PitchMeter } from './PitchMeter';
import { ReferenceAudio } from './ReferenceAudio';
import { AudioRecorder } from './AudioRecorder';
import { resolveAudioId } from '../services/audioMap';

interface PitchPracticeProps {
  audioId?: string | null;
  targetHz?: number; // If provided, use as target. Otherwise derive from audioId if possible
}

export const PitchPractice: React.FC<PitchPracticeProps> = ({ audioId, targetHz }) => {
  const [currentHz, setCurrentHz] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const resolved = useMemo(() => resolveAudioId(audioId ?? undefined), [audioId]);

  const derivedTargetHz = useMemo(() => {
    if (typeof targetHz === 'number') return targetHz;
    if (resolved?.type === 'sequence' && resolved.sequence.length > 0) {
      return resolved.sequence[0].frequency;
    }
    if (resolved?.type === 'glide') return resolved.fromHz;
    return undefined;
  }, [targetHz, resolved]);

  return (
    <div>
      <div style={{ marginBottom: spacing.md }}>
        <ReferenceAudio audioId={audioId} />
      </div>

      <div style={{ marginBottom: spacing.md }}>
        <PitchMeter targetHz={derivedTargetHz} currentHz={currentHz} confidence={confidence} />
      </div>

      <div style={{ marginBottom: spacing.sm, textAlign: 'center', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text }}>
        Sing the note and try to center the meter
      </div>

      <AudioRecorder
        maxDuration={10}
        onPitchChange={(r) => {
          setCurrentHz(r.frequencyHz);
          setConfidence(r.confidence);
        }}
      />
    </div>
  );
};

