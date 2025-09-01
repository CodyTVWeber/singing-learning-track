import React from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, gradients } from '../../theme/theme';

interface StepTipsProps {
  title?: string;
  tips: string[];
}

export const StepTips: React.FC<StepTipsProps> = ({ title = "Kooka's Tips", tips }) => {
  if (!Array.isArray(tips) || tips.length === 0) return null;
  return (
    <Card 
      variant="gradient" 
      style={{ background: gradients.warm, marginBottom: spacing.xl }}
    >
      <h3
        style={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.md,
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Icon name="info" size={18} /> {title}
      </h3>
      <ul
        style={{
          margin: 0,
          paddingLeft: spacing.lg,
          color: colors.text,
        }}
      >
        {tips.map((tip, index) => (
          <li
            key={index}
            style={{
              marginBottom: spacing.sm,
              lineHeight: 1.6,
            }}
          >
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default StepTips;
