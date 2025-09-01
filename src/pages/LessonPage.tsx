import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonById } from '../data/units';
import type { LessonContent, EchoLessonContent } from '../models/lesson';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { EchoLesson } from '../components/EchoLesson';
import { ReferenceAudio } from '../components/ReferenceAudio';
import { PitchPractice } from '../components/PitchPractice';
import { Icon, IconButton } from '../components/Icon';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, transitions, borderRadius } from '../theme/theme';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress, logout } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  
  const lesson = lessonId ? getLessonById(lessonId) : null;
  const content = lesson ? JSON.parse(lesson.content) : null;
  const isEchoLesson = lesson?.type === 'echo';

  useEffect(() => {
    if (!lesson || !user) {
      navigate('/skill-tree');
    } else {
      setTimeout(() => setShowContent(true), 100);
    }
  }, [lesson, user, navigate]);

  if (!lesson || !content || !user) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < regularContent.steps.length - 1) {
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowContent(true);
      }, 200);
    } else if (!isCompleted) {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setShowContent(true);
      }, 200);
    }
  };

  const handleComplete = async (score: number = 100) => {
    setCompletionScore(score);
    setIsCompleted(true);
    
    await updateProgress({
      userId: user.id,
      lessonId: lesson.id,
      completed: true,
      score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0,
      completedDate: new Date(),
    });
  };

  const handleEchoComplete = async (score: number, _audioUrl: string) => {
    // Award 10 base points plus performance score
    const raw = 10 + score * 0.9;
    const totalScore = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.floor(raw))) : 0;
    await handleComplete(totalScore);
  };

  const handleBackToSkillTree = () => {
    navigate('/skill-tree');
  };

  if (isCompleted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: gradients.soft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confetti-like background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: '30px',
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={i % 2 === 0 ? 'play' : 'star'} />
            </div>
          ))}
        </div>

        <Container maxWidth="500px" style={{ position: 'relative', zIndex: 1 }}>
          <Card variant="glass" decorative style={{ textAlign: 'center', padding: spacing.xxl }}>
            <img
              src="/img/kooka-burra-dancing.png"
              alt="Kooka celebrating"
              style={{
                width: '220px',
                margin: '0 auto',
                marginBottom: spacing.xl,
                filter: `drop-shadow(${shadows.xl})`,
                transform: 'scale(1)',
                transition: 'transform 0.4s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            />
            
            <h1
              style={{
                fontSize: fontSize.huge,
                fontWeight: fontWeight.extrabold,
                background: gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: spacing.md,
                letterSpacing: '-0.02em',
              }}
            >
              Spectacular!
            </h1>
            
            <p
              style={{
                fontSize: fontSize.xl,
                color: colors.text,
                marginBottom: spacing.sm,
                fontWeight: fontWeight.medium,
              }}
            >
              You mastered "{lesson.title}"
            </p>
            
            <p
              style={{
                fontSize: fontSize.md,
                color: colors.textLight,
                marginBottom: spacing.xl,
              }}
            >
              Your voice is getting stronger with every lesson!
            </p>
            
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.lg,
                marginBottom: spacing.xl,
              }}
            >
              <Card
                variant="gradient"
                style={{
                  padding: spacing.lg,
                  minWidth: '120px',
                  background: gradients.secondary,
                }}
              >
                <div style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.xs }}>
                  Score
                </div>
                <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                  {completionScore}%
                </div>
              </Card>
              
              <Card
                variant="gradient"
                style={{
                  padding: spacing.lg,
                  minWidth: '120px',
                  background: gradients.forest,
                }}
              >
                <div style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.xs }}>
                  Points
                </div>
                <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                  +{isEchoLesson ? Math.floor(completionScore) : ((lesson as any).points ?? 10)}
                </div>
              </Card>
            </div>
            
            <Button 
              onClick={handleBackToSkillTree} 
              size="large" 
              fullWidth
              variant="gradient"
              icon={<Icon name="forward" />}
              iconPosition="right"
            >
              Keep Learning
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  // Handle Echo Lessons differently
  if (isEchoLesson && content) {
    const echoContent = content as EchoLessonContent;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: gradients.soft,
        }}
      >
        <Header 
          title={lesson.title}
          subtitle="Echo Lesson"
          variant="gradient"
          leftAction={
            <IconButton
              icon="back"
              onClick={() => navigate('/skill-tree')}
              ariaLabel="Back to skill tree"
            />
          }
          rightAction={
            <IconButton
              icon="logout"
              onClick={async () => { await logout(); navigate('/'); }}
              ariaLabel="Log out"
            />
          }
        />
        <Container style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
          <EchoLesson
            promptAudio={echoContent.promptAudio}
            promptText={echoContent.promptText}
            onComplete={handleEchoComplete}
          />
        </Container>
      </div>
    );
  }

  // Regular lesson
  const regularContent = content as LessonContent;
  const currentStepContent = (regularContent as any).steps[currentStep] as any;
  const progress = ((currentStep + 1) / regularContent.steps.length) * 100;

  const isStringStep = typeof currentStepContent === 'string';
  const stepTitle = isStringStep
    ? `Step ${currentStep + 1}`
    : (currentStepContent?.title || `Step ${currentStep + 1}`);
  const stepBody: React.ReactNode = isStringStep
    ? (currentStepContent as string)
    : (currentStepContent?.content || '');
  const stepAudioUrl: string | undefined = !isStringStep ? currentStepContent?.audioUrl : undefined;
  const stepPracticeType: string | undefined = !isStringStep ? currentStepContent?.practiceType : undefined;
  const stepTips: string[] | undefined = !isStringStep ? currentStepContent?.tips : undefined;
  const stepIconName = currentStep === 0 ? 'info' : currentStep === 1 ? 'play' : 'star';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
      }}
    >
              <Header 
          title={lesson.title}
          subtitle={`Step ${currentStep + 1} of ${regularContent.steps.length}`}
          variant="gradient"
          leftAction={
            <IconButton
              icon="back"
              onClick={() => navigate('/skill-tree')}
              ariaLabel="Back to skill tree"
            />
          }
          rightAction={
            <IconButton
              icon="logout"
              onClick={async () => { await logout(); navigate('/'); }}
              ariaLabel="Log out"
            />
          }
        />

      <Container style={{ paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: spacing.xl }}>
          <Progress 
            value={progress} 
            max={100} 
            size="medium"
            color="primary"
            animated
            label={`Lesson Progress`}
            showValue
          />
        </div>

        {/* Step Content */}
        <Card 
          variant="elevated" 
          decorative
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'scale(1)' : 'scale(0.95)',
            transition: transitions.smooth,
            marginBottom: spacing.xl,
          }}
        >
                    {/* Step Title with Icon and Kooka */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              marginBottom: spacing.xl,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                minWidth: '50px',
                minHeight: '50px',
                borderRadius: borderRadius.round,
                background: gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadows.md,
                flexShrink: 0,
              }}
            >
              <Icon name={stepIconName} size={24} color={colors.textOnPrimary} />
            </div>
            <h2
              style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.text,
                margin: 0,
                flex: 1,
              }}
            >
              {stepTitle}
            </h2>
            <img
              src="/img/kooka-burra-calling-out.png"
              alt="Kooka guiding you"
              style={{
                width: '60px',
                transform: 'scale(1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2) rotate(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            />
          </div>

          {/* Step Content */}
          <div
            style={{
              fontSize: fontSize.lg,
              color: colors.text,
              lineHeight: 1.8,
              marginBottom: spacing.xl,
            }}
          >
            {stepBody}
          </div>

          {/* Additional Components */}
          {stepAudioUrl && (
            <div style={{ marginBottom: spacing.xl }}>
              <Card variant="glass" style={{ padding: spacing.lg }}>
                <h3
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: fontWeight.semibold,
                    marginBottom: spacing.md,
                    color: colors.text,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
                    <Icon name="play" size={18} />
                    Listen and Learn
                  </span>
                </h3>
                <ReferenceAudio audioId={stepAudioUrl} />
              </Card>
            </div>
          )}

          {stepPracticeType === 'pitch' && (
            <div style={{ marginBottom: spacing.xl }}>
              <Card variant="glass" style={{ padding: spacing.lg }}>
                <h3
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: fontWeight.semibold,
                    marginBottom: spacing.md,
                    color: colors.text,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
                    <Icon name="star" size={18} />
                    Pitch Practice
                  </span>
                </h3>
                <PitchPractice
                  audioId={(!isStringStep && currentStepContent?.audioId) || undefined}
                  targetHz={(!isStringStep && currentStepContent?.targetHz) || undefined}
                />
              </Card>
            </div>
          )}

          {/* Tips Section */}
          {Array.isArray(stepTips) && stepTips.length > 0 && (
            <Card 
              variant="gradient" 
              style={{ 
                background: gradients.warm,
                marginBottom: spacing.xl,
              }}
            >
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: fontWeight.semibold,
                  marginBottom: spacing.md,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                }}
              >
                <Icon name="info" size={18} /> Kooka's Tips
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.lg,
                  color: colors.text,
                }}
              >
                {stepTips.map((tip, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: spacing.sm,
                      lineHeight: 1.6,
                    }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            size="large"
            icon={<Icon name="back" />}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            size="large"
            variant="gradient"
            icon={<Icon name={currentStep === regularContent.steps.length - 1 ? 'check' : 'forward'} />}
            iconPosition="right"
          >
            {currentStep === regularContent.steps.length - 1 ? 'Complete Lesson' : 'Next Step'}
          </Button>
        </div>

        {/* Motivational Kooka */}
        <div
          style={{
            textAlign: 'center',
            marginTop: spacing.xxl,
            opacity: 0.8,
          }}
        >
          <img
            src="/img/kooka-burra-breathing.png"
            alt="Kooka encouraging you"
                          style={{
                width: '140px',
                marginBottom: spacing.lg,
                filter: `drop-shadow(${shadows.md})`,
                transform: 'scale(1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <p
            style={{
              fontSize: fontSize.md,
              color: colors.textLight,
              fontStyle: 'italic',
            }}
          >
            "You're doing great! Keep going!" - Kooka
          </p>
        </div>
      </Container>
    </div>
  );
};