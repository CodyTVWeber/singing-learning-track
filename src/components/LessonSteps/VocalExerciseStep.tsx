import React, { useState } from 'react';
import { VocalExerciseStep as VocalExerciseStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { AudioPlayer } from '../AudioPlayer';
import { AudioRecorder } from '../AudioRecorder';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme/theme';

interface VocalExerciseStepProps {
  step: VocalExerciseStepType;
  onComplete: (score: number) => void;
}

export const VocalExerciseStep: React.FC<VocalExerciseStepProps> = ({ step, onComplete }) => {
  const [hasListened, setHasListened] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const handleAudioPlay = () => {
    setHasListened(true);
  };

  const handleRecordingComplete = (_audioBlob: Blob, audioUrl: string) => {
    setRecordedAudioUrl(audioUrl);
    setHasRecorded(true);
  };

  const handleComplete = () => {
    // Give full score for completing the exercise
    onComplete(100);
  };

  const getExerciseIcon = () => {
    switch (step.exerciseType) {
      case 'scales':
        return '🎵';
      case 'arpeggios':
        return '🎶';
      case 'vowels':
        return '🗣️';
      case 'consonants':
        return '💬';
      case 'dynamics':
        return '🔊';
      default:
        return '🎤';
    }
  };

  const getExerciseDescription = () => {
    switch (step.exerciseType) {
      case 'scales':
        return 'Practice singing up and down the scale';
      case 'arpeggios':
        return 'Sing the notes of a chord one by one';
      case 'vowels':
        return 'Focus on clear, open vowel sounds';
      case 'consonants':
        return 'Practice crisp, clear consonants';
      case 'dynamics':
        return 'Practice changing volume smoothly';
      default:
        return 'Follow the exercise guide';
    }
  };

  return (
    <Card variant="elevated">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
      }}>
        <div style={{
          fontSize: '48px',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primaryLight,
          borderRadius: borderRadius.round,
        }}>
          {getExerciseIcon()}
        </div>
        <div>
          <h3 style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {step.title}
          </h3>
          <p style={{
            fontSize: fontSize.sm,
            color: colors.textLight,
            textTransform: 'capitalize',
          }}>
            {step.exerciseType} Exercise
          </p>
        </div>
      </div>
      
      <p style={{
        fontSize: fontSize.md,
        color: colors.text,
        marginBottom: spacing.lg,
        lineHeight: 1.6,
      }}>
        {step.instructions}
      </p>

      <Card variant="glass" style={{ marginBottom: spacing.lg }}>
        <p style={{
          fontSize: fontSize.sm,
          color: colors.textLight,
          marginBottom: spacing.md,
          fontStyle: 'italic',
        }}>
          {getExerciseDescription()}
        </p>
      </Card>

      {/* Audio Guide */}
      <div style={{ marginBottom: spacing.xl }}>
        <h4 style={{
          fontSize: fontSize.md,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          marginBottom: spacing.md,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}>
          <Icon name="play" size={18} />
          Listen to the Exercise
        </h4>
        <AudioPlayer 
          src={step.audioGuide} 
          variant="simple"
          onPlay={handleAudioPlay}
        />
      </div>

      {/* Visual Guide */}
      {step.visualGuide && (
        <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          <img
            src={step.visualGuide}
            alt="Exercise visual guide"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: borderRadius.md,
            }}
          />
        </div>
      )}

      {/* Recording Section */}
      {hasListened && (
        <div style={{ marginBottom: spacing.xl }}>
          <h4 style={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            <Icon name="star" size={18} />
            Now Your Turn!
          </h4>
          
          {!hasRecorded ? (
            <AudioRecorder
              maxDuration={30}
              onRecordingComplete={handleRecordingComplete}
            />
          ) : (
            <div>
              <AudioPlayer 
                src={recordedAudioUrl!} 
                variant="simple"
                title="Your Recording"
              />
              <div style={{ marginTop: spacing.md, textAlign: 'center' }}>
                <Button onClick={() => {
                  setHasRecorded(false);
                  setRecordedAudioUrl(null);
                }} variant="outline" size="small">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Button */}
      {hasRecorded && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={handleComplete} size="large" variant="gradient">
            Complete Exercise
          </Button>
        </div>
      )}

      {/* Instructions */}
      {!hasListened && (
        <p style={{
          fontSize: fontSize.sm,
          color: colors.warning,
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          Listen to the exercise guide first before practicing
        </p>
      )}
    </Card>
  );
};