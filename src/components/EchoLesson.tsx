import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from './Button';
import { Card } from './Card';
import { Container } from './Container';
import { AudioRecorder } from './AudioRecorder';
import { AudioPlayer } from './AudioPlayer';
import { Icon } from './Icon';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme/theme';
import { analytics } from '../services/analytics';

interface EchoLessonProps {
  promptAudio: string;
  promptText: string;
  minVolumeThreshold: number;
  targetDuration: number;
  onComplete: (score: number, audioUrl: string) => void;
}

type LessonScreen = 'intro' | 'listen' | 'record' | 'review';

export const EchoLesson: React.FC<EchoLessonProps> = ({
  promptAudio,
  promptText,
  minVolumeThreshold,
  targetDuration,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [currentScreen, setCurrentScreen] = useState<LessonScreen>('intro');
  const [hasHeardAudio, setHasHeardAudio] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Track lesson start
    if (user) {
      analytics.trackLessonStarted('echo-introduction', 'echo');
    }
  }, [user]);

  const handleIntroStart = () => {
    setCurrentScreen('listen');
  };

  const handleListenComplete = () => {
    setCurrentScreen('record');
  };

  const handleRecordingComplete = (audioBlob: Blob, audioUrl: string, volumeData: number[]) => {
    setRecordedAudioUrl(audioUrl);
    setVolumeHistory(volumeData);
    
    // Calculate score based on volume and duration
    const averageVolume = volumeData.reduce((sum, vol) => sum + vol, 0) / volumeData.length;
    const duration = volumeData.length * 0.1; // Assuming 100ms intervals
    
    let calculatedScore = 0;
    
    // Volume score (0-60 points)
    if (averageVolume >= minVolumeThreshold) {
      calculatedScore += Math.min(60, (averageVolume / 100) * 60);
    }
    
    // Duration score (0-40 points)
    const durationDiff = Math.abs(duration - targetDuration);
    if (durationDiff <= 0.5) {
      calculatedScore += 40; // Perfect duration
    } else if (durationDiff <= 1.0) {
      calculatedScore += 30; // Close duration
    } else if (durationDiff <= 2.0) {
      calculatedScore += 20; // Acceptable duration
    } else {
      calculatedScore += Math.max(0, 20 - (durationDiff - 2.0) * 5); // Penalty for being too far off
    }
    
    const finalScore = Math.round(Math.max(0, Math.min(100, calculatedScore)));
    setScore(finalScore);
    
    // Track recording completion
    analytics.trackRecordingCompleted('echo-introduction', averageVolume, duration);
    
    setCurrentScreen('review');
  };

  const handleTryAgain = () => {
    setCurrentScreen('record');
    setRecordedAudioUrl(null);
    setScore(0);
    setVolumeHistory([]);
  };

  const handleContinue = () => {
    // Track lesson completion
    analytics.trackLessonCompleted('echo-introduction', score, score >= 70);
    
    if (score > 0) {
      analytics.trackPointsEarned(score, 'echo-introduction');
    }
    
    onComplete(score, recordedAudioUrl || '');
  };

  const handleBackToLessons = () => {
    navigate('/skill-tree');
  };

  const renderIntroScreen = () => (
    <Container maxWidth="600px">
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '80px',
            marginBottom: spacing.xl,
          }}
        >
          🎤
        </div>
        
        <h1
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.primary,
            marginBottom: spacing.lg,
          }}
        >
          Echo with Kooka
        </h1>
        
        <p
          style={{
            fontSize: fontSize.lg,
            color: colors.text,
            marginBottom: spacing.xl,
            lineHeight: 1.6,
          }}
        >
          Listen carefully to the sound, then repeat it back!
        </p>
        
        <Button onClick={handleIntroStart} size="large">
          Let's Start!
        </Button>
      </Card>
    </Container>
  );

  const renderListenScreen = () => (
    <Container maxWidth="600px">
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '80px',
            marginBottom: spacing.lg,
          }}
        >
          👂
        </div>
        
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.primary,
            marginBottom: spacing.lg,
          }}
        >
          Listen Carefully
        </h2>
        
        <p
          style={{
            fontSize: fontSize.xl,
            color: colors.text,
            marginBottom: spacing.xl,
            fontWeight: fontWeight.semibold,
          }}
        >
          {promptText}
        </p>
        
        <div style={{ marginBottom: spacing.xl }}>
          <AudioPlayer
            src={promptAudio}
            onPlay={() => setIsPlaying(true)}
            onEnded={() => {
              setIsPlaying(false);
              setHasHeardAudio(true);
            }}
            onPause={() => setIsPlaying(false)}
          />
        </div>
        
        <p
          style={{
            fontSize: fontSize.sm,
            color: colors.textLight,
            marginBottom: spacing.lg,
          }}
        >
          Press play to hear the sound
        </p>
        
        <Button
          onClick={handleListenComplete}
          size="large"
          disabled={!hasHeardAudio}
        >
          My Turn!
        </Button>
      </Card>
    </Container>
  );

  const renderRecordScreen = () => (
    <Container maxWidth="600px">
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '80px',
            marginBottom: spacing.lg,
          }}
        >
          🎤
        </div>
        
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.primary,
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
            fontWeight: fontWeight.semibold,
          }}
        >
          Repeat: "{promptText}"
        </p>
        
        <AudioRecorder
          maxDuration={10}
          onRecordingComplete={handleRecordingComplete}
          onVolumeChange={(volume) => {
            // Track recording start when first volume reading comes in
            if (volume > 0 && volumeHistory.length === 0) {
              analytics.trackRecordingStarted('echo-introduction');
            }
          }}
        />
      </Card>
    </Container>
  );

  const renderReviewScreen = () => (
    <Container maxWidth="600px">
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '80px',
            marginBottom: spacing.lg,
          }}
        >
          {score >= 70 ? '🌟' : '💪'}
        </div>
        
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: score >= 70 ? colors.success : colors.warning,
            marginBottom: spacing.lg,
          }}
        >
          {score >= 70 ? 'Great Job!' : 'Keep Practicing!'}
        </h2>
        
        <div
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.primary,
            marginBottom: spacing.xl,
          }}
        >
          Score: {score}/100
        </div>
        
        {recordedAudioUrl && (
          <div style={{ marginBottom: spacing.xl }}>
            <p style={{ marginBottom: spacing.md, color: colors.textLight }}>
              Your recording:
            </p>
            <AudioPlayer
              src={recordedAudioUrl}
              onPlay={() => setIsPlaying(true)}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
          {score < 70 && (
            <Button onClick={handleTryAgain} variant="outline" size="large">
              Try Again
            </Button>
          )}
          <Button onClick={handleContinue} size="large">
            {score >= 70 ? 'Next Lesson' : 'Continue'}
          </Button>
        </div>
      </Card>
    </Container>
  );

  const renderHeader = () => (
    <div
      style={{
        backgroundColor: colors.primary,
        color: 'white',
        padding: spacing.lg,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      <button
        onClick={handleBackToLessons}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: fontSize.xl,
          cursor: 'pointer',
          padding: spacing.sm,
        }}
      >
        ←
      </button>
      <h1
        style={{
          fontSize: fontSize.xl,
          fontWeight: fontWeight.semibold,
          flex: 1,
        }}
      >
        🔊 Echo with Kooka
      </h1>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderHeader()}
      
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
        }}
      >
        {currentScreen === 'intro' && renderIntroScreen()}
        {currentScreen === 'listen' && renderListenScreen()}
        {currentScreen === 'record' && renderRecordScreen()}
        {currentScreen === 'review' && renderReviewScreen()}
      </div>
    </div>
  );
};