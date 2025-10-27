import React, { useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/theme';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';
import { sharedToneGenerator } from '../services/tone';

interface BirdSoundsProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BirdSounds: React.FC<BirdSoundsProps> = ({ className = '', style }) => {
  const [isPlayingBaby, setIsPlayingBaby] = useState(false);
  const [isPlayingPapa, setIsPlayingPapa] = useState(false);

  const handlePlayBabyBird = async () => {
    setIsPlayingBaby(true);
    try {
      // Play baby bird tweet tweet sounds (high pitch)
      await sharedToneGenerator.playSequence([
        { frequency: 800.0, durationMs: 300, gapMs: 100 },
        { frequency: 900.0, durationMs: 300, gapMs: 200 },
        { frequency: 800.0, durationMs: 300, gapMs: 100 },
        { frequency: 900.0, durationMs: 300, gapMs: 0 },
      ], 0.15);
    } finally {
      setIsPlayingBaby(false);
    }
  };

  const handlePlayPapaBird = async () => {
    setIsPlayingPapa(true);
    try {
      // Play papa bird tweet tweet sounds (lower pitch)
      await sharedToneGenerator.playSequence([
        { frequency: 400.0, durationMs: 400, gapMs: 150 },
        { frequency: 450.0, durationMs: 400, gapMs: 250 },
        { frequency: 400.0, durationMs: 400, gapMs: 150 },
        { frequency: 450.0, durationMs: 400, gapMs: 0 },
      ], 0.18);
    } finally {
      setIsPlayingPapa(false);
    }
  };

  const handleStop = () => {
    sharedToneGenerator.stop();
    setIsPlayingBaby(false);
    setIsPlayingPapa(false);
  };

  return (
    <div className={className} style={{ ...style }}>
      <Card variant="glass" style={{ padding: spacing.lg }}>
        <h3
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            marginBottom: spacing.md,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
            <Icon name="play" size={18} />
            Listen to the Birds
          </span>
        </h3>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: spacing.md,
          alignItems: 'center'
        }}>
          {/* Baby Bird */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.md,
            padding: spacing.md,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            width: '100%',
            maxWidth: '300px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: borderRadius.round,
              background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon name="star" size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: fontSize.md, 
                fontWeight: fontWeight.medium,
                color: colors.text,
                marginBottom: spacing.xs
              }}>
                Baby Bird
              </div>
              <div style={{ 
                fontSize: fontSize.sm, 
                color: colors.textLight 
              }}>
                High-pitched tweet tweet
              </div>
            </div>
            <Button
              onClick={isPlayingBaby ? handleStop : handlePlayBabyBird}
              size="medium"
              variant={isPlayingBaby ? "outline" : "gradient"}
              icon={<Icon name={isPlayingBaby ? "stop" : "play"} />}
              disabled={isPlayingPapa}
            >
              {isPlayingBaby ? "Stop" : "Listen"}
            </Button>
          </div>

          {/* Papa Bird */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.md,
            padding: spacing.md,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            width: '100%',
            maxWidth: '300px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: borderRadius.round,
              background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon name="star" size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: fontSize.md, 
                fontWeight: fontWeight.medium,
                color: colors.text,
                marginBottom: spacing.xs
              }}>
                Papa Bird
              </div>
              <div style={{ 
                fontSize: fontSize.sm, 
                color: colors.textLight 
              }}>
                Lower-pitched tweet tweet
              </div>
            </div>
            <Button
              onClick={isPlayingPapa ? handleStop : handlePlayPapaBird}
              size="medium"
              variant={isPlayingPapa ? "outline" : "gradient"}
              icon={<Icon name={isPlayingPapa ? "stop" : "play"} />}
              disabled={isPlayingBaby}
            >
              {isPlayingPapa ? "Stop" : "Listen"}
            </Button>
          </div>

          {/* Instructions */}
          <div style={{
            textAlign: 'center',
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius.md,
            fontSize: fontSize.sm,
            color: colors.textLight,
            fontStyle: 'italic'
          }}>
            Listen to each bird sound, then try to copy it with your voice!
          </div>
        </div>
      </Card>
    </div>
  );
};