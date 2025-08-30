import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/theme';
import { Button } from './Button';
import { Card } from './Card';
import { AudioPlayer } from './AudioPlayer';
import { AudioRecorder } from './AudioRecorder';
import { Progress } from './Progress';
import { Icon } from './Icon';
import { analytics } from '../services/analytics';

interface EchoLessonProps {
  promptAudio: string;
  promptText: string;
  onComplete: (score: number, audioUrl: string) => void;
  minVolumeThreshold?: number;
  targetDuration?: number;
}

type LessonStep = 'intro' | 'listen' | 'record' | 'review';

export const EchoLesson: React.FC<EchoLessonProps> = ({
  promptAudio,
  promptText,
  onComplete,
  minVolumeThreshold = 40,
  targetDuration = 5,
}) => {
  const [currentStep, setCurrentStep] = useState<LessonStep>('intro');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [volumeData, setVolumeData] = useState<number[]>([]);
  const [hasListened, setHasListened] = useState(false);

  useEffect(() => {
    analytics.trackEvent('lesson_started', { 
      lessonType: 'echo',
      promptText 
    });
  }, [promptText]);

  const handleProceedToListen = () => {
    setCurrentStep('listen');
  };

  const handleProceedToRecord = () => {
    if (hasListened) {
      setCurrentStep('record');
      analytics.trackEvent('recording_started', { 
        lessonType: 'echo',
        promptText 
      });
    }
  };

  const handleRecordingComplete = (audioBlob: Blob, audioUrl: string, volumes: number[]) => {
    setRecordedAudioUrl(audioUrl);
    setVolumeData(volumes);
    setCurrentStep('review');
    
    const avgVolume = volumes.length > 0 
      ? volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length 
      : 0;
    
    analytics.trackEvent('recording_completed', { 
      lessonType: 'echo',
      promptText,
      recordingDuration: volumes.length * 0.1, // Approximate duration
      averageVolume: Math.round(avgVolume)
    });
  };

  const calculateScore = () => {
    if (volumeData.length === 0) return 0;
    
    // Calculate average volume
    const avgVolume = volumeData.reduce((sum, vol) => sum + vol, 0) / volumeData.length;
    
    // Score based on volume threshold
    let score = 0;
    if (avgVolume >= minVolumeThreshold) {
      score = 50; // Base score for good volume
    }
    
    // Bonus points for consistent volume
    const volumeVariance = Math.sqrt(
      volumeData.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumeData.length
    );
    if (volumeVariance < 20) {
      score += 30; // Bonus for consistent volume
    }
    
    // Bonus for completing the recording
    score += 20;
    
    return Math.min(100, score);
  };

  const handleComplete = () => {
    const score = calculateScore();
    
    analytics.trackEvent('lesson_completed', { 
      lessonType: 'echo',
      promptText,
      score,
      passed: score >= 70
    });
    
    if (score > 0) {
      analytics.trackEvent('points_earned', { 
        lessonType: 'echo',
        points: score
      });
    }
    
    onComplete(score, recordedAudioUrl || '');
  };

  const handleRetry = () => {
    setCurrentStep('record');
    setRecordedAudioUrl(null);
    setVolumeData([]);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '80px', marginBottom: spacing.lg }}>🎤</div>
            <h2 style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              marginBottom: spacing.md,
              color: colors.primary,
            }}>
              Echo Time!
            </h2>
            <p style={{
              fontSize: fontSize.lg,
              color: colors.text,
              marginBottom: spacing.xl,
              lineHeight: 1.6,
            }}>
              Listen carefully to the sound, then repeat it back. 
              Try to match the volume and rhythm!
            </p>
            <Button onClick={handleProceedToListen} size="large" fullWidth>
              Let's Start!
            </Button>
          </Card>
        );

      case 'listen':
        return (
          <Card style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '80px', marginBottom: spacing.lg }}>👂</div>
            <h2 style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              marginBottom: spacing.md,
              color: colors.primary,
            }}>
              Listen Carefully
            </h2>
            <p style={{
              fontSize: fontSize.xl,
              color: colors.text,
              marginBottom: spacing.xl,
              fontStyle: 'italic',
            }}>
              "{promptText}"
            </p>
            <AudioPlayer
              src={promptAudio}
              variant="simple"
              style={{ marginBottom: spacing.xl }}
            />
            <div
              style={{
                backgroundColor: colors.info + '20',
                color: colors.info,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginBottom: spacing.xl,
                fontSize: fontSize.sm,
              }}
              onAnimationEnd={() => setHasListened(true)}
            >
              <Icon name="info" size={16} style={{ marginRight: spacing.xs }} />
              Press play to hear the sound, then click "My Turn!" when ready
            </div>
            <Button 
              onClick={handleProceedToRecord} 
              size="large" 
              fullWidth
              disabled={!hasListened}
            >
              My Turn!
            </Button>
          </Card>
        );

      case 'record':
        return (
          <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              marginBottom: spacing.md,
              color: colors.primary,
              textAlign: 'center',
            }}>
              Your Turn!
            </h2>
            <p style={{
              fontSize: fontSize.lg,
              color: colors.text,
              marginBottom: spacing.xl,
              textAlign: 'center',
            }}>
              Repeat: "{promptText}"
            </p>
            <AudioRecorder
              maxDuration={10}
              onRecordingComplete={handleRecordingComplete}
            />
          </Card>
        );

      case 'review':
        const score = calculateScore();
        const isPassing = score >= 70;
        
        return (
          <Card style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ 
              fontSize: '80px', 
              marginBottom: spacing.lg,
              animation: 'bounce 0.5s ease-out',
            }}>
              {isPassing ? '🌟' : '💪'}
            </div>
            <h2 style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              marginBottom: spacing.md,
              color: isPassing ? colors.success : colors.warning,
            }}>
              {isPassing ? 'Great Job!' : 'Good Try!'}
            </h2>
            
            <div style={{
              fontSize: fontSize.xxxl,
              fontWeight: fontWeight.bold,
              color: colors.primary,
              marginBottom: spacing.lg,
            }}>
              {score} points
            </div>

            <div style={{ marginBottom: spacing.xl }}>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
                marginBottom: spacing.md,
              }}>
                Listen to your recording:
              </p>
              {recordedAudioUrl && (
                <AudioPlayer
                  src={recordedAudioUrl}
                  variant="simple"
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
              {!isPassing && (
                <Button onClick={handleRetry} variant="outline" size="large">
                  Try Again
                </Button>
              )}
              <Button onClick={handleComplete} size="large">
                {isPassing ? 'Continue' : 'Next Lesson'}
              </Button>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    }}>
      {renderContent()}
      <style>
        {`
          @keyframes bounce {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};