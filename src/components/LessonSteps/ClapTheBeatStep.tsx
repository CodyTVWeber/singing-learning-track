import React, { useState, useEffect, useRef } from 'react';
import { ClapTheBeatStep as ClapTheBeatStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { AudioPlayer } from '../AudioPlayer';
import { colors, fontSize, fontWeight, spacing, borderRadius, transitions } from '../../theme/theme';

interface ClapTheBeatStepProps {
  step: ClapTheBeatStepType;
  onComplete: (score: number) => void;
}

export const ClapTheBeatStep: React.FC<ClapTheBeatStepProps> = ({ step, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [userClaps, setUserClaps] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const beatDuration = 60000 / step.bpm; // milliseconds per beat

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startPattern = () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    setUserClaps([]);
    startTimeRef.current = Date.now();

    let beat = 0;
    intervalRef.current = setInterval(() => {
      beat++;
      if (beat >= step.pattern.length) {
        stopPattern();
      } else {
        setCurrentBeat(beat);
      }
    }, beatDuration);
  };

  const stopPattern = () => {
    setIsPlaying(false);
    setCurrentBeat(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    calculateScore();
  };

  const handleClap = () => {
    if (!isPlaying) return;
    
    const currentTime = Date.now() - startTimeRef.current;
    const expectedBeat = Math.floor(currentTime / beatDuration);
    setUserClaps([...userClaps, expectedBeat]);

    // Visual feedback
    const clapElement = document.getElementById('clap-button');
    if (clapElement) {
      clapElement.style.transform = 'scale(0.9)';
      setTimeout(() => {
        clapElement.style.transform = 'scale(1)';
      }, 100);
    }
  };

  const calculateScore = () => {
    // Compare user claps with expected pattern
    const expectedClaps = step.pattern
      .map((action, index) => action === 'clap' ? index : null)
      .filter(beat => beat !== null) as number[];

    let correctClaps = 0;
    const tolerance = 0.25; // Allow 25% of beat duration as tolerance

    expectedClaps.forEach(expectedBeat => {
      const hasClap = userClaps.some(userBeat => 
        Math.abs(userBeat - expectedBeat) <= tolerance
      );
      if (hasClap) correctClaps++;
    });

    const accuracy = (correctClaps / expectedClaps.length) * 100;
    const extraClaps = Math.max(0, userClaps.length - expectedClaps.length);
    const penalty = extraClaps * 10;
    
    const finalScore = Math.max(0, Math.floor(accuracy - penalty));
    setScore(finalScore);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setScore(0);
    setUserClaps([]);
  };

  const handleContinue = () => {
    onComplete(score);
  };

  if (showResults) {
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
          {score >= 70 ? 'Great Rhythm!' : 'Keep Practicing!'}
        </h3>
        
        <p style={{
          fontSize: fontSize.lg,
          color: colors.primary,
          fontWeight: fontWeight.semibold,
          marginBottom: spacing.lg
        }}>
          Score: {score}/100
        </p>

        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
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

      {step.audioExample && (
        <div style={{ marginBottom: spacing.xl }}>
          <AudioPlayer 
            src={step.audioExample} 
            variant="simple"
            title="Listen to the pattern"
          />
        </div>
      )}

      {/* Pattern visualization */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: spacing.md,
        marginBottom: spacing.xl,
        flexWrap: 'wrap'
      }}>
        {step.pattern.map((action, index) => (
          <div
            key={index}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: borderRadius.round,
              backgroundColor: currentBeat === index ? colors.primary : colors.surface,
              border: `2px solid ${currentBeat === index ? colors.primary : colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: transitions.smooth,
              transform: currentBeat === index ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {action === 'clap' ? (
              <Icon name="star" size={24} color={currentBeat === index ? colors.textOnPrimary : colors.text} />
            ) : (
              <span style={{ 
                fontSize: fontSize.sm, 
                color: currentBeat === index ? colors.textOnPrimary : colors.textLight 
              }}>
                rest
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        {!isPlaying ? (
          <Button onClick={startPattern} size="large" icon={<Icon name="play" />}>
            Start Pattern
          </Button>
        ) : (
          <div>
            <button
              id="clap-button"
              onClick={handleClap}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: borderRadius.round,
                backgroundColor: colors.primary,
                border: 'none',
                color: colors.textOnPrimary,
                fontSize: fontSize.xl,
                fontWeight: fontWeight.bold,
                cursor: 'pointer',
                transition: transitions.smooth,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginBottom: spacing.lg
              }}
            >
              CLAP!
            </button>
            <div>
              <Button onClick={stopPattern} variant="outline">
                Stop
              </Button>
            </div>
          </div>
        )}
      </div>

      <p style={{
        fontSize: fontSize.sm,
        color: colors.textLight,
        textAlign: 'center',
        marginTop: spacing.lg
      }}>
        BPM: {step.bpm} | Pattern: {step.pattern.join(' - ')}
      </p>
    </Card>
  );
};