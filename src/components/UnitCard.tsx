import React from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { Progress } from './Progress';
import { spacing, colors, borderRadius, shadows, gradients, transitions } from '../theme/theme';

interface UnitCardProps {
  unitNumber: number;
  title: string;
  description: string;
  imageSrc: string;
  progressDone: number;
  progressTotal: number;
  isExpanded?: boolean;
  isComplete?: boolean;
  onToggle?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unitNumber,
  title,
  description,
  imageSrc,
  progressDone,
  progressTotal,
  isExpanded = false,
  isComplete = false,
  onToggle,
}) => {
  return (
    <Card
      variant={isComplete ? 'gradient' : 'elevated'}
      decorative
      onClick={onToggle}
      style={{
        marginBottom: spacing.lg,
        cursor: 'pointer',
        transition: transitions.smooth,
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacing.md,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                minWidth: '80px',
                minHeight: '80px',
                borderRadius: borderRadius.round,
                background: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadows.lg,
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={imageSrc}
                alt={`Kooka for Unit ${unitNumber}`}
                style={{
                  width: '70px',
                  objectFit: 'cover',
                  borderRadius: borderRadius.lg,
                }}
              />
              {isComplete && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: gradients.forest,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: shadows.md,
                  }}
                >
                  <Icon name="star" size={14} color={colors.textOnPrimary} />
                </div>
              )}
            </div>
            <div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}
              >
                Unit {unitNumber}: {title}
              </h3>
              <p style={{ fontSize: 16, color: colors.textLight, margin: 0 }}>{description}</p>
            </div>
          </div>

          <div style={{ marginTop: spacing.md, maxWidth: '400px' }}>
            <Progress
              value={progressDone}
              max={progressTotal}
              label={`${progressDone} of ${progressTotal} lessons completed`}
              showValue
              color={isComplete ? 'success' : 'primary'}
              size="small"
            />
          </div>
        </div>

        <Icon name={isExpanded ? 'up' : 'down'} size={32} color={colors.textLight} />
      </div>
    </Card>
  );
};

export default UnitCard;

