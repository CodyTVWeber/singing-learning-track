import React, { useState, useRef, useCallback, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme/theme';
import { Button } from './Button';
import { Progress } from './Progress';
import { Icon } from './Icon';
import { detectPitchAutocorrelation, type PitchAnalysisResult } from '../services/pitch';

interface AudioRecorderProps {
  maxDuration?: number; // in seconds
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string, volumeData: number[]) => void;
  onVolumeChange?: (volume: number) => void;
  onPitchChange?: (result: PitchAnalysisResult) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  maxDuration = 10,
  onRecordingComplete,
  onVolumeChange,
  onPitchChange,
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
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Initialize audio context and analyser
  const initializeAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } as MediaTrackConstraints,
      });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;

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
    if (!analyserRef.current || !isRecording || isPaused) {
      // If paused, do not schedule next animation frame to avoid busy loop
      return;
    }

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);

    // Calculate average volume (0-100)
    // Compute RMS for better volume estimate
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const centered = (dataArray[i] - 128) / 128; // -1..1
      sumSquares += centered * centered;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    const normalizedVolume = Math.min(100, Math.max(0, rms * 140));

    setCurrentVolume(normalizedVolume);
    setVolumeHistory(prev => [...prev, normalizedVolume]);
    onVolumeChange?.(normalizedVolume);

    // Pitch analysis (if requested)
    if (onPitchChange && audioContextRef.current) {
      const floatBuffer = new Float32Array(analyser.fftSize);
      if ((analyser as any).getFloatTimeDomainData) {
        (analyser as any).getFloatTimeDomainData(floatBuffer);
      } else {
        // Fallback: convert bytes to float [-1,1]
        for (let i = 0; i < dataArray.length; i++) {
          floatBuffer[i] = (dataArray[i] - 128) / 128;
        }
      }
      const sampleRate = audioContextRef.current.sampleRate;
      const result = detectPitchAutocorrelation(floatBuffer, sampleRate);
      onPitchChange(result);
    }

    // Draw waveform (time-domain samples)
    const canvas = waveformCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = currentVolume > 70 ? colors.error : currentVolume > 40 ? colors.warning : colors.primary;
        ctx.beginPath();

        const sliceWidth = width / dataArray.length;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128; // -1..1
          const y = height / 2 + v * (height / 2 - 4);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      }
    }

    animationFrameRef.current = requestAnimationFrame(analyzeVolume);
  }, [isRecording, isPaused, onVolumeChange]);

  // Start recording
  const startRecording = useCallback(async () => {
    setError(null);
    const initialized = await initializeAudioContext();
    if (!initialized || !streamRef.current) return;

    try {
      chunksRef.current = [];
      setVolumeHistory([]);
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete?.(audioBlob, url, volumeHistory);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      recordingStartTimeRef.current = Date.now();

      // Start volume analysis
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
      analyzeVolume();

      // Timer for recording duration
      timerRef.current = window.setInterval(() => {
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
      // Resume analysis loop
      if (isRecording) {
        animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
        analyzeVolume();
      }
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      // Cancel animation while paused
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isPaused, isRecording, analyzeVolume]);

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
    if (!Number.isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00';
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
                  backgroundColor: colors.background,
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
                <canvas
                  ref={waveformCanvasRef}
                  width={480}
                  height={64}
                  style={{ width: '100%', height: '64px' }}
                />
                <Icon 
                  name="play" 
                  size={32} 
                  color={isPaused ? colors.textLight : colors.primary}
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
              <Progress value={(recordingTime / maxDuration) * 100} showValue={false} />
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
                <Icon name="play" size={20} style={{ marginRight: spacing.sm }} />
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
            <Icon name="play" size={60} color={colors.primary} />
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
              <Icon name="skipPrevious" size={20} style={{ marginRight: spacing.sm }} />
              Record Again
            </Button>
          </div>
        </div>
      )}

      {/* animations removed for simplicity */}
    </div>
  );
};
