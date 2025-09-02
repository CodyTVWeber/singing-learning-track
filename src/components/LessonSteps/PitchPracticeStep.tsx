import React, { useState, useEffect, useRef } from 'react';
import { PitchPracticeStep as PitchPracticeStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { AudioPlayer } from '../AudioPlayer';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme/theme';

interface PitchPracticeStepProps {
  step: PitchPracticeStepType;
  onComplete: (score: number) => void;
}

export const PitchPracticeStep: React.FC<PitchPracticeStepProps> = ({ step, onComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentPitch, setCurrentPitch] = useState<number | null>(null);
  const [pitchHistory, setPitchHistory] = useState<number[]>([]);
  const [matchDuration, setMatchDuration] = useState(0);
  const [hasMatched, setHasMatched] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const tolerance = step.tolerance || 50; // cents
  const targetHz = step.targetHz;
  const requiredDuration = 2000; // 2 seconds of matching

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      
      setIsListening(true);
      detectPitch();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const detectPitch = () => {
    if (!analyserRef.current || !isListening) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(dataArray);

    // Simple autocorrelation pitch detection
    const pitch = autoCorrelate(dataArray, audioContextRef.current!.sampleRate);
    
    if (pitch > 0) {
      setCurrentPitch(pitch);
      setPitchHistory(prev => [...prev.slice(-29), pitch]); // Keep last 30 samples
      
      // Check if pitch matches target
      const cents = 1200 * Math.log2(pitch / targetHz);
      if (Math.abs(cents) <= tolerance) {
        setMatchDuration(prev => prev + 50); // Add 50ms
        if (matchDuration >= requiredDuration && !hasMatched) {
          setHasMatched(true);
          handleSuccess();
        }
      } else {
        setMatchDuration(0);
      }
    }

    animationRef.current = requestAnimationFrame(detectPitch);
  };

  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    // Simple autocorrelation algorithm
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;

    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) return -1; // Not enough signal

    // Autocorrelation
    for (let offset = 50; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      correlation = 1 - correlation / MAX_SAMPLES;

      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    }

    if (best_correlation > 0.9) {
      return sampleRate / best_offset;
    }

    return -1;
  };

  const handleSuccess = () => {
    stopListening();
    setTimeout(() => {
      onComplete(100);
    }, 500);
  };

  const getNoteName = () => {
    // Convert Hz to note name
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const A4 = 440;
    const semitones = 12 * Math.log2(targetHz / A4);
    const noteIndex = Math.round(semitones + 69) % 12;
    const octave = Math.floor((Math.round(semitones + 69)) / 12);
    return `${noteNames[noteIndex]}${octave}`;
  };

  const getPitchDifference = () => {
    if (!currentPitch) return null;
    return Math.round(1200 * Math.log2(currentPitch / targetHz));
  };

  const pitchDiff = getPitchDifference();
  const isInTune = pitchDiff !== null && Math.abs(pitchDiff) <= tolerance;

  return (
    <Card variant="elevated">
      <h3 style={{
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
      }}>
        <Icon name="star" size={24} />
        {step.title}
      </h3>
      
      <p style={{
        fontSize: fontSize.md,
        color: colors.textLight,
        marginBottom: spacing.xl,
        lineHeight: 1.6,
      }}>
        {step.instructions}
      </p>

      {/* Target Note Display */}
      <Card variant="glass" style={{ 
        marginBottom: spacing.xl,
        textAlign: 'center',
        background: hasMatched ? colors.successLight : undefined,
      }}>
        <p style={{
          fontSize: fontSize.sm,
          color: colors.textLight,
          marginBottom: spacing.sm,
        }}>
          Target Note
        </p>
        <div style={{
          fontSize: fontSize.huge,
          fontWeight: fontWeight.bold,
          color: hasMatched ? colors.success : colors.primary,
          marginBottom: spacing.sm,
        }}>
          {step.targetNote}
        </div>
        <p style={{
          fontSize: fontSize.sm,
          color: colors.textLight,
        }}>
          {targetHz.toFixed(1)} Hz
        </p>
      </Card>

      {/* Reference Audio */}
      {step.referenceAudio && (
        <div style={{ marginBottom: spacing.xl }}>
          <h4 style={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Listen to the Target Pitch
          </h4>
          <AudioPlayer 
            src={step.referenceAudio} 
            variant="simple"
          />
        </div>
      )}

      {/* Pitch Visualization */}
      {isListening && (
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: fontSize.sm,
              color: colors.textLight,
              marginBottom: spacing.md,
            }}>
              Current Pitch
            </p>
            
            {currentPitch ? (
              <>
                <div style={{
                  fontSize: fontSize.xxl,
                  fontWeight: fontWeight.bold,
                  color: isInTune ? colors.success : colors.text,
                  marginBottom: spacing.sm,
                }}>
                  {currentPitch.toFixed(1)} Hz
                </div>
                
                {/* Pitch Meter */}
                <div style={{
                  position: 'relative',
                  height: '40px',
                  backgroundColor: colors.border,
                  borderRadius: borderRadius.pill,
                  overflow: 'hidden',
                  marginBottom: spacing.md,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                    width: '2px',
                    height: '100%',
                    backgroundColor: colors.primary,
                  }} />
                  
                  {pitchDiff !== null && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: `${50 + (pitchDiff / 100) * 40}%`,
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '100%',
                      backgroundColor: isInTune ? colors.success : colors.warning,
                      borderRadius: borderRadius.pill,
                      transition: 'left 0.1s ease',
                    }} />
                  )}
                </div>
                
                <p style={{
                  fontSize: fontSize.sm,
                  color: isInTune ? colors.success : colors.textLight,
                  fontWeight: isInTune ? fontWeight.semibold : fontWeight.normal,
                }}>
                  {isInTune ? 'Perfect! Hold it steady!' : 
                   pitchDiff > 0 ? 'Too high - sing lower' : 'Too low - sing higher'}
                </p>
                
                {/* Match Progress */}
                {isInTune && (
                  <div style={{
                    marginTop: spacing.md,
                    height: '8px',
                    backgroundColor: colors.border,
                    borderRadius: borderRadius.pill,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(matchDuration / requiredDuration) * 100}%`,
                      height: '100%',
                      backgroundColor: colors.success,
                      transition: 'width 0.1s ease',
                    }} />
                  </div>
                )}
              </>
            ) : (
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
                fontStyle: 'italic',
              }}>
                Sing to see your pitch...
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Success Message */}
      {hasMatched && (
        <Card variant="gradient" style={{ 
          background: colors.successLight,
          textAlign: 'center',
          marginBottom: spacing.xl,
        }}>
          <Icon name="check" size={48} color={colors.success} />
          <h4 style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.success,
            marginTop: spacing.md,
          }}>
            Perfect Pitch Match!
          </h4>
          <p style={{
            fontSize: fontSize.md,
            color: colors.text,
            marginTop: spacing.sm,
          }}>
            You held the {step.targetNote} perfectly!
          </p>
        </Card>
      )}

      {/* Control Button */}
      <div style={{ textAlign: 'center' }}>
        {!isListening && !hasMatched ? (
          <Button onClick={startListening} size="large" icon={<Icon name="star" />}>
            Start Pitch Practice
          </Button>
        ) : isListening && !hasMatched ? (
          <Button onClick={stopListening} variant="outline" size="large">
            Stop Listening
          </Button>
        ) : null}
      </div>
    </Card>
  );
};