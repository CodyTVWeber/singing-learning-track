import React from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { PitchPractice } from '../PitchPractice';
import { colors, fontSize, fontWeight, spacing } from '../../theme/theme';

interface StepPitchPracticeProps {
  title?: string;
  audioId?: string;
  targetHz?: number;
}

export const StepPitchPractice: React.FC<StepPitchPracticeProps> = ({ title = 'Pitch Practice', audioId, targetHz }) => {
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
        <Icon name="star" size={18} /> {title}
      </h3>
      <PitchPractice audioId={audioId} targetHz={targetHz} />
    </Card>
  );
};

export default StepPitchPractice;
