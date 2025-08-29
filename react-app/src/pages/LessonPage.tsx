import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonById } from '../data/units';
import type { LessonContent } from '../models/lesson';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing } from '../theme/theme';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const lesson = lessonId ? getLessonById(lessonId) : null;
  const content: LessonContent | null = lesson ? JSON.parse(lesson.content) : null;

  useEffect(() => {
    if (!lesson || !user) {
      navigate('/skill-tree');
    }
  }, [lesson, user, navigate]);

  if (!lesson || !content || !user) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < content.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isCompleted) {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleted(true);
    const score = 100; // Base score for completing a lesson
    
    await updateProgress({
      userId: user.id,
      lessonId: lesson.id,
      completed: true,
      score,
      completedDate: new Date(),
    });
  };

  const handleBackToSkillTree = () => {
    navigate('/skill-tree');
  };

  if (isCompleted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
        }}
      >
        <Container maxWidth="500px">
          <Card style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '80px',
                marginBottom: spacing.lg,
                animation: 'bounce 0.5s ease-out',
              }}
            >
              🎉
            </div>
            <h1
              style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.success,
                marginBottom: spacing.md,
              }}
            >
              Fantastic Job!
            </h1>
            <p
              style={{
                fontSize: fontSize.lg,
                color: colors.textLight,
                marginBottom: spacing.lg,
              }}
            >
              You completed "{lesson.title}"
            </p>
            <div
              style={{
                fontSize: fontSize.xl,
                fontWeight: fontWeight.semibold,
                color: colors.primary,
                marginBottom: spacing.xl,
              }}
            >
              +100 points!
            </div>
            <Button onClick={handleBackToSkillTree} size="large" fullWidth>
              Back to Lessons
            </Button>
          </Card>
          <style>
            {`
              @keyframes bounce {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
              }
            `}
          </style>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
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
          onClick={handleBackToSkillTree}
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
          {lesson.title}
        </h1>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '8px',
          backgroundColor: colors.featherLight,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            backgroundColor: colors.secondary,
            width: `${((currentStep + 1) / content.steps.length) * 100}%`,
            transition: 'width 300ms ease-out',
          }}
        />
      </div>

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
          <Card>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/img/kooka-burra-singing.png"
                alt="Kooka singing"
                style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto',
                  marginBottom: spacing.xl,
                }}
              />
              
              <h2
                style={{
                  fontSize: fontSize.xxl,
                  fontWeight: fontWeight.bold,
                  color: colors.darkBrown,
                  marginBottom: spacing.lg,
                }}
              >
                Step {currentStep + 1} of {content.steps.length}
              </h2>
              
              <p
                style={{
                  fontSize: fontSize.xl,
                  color: colors.text,
                  marginBottom: spacing.xl,
                  lineHeight: 1.6,
                }}
              >
                {content.steps[currentStep]}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="large"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  size="large"
                  style={{ minWidth: '120px' }}
                >
                  {currentStep < content.steps.length - 1 ? 'Next' : 'Complete'}
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};