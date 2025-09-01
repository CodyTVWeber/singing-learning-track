import React from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing } from '../../theme/theme';

interface StepClapBeatProps {
  title?: string;
  pattern: string;
  description?: string;
}

export const StepClapBeat: React.FC<StepClapBeatProps> = ({ title = 'Clap the Beat', pattern, description }) => {
  return (
    <Card style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
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
        <Icon name="music" size={18} /> {title}
      </h3>
      {description && (
        <p style={{ fontSize: fontSize.md, color: colors.text, marginTop: 0 }}>{description}</p>
      )}
      <div
        style={{
          marginTop: spacing.md,
          padding: spacing.md,
          border: `1px dashed ${colors.textLight}`,
          borderRadius: 12,
          fontSize: fontSize.xl,
          textAlign: 'center',
        }}
      >
        {pattern}
      </div>
    </Card>
  );
};

export default StepClapBeat;
