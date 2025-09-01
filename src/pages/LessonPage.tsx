import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonById } from '../data/units';
import type { LessonContent, EchoLessonContent, LessonStep } from '../models/lesson';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { EchoLesson } from '../components/EchoLesson';
import { StepText } from '../components/lessonSteps/StepText';
import { StepAudio } from '../components/lessonSteps/StepAudio';
import { StepTips } from '../components/lessonSteps/StepTips';
import { StepPitchPractice } from '../components/lessonSteps/StepPitchPractice';
import { StepEcho } from '../components/lessonSteps/StepEcho';
import { StepRecording } from '../components/lessonSteps/StepRecording';
import { StepClapBeat } from '../components/lessonSteps/StepClapBeat';
import { Icon, IconButton } from '../components/Icon';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, transitions } from '../theme/theme';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  
  const lesson = lessonId ? getLessonById(lessonId) : null;
  const isEchoLesson = lesson?.type === 'echo';
  const legacyContent = useMemo(() => {
    if (!lesson || !lesson.content) return null;
    try {
      return JSON.parse(lesson.content);
    } catch {
      return null;
    }
  }, [lesson]);

  const typedSteps: LessonStep[] | null = useMemo(() => {
    if (!lesson) return null;
    if (Array.isArray((lesson as any).steps) && (lesson as any).steps.length > 0) {
      return (lesson as any).steps as LessonStep[];
    }
    if (!isEchoLesson && legacyContent && Array.isArray((legacyContent as any).steps)) {
      const lc = legacyContent as LessonContent;
      const steps: LessonStep[] = [];
      for (const s of lc.steps) {
        steps.push({ type: 'text', content: String(s) } as any);
      }
      if ((legacyContent as any).audio) {
        steps.push({ type: 'audio', audioId: (legacyContent as any).audio } as any);
      }
      return steps;
    }
    return null;
  }, [lesson, legacyContent, isEchoLesson]);

  useEffect(() => {
    if (!lesson || !user) {
      navigate('/skill-tree');
    } else {
      setTimeout(() => setShowContent(true), 100);
    }
  }, [lesson, user, navigate]);

  if (!lesson || !user) return null;

  const handleNext = () => {
    if (typedSteps && currentStep < (typedSteps.length - 1)) {
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

  // Handle legacy Echo Lessons differently when no typed steps are provided
  if (!typedSteps && isEchoLesson && legacyContent) {
    const echoContent = legacyContent as EchoLessonContent;
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

  // Typed or transformed legacy lesson
  const steps: LessonStep[] = typedSteps ?? [];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const current = steps[currentStep] as LessonStep | undefined;
  // const stepIconName = currentStep === 0 ? 'info' : currentStep === 1 ? 'play' : 'star';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
      }}
    >
              <Header 
          title={lesson.title}
          subtitle={totalSteps > 0 ? `Step ${currentStep + 1} of ${totalSteps}` : undefined}
          variant="gradient"
          leftAction={
            <IconButton
              icon="back"
              onClick={() => navigate('/skill-tree')}
              ariaLabel="Back to skill tree"
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
        <div 
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'scale(1)' : 'scale(0.95)',
            transition: transitions.smooth,
            marginBottom: spacing.xl,
          }}
        >
          {current && current.type === 'text' && (
            <StepText title={current.title} content={(current as any).content} />
          )}
          {current && current.type === 'audio' && (
            <StepAudio title={current.title} audioId={(current as any).audioId} description={(current as any).description} />
          )}
          {current && current.type === 'tips' && (
            <StepTips title={current.title} tips={(current as any).tips} />
          )}
          {current && current.type === 'pitchPractice' && (
            <StepPitchPractice title={current.title} audioId={(current as any).audioId} targetHz={(current as any).targetHz} />
          )}
          {current && current.type === 'recording' && (
            <StepRecording title={current.title} promptText={(current as any).promptText} maxDurationSec={(current as any).maxDurationSec} />
          )}
          {current && current.type === 'clapBeat' && (
            <StepClapBeat title={current.title} pattern={(current as any).pattern} />
          )}
          {current && current.type === 'echo' && (
            <StepEcho
              promptText={(current as any).promptText}
              promptAudio={(current as any).promptAudio}
              onComplete={async (score) => {
                await handleEchoComplete(score, '');
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: spacing.md,
            flexWrap: 'wrap',
          }}
        >
          {(!current || current.type !== 'echo') && (
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              size="large"
              icon={<Icon name="back" />}
            >
              Previous
            </Button>
          )}
          
          {(!current || current.type !== 'echo') && (
            <Button
              onClick={handleNext}
              size="large"
              variant="gradient"
              icon={<Icon name={currentStep === totalSteps - 1 ? 'check' : 'forward'} />}
              iconPosition="right"
            >
              {currentStep === totalSteps - 1 ? 'Complete Lesson' : 'Next Step'}
            </Button>
          )}
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