import React, { useState } from 'react';
import { Card } from '../Card';
import { AudioRecorder } from '../AudioRecorder';
import { AudioPlayer } from '../AudioPlayer';
import { Button } from '../Button';
import { colors, fontSize, fontWeight, spacing } from '../../theme/theme';

interface StepRecordingProps {
  title?: string;
  promptText: string;
  maxDurationSec?: number;
  onRecorded?: (audioUrl: string) => void;
}

export const StepRecording: React.FC<StepRecordingProps> = ({ title = 'Record Yourself', promptText, maxDurationSec = 10, onRecorded }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleRecordingComplete = (_blob: Blob, url: string) => {
    setAudioUrl(url);
  };

  return (
    <Card style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
      <h3
        style={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.md,
          color: colors.text,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: fontSize.md, color: colors.text, marginTop: 0, marginBottom: spacing.lg }}>
        {promptText}
      </p>
      <AudioRecorder maxDuration={maxDurationSec} onRecordingComplete={handleRecordingComplete} />
      {audioUrl && (
        <div style={{ marginTop: spacing.lg }}>
          <AudioPlayer src={audioUrl} variant="simple" title="Your Recording" />
          <div style={{ marginTop: spacing.md }}>
            <Button onClick={() => onRecorded && onRecorded(audioUrl)} size="large">
              Continue
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StepRecording;
