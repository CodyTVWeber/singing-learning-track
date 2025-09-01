import React from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { ReferenceAudio } from '../ReferenceAudio';
import { colors, fontSize, fontWeight, spacing } from '../../theme/theme';

interface StepAudioProps {
  title?: string;
  audioId: string;
  description?: string;
}

export const StepAudio: React.FC<StepAudioProps> = ({ title = 'Listen and Learn', audioId, description }) => {
  return (
    <Card variant="glass" style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
      <h3
        style={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.md,
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
        }}
      >
        <Icon name="play" size={18} /> {title}
      </h3>
      {description && (
        <p style={{ fontSize: fontSize.md, color: colors.text, marginTop: 0, marginBottom: spacing.md }}>{description}</p>
      )}
      <ReferenceAudio audioId={audioId} />
    </Card>
  );
};

export default StepAudio;
