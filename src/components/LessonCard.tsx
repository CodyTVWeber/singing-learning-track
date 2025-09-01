import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { spacing, fontSize, fontWeight, borderRadius, gradients, colors, shadows } from '../theme/theme';

type LessonStatus = 'locked' | 'unlocked' | 'completed';

interface LessonCardProps {
  title: string;
  description: string;
  status: LessonStatus;
  durationMinutes: number;
  points: number;
  onClick?: () => void;
  onStart?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  status,
  durationMinutes,
  points,
  onClick,
  onStart,
}) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <Card
      variant={isCompleted ? 'gradient' : isLocked ? 'default' : 'elevated'}
      onClick={onClick}
      style={{
        opacity: isLocked ? 0.85 : 1,
        backgroundColor: isLocked ? colors.gray100 : undefined,
        border: isLocked ? `2px solid ${colors.gray300}` : undefined,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            minWidth: '50px',
            minHeight: '50px',
            borderRadius: borderRadius.round,
            background: isCompleted ? gradients.forest : isLocked ? colors.gray200 : gradients.sunset,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.md,
            boxShadow: isLocked ? 'none' : shadows.md,
            border: isLocked ? `2px solid ${colors.gray300}` : 'none',
            flexShrink: 0,
          }}
        >
          {isLocked ? (
            <Icon name="error" size={24} color={colors.gray600} />
          ) : isCompleted ? (
            <Icon name="check" size={24} color={colors.text} />
          ) : (
            <Icon name="play" size={24} color={colors.textOnPrimary} />
          )}
        </div>

        <h4
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          {title}
        </h4>

        <p
          style={{
            fontSize: fontSize.sm,
            color: colors.textLight,
            marginBottom: spacing.md,
            minHeight: '40px',
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing.sm,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <Chip label={`${durationMinutes} min`} size="small" variant="outlined" icon={<Icon name="schedule" size={14} />} />
            <Chip label={`${points} pts`} size="small" variant="outlined" color="secondary" icon={<Icon name="star" size={14} />} />
          </div>

          {!isLocked && (
            <Button size="small" variant={isCompleted ? 'outline' : 'primary'} style={{ minWidth: '80px' }} onClick={(e) => {
              e.stopPropagation();
              onStart?.();
            }}>
              {isCompleted ? 'Review' : 'Start'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LessonCard;

