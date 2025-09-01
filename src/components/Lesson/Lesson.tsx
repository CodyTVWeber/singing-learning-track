import React, { useState } from 'react';
import { Lesson as LessonType, LessonStepProgress } from '../../models/skillAssessment';
import { LessonStepRenderer } from '../LessonSteps';
import { Card } from '../Card';
import { Container } from '../Container';
import { Button } from '../Button';
import { Progress } from '../Progress';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../../theme/theme';

interface LessonProps {
  lesson: LessonType;
  onComplete: (stepProgress: LessonStepProgress[]) => void;
  onExit: () => void;
}

export const Lesson: React.FC<LessonProps> = ({ lesson, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState<LessonStepProgress[]>(
    lesson.steps.map(step => ({
      stepId: step.id,
      completed: false,
      attempts: 0,
    }))
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.steps.length) * 100;
  const totalScore = stepProgress.reduce((sum, sp) => sum + (sp.score || 0), 0) / stepProgress.length;

  const handleStepComplete = (score: number, data?: any) => {
    const newProgress = [...stepProgress];
    const currentProgress = newProgress[currentStepIndex];
    
    currentProgress.completed = true;
    currentProgress.score = score;
    currentProgress.attempts += 1;
    currentProgress.completedAt = new Date();
    
    if (!currentProgress.bestScore || score > currentProgress.bestScore) {
      currentProgress.bestScore = score;
    }

    setStepProgress(newProgress);

    // Move to next step or complete lesson
    if (currentStepIndex < lesson.steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, 1500);
    } else {
      setIsCompleted(true);
      onComplete(newProgress);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < lesson.steps.length - 1 && stepProgress[currentStepIndex].completed) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepNavigation = (index: number) => {
    // Allow navigation to completed steps or the next uncompleted step
    const canNavigate = index <= currentStepIndex || 
      (index === currentStepIndex + 1 && stepProgress[currentStepIndex].completed);
    
    if (canNavigate) {
      setCurrentStepIndex(index);
    }
  };

  if (isCompleted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: gradients.soft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
      }}>
        <Container maxWidth="600px">
          <Card variant="glass" decorative style={{ textAlign: 'center', padding: spacing.xxl }}>
            <img
              src="/img/kooka-burra-dancing.png"
              alt="Kooka celebrating"
              style={{
                width: '180px',
                margin: '0 auto',
                marginBottom: spacing.xl,
                filter: `drop-shadow(${shadows.xl})`,
              }}
            />
            
            <h1 style={{
              fontSize: fontSize.huge,
              fontWeight: fontWeight.extrabold,
              background: gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: spacing.md,
            }}>
              Lesson Complete!
            </h1>
            
            <p style={{
              fontSize: fontSize.xl,
              color: colors.text,
              marginBottom: spacing.lg,
              fontWeight: fontWeight.medium,
            }}>
              {lesson.title}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}>
              <Card variant="gradient" style={{
                padding: spacing.lg,
                minWidth: '120px',
                background: gradients.secondary,
              }}>
                <div style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.xs }}>
                  Average Score
                </div>
                <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                  {Math.round(totalScore)}%
                </div>
              </Card>
              
              <Card variant="gradient" style={{
                padding: spacing.lg,
                minWidth: '120px',
                background: gradients.forest,
              }}>
                <div style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.xs }}>
                  Steps Completed
                </div>
                <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                  {lesson.steps.length}/{lesson.steps.length}
                </div>
              </Card>
            </div>
            
            <Button 
              onClick={onExit} 
              size="large" 
              fullWidth
              variant="gradient"
              icon={<Icon name="forward" />}
              iconPosition="right"
            >
              Continue to Next Lesson
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.soft,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    }}>
      <Container maxWidth="800px">
        {/* Lesson Header */}
        <Card variant="glass" style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div>
              <h2 style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                {lesson.title}
              </h2>
              <p style={{
                fontSize: fontSize.md,
                color: colors.textLight,
              }}>
                {lesson.description}
              </p>
            </div>
            <Button onClick={onExit} variant="outline" icon={<Icon name="back" />}>
              Exit Lesson
            </Button>
          </div>
        </Card>

        {/* Progress Bar */}
        <div style={{ marginBottom: spacing.xl }}>
          <Progress 
            value={progress} 
            max={100} 
            size="medium"
            color="primary"
            animated
            label={`Step ${currentStepIndex + 1} of ${lesson.steps.length}`}
            showValue
          />
        </div>

        {/* Step Navigation */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          overflowX: 'auto',
          padding: `${spacing.xs} 0`,
        }}>
          {lesson.steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = stepProgress[index].completed;
            const isAccessible = index <= currentStepIndex || 
              (index === currentStepIndex + 1 && stepProgress[currentStepIndex].completed);

            return (
              <button
                key={step.id}
                onClick={() => handleStepNavigation(index)}
                disabled={!isAccessible}
                style={{
                  minWidth: '40px',
                  height: '40px',
                  borderRadius: borderRadius.round,
                  border: `2px solid ${isActive ? colors.primary : colors.border}`,
                  backgroundColor: isActive ? colors.primary : isCompleted ? colors.success : colors.surface,
                  color: isActive || isCompleted ? colors.textOnPrimary : colors.text,
                  fontSize: fontSize.sm,
                  fontWeight: isActive ? fontWeight.bold : fontWeight.medium,
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  opacity: isAccessible ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isCompleted ? <Icon name="check" size={16} /> : index + 1}
              </button>
            );
          })}
        </div>

        {/* Current Step */}
        <div style={{ marginBottom: spacing.xl }}>
          <LessonStepRenderer 
            step={currentStep} 
            onComplete={handleStepComplete}
          />
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}>
          <Button
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            variant="outline"
            icon={<Icon name="back" />}
          >
            Previous
          </Button>
          
          {stepProgress[currentStepIndex].completed && currentStepIndex < lesson.steps.length - 1 && (
            <Button
              onClick={handleNextStep}
              variant="gradient"
              icon={<Icon name="forward" />}
              iconPosition="right"
            >
              Next Step
            </Button>
          )}
        </div>

        {/* Objectives Card */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <Card variant="glass" style={{ marginTop: spacing.xxl }}>
            <h3 style={{
              fontSize: fontSize.lg,
              fontWeight: fontWeight.semibold,
              color: colors.text,
              marginBottom: spacing.md,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
            }}>
              <Icon name="info" size={18} /> Learning Objectives
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: spacing.lg,
              color: colors.textLight,
            }}>
              {lesson.objectives.map((objective, index) => (
                <li key={index} style={{
                  marginBottom: spacing.sm,
                  lineHeight: 1.6,
                }}>
                  {objective}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Container>
    </div>
  );
};