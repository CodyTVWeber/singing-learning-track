import React, { useMemo, useRef, useState } from 'react';
import { colors, spacing, borderRadius } from '../theme/theme';
import { AudioPlayer } from './AudioPlayer';
import { resolveAudioId } from '../services/audioMap';
import { sharedToneGenerator } from '../services/tone';
import { Button } from './Button';

interface ReferenceAudioProps {
  audioId?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export const ReferenceAudio: React.FC<ReferenceAudioProps> = ({ audioId, className = '', style }) => {
  const resolved = useMemo(() => resolveAudioId(audioId ?? undefined), [audioId]);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRef = useRef<() => void>(() => {});

  const handlePlayTone = async () => {
    if (!resolved) return;
    setIsPlaying(true);
    try {
      if (resolved.type === 'sequence') {
        await sharedToneGenerator.playSequence(resolved.sequence, resolved.volume);
      } else if (resolved.type === 'glide') {
        await sharedToneGenerator.playGlide(resolved.fromHz, resolved.toHz, resolved.durationMs, resolved.volume);
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    sharedToneGenerator.stop();
    setIsPlaying(false);
  };
  stopRef.current = handleStop;

  if (!resolved) return null;

  if (resolved.type === 'file') {
    return (
      <div className={className} style={{ ...style }}>
        <AudioPlayer src={resolved.src} variant="simple" />
      </div>
    );
  }

  return (
    <div className={className} style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, ...style }}>
      <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
        {!isPlaying ? (
          <Button onClick={handlePlayTone} size="large">Play Tone</Button>
        ) : (
          <Button onClick={handleStop} size="large" variant="outline">Stop</Button>
        )}
      </div>
    </div>
  );
};

