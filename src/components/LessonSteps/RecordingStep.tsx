import React, { useState } from 'react';
import { RecordingStep as RecordingStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { AudioRecorder } from '../AudioRecorder';
import { AudioPlayer } from '../AudioPlayer';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing } from '../../theme/theme';

interface RecordingStepProps {
  step: RecordingStepType;
  onComplete: (score: number, audioUrl: string) => void;
}

export const RecordingStep: React.FC<RecordingStepProps> = ({ step, onComplete }) => {
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [score, setScore] = useState(0);

  const handleRecordingComplete = (_audioBlob: Blob, audioUrl: string, volumeHistory: number[]) => {
    setRecordedAudioUrl(audioUrl);
    
    // Calculate score based on volume and consistency
    const avgVolume = volumeHistory.reduce((sum, vol) => sum + vol, 0) / volumeHistory.length;
    const variance = volumeHistory.reduce((acc, v) => acc + Math.pow(v - avgVolume, 2), 0) / volumeHistory.length;
    const stability = Math.max(0, 100 - Math.sqrt(variance) * 5);
    const loudnessScore = Math.min(100, (avgVolume / 60) * 100);
    const calculatedScore = Math.floor(0.6 * loudnessScore + 0.4 * stability);
    
    setScore(calculatedScore);
    setIsReviewing(true);
  };

  const handleTryAgain = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setIsReviewing(false);
    setScore(0);
  };

  const handleContinue = () => {
    onComplete(score, recordedAudioUrl || '');
  };

  if (isReviewing && recordedAudioUrl) {
    return (
      <Card variant="elevated" style={{ textAlign: 'center' }}>
        <Icon name="star" size={48} color={score >= 70 ? colors.success : colors.warning} />
        
        <h3 style={{
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginTop: spacing.lg,
          marginBottom: spacing.md
        }}>
          {score >= 70 ? 'Great Recording!' : 'Good Try!'}
        </h3>
        
        <p style={{
          fontSize: fontSize.lg,
          color: colors.primary,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.lg
        }}>
          Score: {score}/100
        </p>

        <div style={{ marginBottom: spacing.xl }}>
          <AudioPlayer 
            src={recordedAudioUrl} 
            variant="simple"
            title="Your Recording"
          />
        </div>

        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
          {score < 70 && (
            <Button onClick={handleTryAgain} variant="outline">
              Try Again
            </Button>
          )}
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <h3 style={{
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md
      }}>
        {step.title}
      </h3>
      
      <p style={{
        fontSize: fontSize.md,
        color: colors.textLight,
        marginBottom: spacing.xl,
        lineHeight: 1.6
      }}>
        {step.instructions}
      </p>

      {step.promptText && (
        <Card variant="glass" style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          <p style={{
            fontSize: fontSize.lg,
            color: colors.text,
            fontWeight: fontWeight.medium,
            marginBottom: spacing.md
          }}>
            Say: "{step.promptText}"
          </p>
          {step.promptAudio && (
            <AudioPlayer 
              src={step.promptAudio} 
              variant="simple"
              title="Listen to example"
            />
          )}
        </Card>
      )}

      <AudioRecorder
        maxDuration={step.maxDuration}
        onRecordingComplete={handleRecordingComplete}
      />
    </Card>
  );
};