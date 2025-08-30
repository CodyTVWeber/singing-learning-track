import React, { useState, useRef, useCallback, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, transitions } from '../theme/theme';
import { Button } from './Button';
import { Progress } from './Progress';
import { Icon } from './Icon';

interface AudioRecorderProps {
  maxDuration?: number; // in seconds
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string, volumeData: number[]) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  maxDuration = 10,
  onRecordingComplete,
  onVolumeChange,
  className = '',
  style,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context and analyser
  const initializeAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      return true;
    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
      console.error('Error accessing microphone:', err);
      return false;
    }
  }, []);

  // Analyze volume
  const analyzeVolume = useCallback(() => {
    if (!analyserRef.current || !isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume (0-100)
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedVolume = Math.min(100, (average / 255) * 200);

    setCurrentVolume(normalizedVolume);
    setVolumeHistory(prev => [...prev, normalizedVolume]);
    onVolumeChange?.(normalizedVolume);

    animationFrameRef.current = requestAnimationFrame(analyzeVolume);
  }, [isRecording, onVolumeChange]);

  // Start recording
  const startRecording = useCallback(async () => {
    setError(null);
    const initialized = await initializeAudioContext();
    if (!initialized || !streamRef.current) return;

    try {
      chunksRef.current = [];
      setVolumeHistory([]);
      
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete?.(audioBlob, url, volumeHistory);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      recordingStartTimeRef.current = Date.now();

      // Start volume analysis
      analyzeVolume();

      // Timer for recording duration
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
        setRecordingTime(elapsed);
        
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 100);

    } catch (err) {
      setError('Failed to start recording');
      console.error('Error starting recording:', err);
    }
  }, [analyzeVolume, initializeAudioContext, maxDuration, onRecordingComplete, volumeHistory]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  // Toggle recording pause
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // Play recorded audio
  const playAudio = useCallback(() => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  // Reset recorder
  const resetRecorder = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    setCurrentVolume(0);
    setVolumeHistory([]);
    setError(null);
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopRecording, audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        boxShadow: shadows.md,
        ...style,
      }}
    >
      {error && (
        <div
          style={{
            backgroundColor: colors.error + '20',
            color: colors.error,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            marginBottom: spacing.lg,
            fontSize: fontSize.sm,
          }}
        >
          {error}
        </div>
      )}

      {/* Recording Interface */}
      {!audioUrl ? (
        <div style={{ textAlign: 'center' }}>
          {/* Volume Meter */}
          {isRecording && (
            <div style={{ marginBottom: spacing.xl }}>
              <div
                style={{
                  height: '80px',
                  backgroundColor: colors.backgroundLight,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${currentVolume}%`,
                    backgroundColor: currentVolume > 70 ? colors.error : currentVolume > 40 ? colors.warning : colors.success,
                    transition: 'width 100ms ease-out',
                    opacity: 0.3,
                  }}
                />
                <Icon 
                  name="mic" 
                  size={32} 
                  color={isPaused ? colors.textLight : colors.primary}
                  style={{ animation: !isPaused ? 'pulse 2s infinite' : 'none' }}
                />
              </div>
              <p style={{ marginTop: spacing.sm, fontSize: fontSize.sm, color: colors.textLight }}>
                {currentVolume > 70 ? 'Great volume!' : currentVolume > 40 ? 'Good!' : 'Speak louder'}
              </p>
            </div>
          )}

          {/* Recording Time */}
          {isRecording && (
            <div style={{ marginBottom: spacing.lg }}>
              <Progress value={(recordingTime / maxDuration) * 100} showLabel={false} />
              <p style={{ marginTop: spacing.sm, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </p>
            </div>
          )}

          {/* Recording Controls */}
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="large"
                style={{
                  backgroundColor: colors.error,
                  minWidth: '160px',
                }}
              >
                <Icon name="mic" size={20} style={{ marginRight: spacing.sm }} />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={togglePause}
                  variant="outline"
                  size="large"
                >
                  <Icon name={isPaused ? 'play' : 'pause'} size={20} />
                </Button>
                <Button
                  onClick={stopRecording}
                  size="large"
                  style={{ backgroundColor: colors.error }}
                >
                  <Icon name="stop" size={20} style={{ marginRight: spacing.sm }} />
                  Stop Recording
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Playback Interface */
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '60px',
              marginBottom: spacing.lg,
            }}
          >
            🎤
          </div>
          
          <h3
            style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.semibold,
              marginBottom: spacing.lg,
              color: colors.primary,
            }}
          >
            Recording Complete!
          </h3>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={playAudio}
              variant="outline"
              size="large"
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size={20} style={{ marginRight: spacing.sm }} />
              {isPlaying ? 'Pause' : 'Play Recording'}
            </Button>
            <Button
              onClick={resetRecorder}
              size="large"
            >
              <Icon name="refresh" size={20} style={{ marginRight: spacing.sm }} />
              Record Again
            </Button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};
