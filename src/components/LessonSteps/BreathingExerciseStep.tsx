import React, { useState, useEffect, useRef } from 'react';
import { BreathingExerciseStep as BreathingExerciseStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, borderRadius, transitions } from '../../theme/theme';

interface BreathingExerciseStepProps {
  step: BreathingExerciseStepType;
  onComplete: (score: number) => void;
}

export const BreathingExerciseStep: React.FC<BreathingExerciseStepProps> = ({ step, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest' | 'complete'>('inhale');
  const [currentRep, setCurrentRep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const { pattern } = step;
  const totalCycleDuration = pattern.inhale + (pattern.hold || 0) + pattern.exhale + (pattern.rest || 0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && currentPhase !== 'complete') {
      let duration = 0;
      switch (currentPhase) {
        case 'inhale':
          duration = pattern.inhale;
          break;
        case 'hold':
          duration = pattern.hold || 0;
          break;
        case 'exhale':
          duration = pattern.exhale;
          break;
        case 'rest':
          duration = pattern.rest || 0;
          break;
      }

      setTimeRemaining(duration);

      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0.1) {
            advancePhase();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isActive, currentPhase, currentRep]);

  const advancePhase = () => {
    switch (currentPhase) {
      case 'inhale':
        if (pattern.hold && pattern.hold > 0) {
          setCurrentPhase('hold');
        } else {
          setCurrentPhase('exhale');
        }
        break;
      case 'hold':
        setCurrentPhase('exhale');
        break;
      case 'exhale':
        if (pattern.rest && pattern.rest > 0) {
          setCurrentPhase('rest');
        } else {
          completeRep();
        }
        break;
      case 'rest':
        completeRep();
        break;
    }
  };

  const completeRep = () => {
    const nextRep = currentRep + 1;
    if (nextRep >= step.repetitions) {
      setCurrentPhase('complete');
      setIsActive(false);
      // Give full score for completing the exercise
      setTimeout(() => onComplete(100), 1000);
    } else {
      setCurrentRep(nextRep);
      setCurrentPhase('inhale');
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCurrentRep(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return colors.success;
      case 'hold':
        return colors.warning;
      case 'exhale':
        return colors.info;
      case 'rest':
        return colors.textLight;
      default:
        return colors.primary;
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
      case 'complete':
        return 'Complete!';
      default:
        return '';
    }
  };

  const circleScale = isActive ? (
    currentPhase === 'inhale' ? 1.4 :
    currentPhase === 'hold' ? 1.4 :
    currentPhase === 'exhale' ? 1 :
    1
  ) : 1;

  if (currentPhase === 'complete') {
    return (
      <Card variant="elevated" style={{ textAlign: 'center' }}>
        <Icon name="star" size={48} color={colors.success} />
        
        <h3 style={{
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginTop: spacing.lg,
          marginBottom: spacing.md
        }}>
          Excellent Breathing!
        </h3>
        
        <p style={{
          fontSize: fontSize.md,
          color: colors.textLight,
          marginBottom: spacing.lg
        }}>
          You completed {step.repetitions} breathing cycles
        </p>

        <Button onClick={() => onComplete(100)}>
          Continue
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <h3 style={{
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center'
      }}>
        {step.title}
      </h3>
      
      <p style={{
        fontSize: fontSize.md,
        color: colors.textLight,
        marginBottom: spacing.xl,
        lineHeight: 1.6,
        textAlign: 'center'
      }}>
        {step.instructions}
      </p>

      {/* Breathing visualization */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: spacing.xl
      }}>
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          marginBottom: spacing.lg
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: borderRadius.round,
            backgroundColor: colors.surface,
            border: `3px solid ${getPhaseColor()}`,
            transform: `scale(${circleScale})`,
            transition: `transform ${currentPhase === 'inhale' ? pattern.inhale : currentPhase === 'exhale' ? pattern.exhale : 0.3}s ease-in-out`,
          }} />
          
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              color: getPhaseColor(),
              marginBottom: spacing.sm
            }}>
              {getPhaseInstruction()}
            </div>
            {isActive && timeRemaining > 0 && (
              <div style={{
                fontSize: fontSize.lg,
                color: colors.text
              }}>
                {Math.ceil(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {isActive && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: fontSize.md,
              color: colors.text,
              marginBottom: spacing.sm
            }}>
              Cycle {currentRep + 1} of {step.repetitions}
            </p>
            <div style={{
              display: 'flex',
              gap: spacing.xs,
              justifyContent: 'center'
            }}>
              {Array.from({ length: step.repetitions }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: borderRadius.round,
                    backgroundColor: index <= currentRep ? colors.primary : colors.border
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pattern info */}
      <Card variant="glass" style={{ marginBottom: spacing.xl }}>
        <p style={{
          fontSize: fontSize.sm,
          color: colors.textLight,
          textAlign: 'center',
          margin: 0
        }}>
          Pattern: Inhale {pattern.inhale}s
          {pattern.hold && ` → Hold ${pattern.hold}s`}
          {` → Exhale ${pattern.exhale}s`}
          {pattern.rest && ` → Rest ${pattern.rest}s`}
        </p>
      </Card>

      <div style={{ textAlign: 'center' }}>
        {!isActive ? (
          <Button onClick={startExercise} size="large" icon={<Icon name="play" />}>
            Start Exercise
          </Button>
        ) : (
          <Button onClick={stopExercise} variant="outline" size="large">
            Stop
          </Button>
        )}
      </div>
    </Card>
  );
};