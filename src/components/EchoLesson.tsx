import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { colors, fontSize, fontWeight, spacing } from '../theme/theme';
import { Button } from './Button';
import { Card } from './Card';
import { Container } from './Container';
import { AudioPlayer } from './AudioPlayer';
import { AudioRecorder } from './AudioRecorder';
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
}) => {
  // const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<LessonStep>('intro');
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [_volumeData, setVolumeData] = useState<number[]>([]);

  useEffect(() => {
    // Track lesson start
    analytics.trackEvent('lesson_started', { lessonType: 'echo' });
  }, []);

  // const handleBackToSkillTree = () => {
  //   navigate('/skill-tree');
  // };

  const handleAudioPlay = () => {
    setHasPlayedAudio(true);
  };

  const handleMyTurn = () => {
    setCurrentStep('record');
    analytics.trackEvent('recording_started');
  };

  const handleRecordingComplete = (_audioBlob: Blob, audioUrl: string, volumeHistory: number[]) => {
    setRecordedAudioUrl(audioUrl);
    setVolumeData(volumeHistory);
    
    // Calculate score based on volume stability and average
    const hasSamples = Array.isArray(volumeHistory) && volumeHistory.length > 0;
    const avgVolume = hasSamples ? volumeHistory.reduce((sum, vol) => sum + vol, 0) / volumeHistory.length : 0;
    const variance = hasSamples ? volumeHistory.reduce((acc, v) => acc + Math.pow(v - avgVolume, 2), 0) / volumeHistory.length : 0;
    const stability = hasSamples ? Math.max(0, 100 - Math.sqrt(variance) * 5) : 0; // 0..100
    const loudnessScore = hasSamples ? Math.min(100, (avgVolume / 60) * 100) : 0;
    const rawScore = hasSamples ? 0.6 * loudnessScore + 0.4 * stability : 0;
    const clampedScore = Math.min(100, Math.max(0, rawScore));
    const finalScore = Math.floor(clampedScore);
    
    setScore(finalScore);
    setCurrentStep('review');
    
    analytics.trackEvent('recording_completed', { averageVolume: avgVolume, samples: volumeHistory.length });
  };

  const handleTryAgain = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setScore(0);
    setVolumeData([]);
    setCurrentStep('record');
  };

  const handleContinue = () => {
    analytics.trackEvent('lesson_completed', { 
      score, 
      passed: score >= 70 
    });
    
    if (score > 0) {
      analytics.trackEvent('points_earned', { points: 10 + Math.floor(score * 0.9) });
    }
    
    onComplete(score, recordedAudioUrl || '');
  };

  const renderIntroScreen = () => (
    <Card style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '60px',
          marginBottom: spacing.lg,
        }}
      >
        <Icon name="play" size={60} color={colors.primary} />
      </div>
      
      <h2
        style={{
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginBottom: spacing.lg,
        }}
      >
        Echo Challenge
      </h2>
      
      <p
        style={{
          fontSize: fontSize.lg,
          color: colors.text,
          marginBottom: spacing.xl,
          lineHeight: 1.6,
        }}
      >
        Listen carefully to the sound, then repeat it back
      </p>

      <Button onClick={() => setCurrentStep('listen')} size="large">
        Let's Start!
      </Button>
    </Card>
  );

  const renderListenScreen = () => (
    <Card style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '60px',
          marginBottom: spacing.lg,
        }}
      >
        <Icon name="play" size={60} color={colors.primary} />
      </div>
      
      <h2
        style={{
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginBottom: spacing.lg,
        }}
      >
        Listen Carefully
      </h2>
      
      <p
        style={{
          fontSize: fontSize.xl,
          color: colors.text,
          marginBottom: spacing.lg,
          fontWeight: fontWeight.semibold,
        }}
      >
        {promptText}
      </p>

      <div style={{ marginBottom: spacing.lg }}>
        <AudioPlayer 
          src={promptAudio} 
          variant="simple"
          onPlay={handleAudioPlay}
        />
      </div>

      {!hasPlayedAudio && (
        <p
          style={{
            fontSize: fontSize.sm,
            color: colors.textLight,
            marginBottom: spacing.lg,
          }}
        >
          Press play to hear the sound first
        </p>
      )}

      <Button 
        onClick={handleMyTurn} 
        size="large"
        disabled={!hasPlayedAudio}
        style={{
          opacity: hasPlayedAudio ? 1 : 0.5,
        }}
      >
        My Turn!
      </Button>
    </Card>
  );

  const renderRecordScreen = () => (
    <Card style={{ textAlign: 'center' }}>
      <h2
        style={{
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginBottom: spacing.lg,
        }}
      >
        Your Turn!
      </h2>
      
      <p
        style={{
          fontSize: fontSize.lg,
          color: colors.text,
          marginBottom: spacing.xl,
        }}
      >
        Repeat: "{promptText}"
      </p>

      <AudioRecorder
        maxDuration={10}
        onRecordingComplete={handleRecordingComplete}
      />
    </Card>
  );

  const renderReviewScreen = () => {
    const passed = score >= 70;
    const reviewIcon = passed ? 'star' : 'info';
    
    return (
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '60px',
            marginBottom: spacing.lg,
          }}
        >
          <Icon name={reviewIcon} size={60} color={passed ? colors.success : colors.warning} />
        </div>
        
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.lg,
          }}
        >
          {passed ? 'Great Job!' : 'Keep Practicing!'}
        </h2>
        
        <div
          style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.primary,
            marginBottom: spacing.lg,
          }}
        >
          Score: {score}/100 points
        </div>

        {recordedAudioUrl && (
          <div style={{ marginBottom: spacing.lg }}>
            <AudioPlayer 
              src={recordedAudioUrl} 
              variant="simple"
              title="Your Recording"
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
          {!passed && (
            <Button
              onClick={handleTryAgain}
              variant="outline"
              size="large"
            >
              Try Again
            </Button>
          )}
          <Button onClick={handleContinue} size="large">
            {passed ? 'Continue' : 'Next Lesson'}
          </Button>
        </div>
      </Card>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntroScreen();
      case 'listen':
        return renderListenScreen();
      case 'record':
        return renderRecordScreen();
      case 'review':
        return renderReviewScreen();
      default:
        return renderIntroScreen();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
        }}
      >
        <Container maxWidth="600px" style={{ width: '100%' }}>
          {renderCurrentStep()}
        </Container>
      </div>
    </div>
  );

  // function getProgressPercentage(): number {
  //   const stepMap = { intro: 0, listen: 25, record: 50, review: 100 };
  //   return stepMap[currentStep] || 0;
  // }
};
