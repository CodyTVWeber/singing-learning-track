import React, { useState } from 'react';
import { AssessmentStep as AssessmentStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, borderRadius, transitions } from '../../theme/theme';

interface AssessmentStepProps {
  step: AssessmentStepType;
  onComplete: (score: number) => void;
}

export const AssessmentStep: React.FC<AssessmentStepProps> = ({ step, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = step.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === step.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      const correctAnswers = step.questions.reduce((count, question) => {
        return count + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctAnswers / step.questions.length) * 100);
      setShowResults(true);
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (showResults) {
    const correctAnswers = step.questions.reduce((count, question) => {
      return count + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctAnswers / step.questions.length) * 100);

    return (
      <Card variant="elevated" style={{ textAlign: 'center', padding: spacing.xl }}>
        <Icon name="star" size={60} color={score >= 70 ? colors.success : colors.warning} />
        <h2 style={{
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
          color: colors.text,
          marginTop: spacing.lg,
          marginBottom: spacing.md
        }}>
          Assessment Complete!
        </h2>
        <p style={{
          fontSize: fontSize.xl,
          color: colors.primary,
          fontWeight: fontWeight.semibold
        }}>
          Score: {score}%
        </p>
        <p style={{
          fontSize: fontSize.md,
          color: colors.textLight,
          marginTop: spacing.sm
        }}>
          You got {correctAnswers} out of {step.questions.length} correct!
        </p>
      </Card>
    );
  }

  return (
    <div>
      <Card variant="elevated" style={{ marginBottom: spacing.lg }}>
        <div style={{ marginBottom: spacing.xl }}>
          <h3 style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.sm
          }}>
            {step.title}
          </h3>
          <p style={{
            fontSize: fontSize.sm,
            color: colors.textLight
          }}>
            Question {currentQuestionIndex + 1} of {step.questions.length}
          </p>
        </div>

        <div style={{ marginBottom: spacing.xl }}>
          <p style={{
            fontSize: fontSize.lg,
            color: colors.text,
            marginBottom: spacing.lg,
            fontWeight: fontWeight.medium
          }}>
            {currentQuestion.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    textAlign: 'left',
                    fontSize: fontSize.md,
                    color: colors.text,
                    cursor: 'pointer',
                    transition: transitions.smooth,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.round,
                      border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && <Icon name="check" size={14} color={colors.textOnPrimary} />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md }}>
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            icon={<Icon name="back" />}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion.id] === undefined}
            icon={<Icon name={isLastQuestion ? 'check' : 'forward'} />}
            iconPosition="right"
          >
            {isLastQuestion ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};