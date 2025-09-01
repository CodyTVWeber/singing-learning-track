import React from 'react';
import { Card } from '../Card';
import { colors, fontSize, spacing, transitions } from '../../theme/theme';

interface StepTextProps {
  title?: string;
  content: string;
}

export const StepText: React.FC<StepTextProps> = ({ title, content }) => {
  return (
    <Card 
      variant="elevated" 
      decorative 
      style={{ transition: transitions.smooth, marginBottom: spacing.xl }}
    >
      {title && (
        <h2
          style={{
            fontSize: fontSize.xxl,
            color: colors.text,
            marginTop: 0,
            marginBottom: spacing.md,
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          fontSize: fontSize.lg,
          color: colors.text,
          lineHeight: 1.8,
          marginBottom: spacing.sm,
        }}
      >
        {content}
      </div>
    </Card>
  );
};

export default StepText;
