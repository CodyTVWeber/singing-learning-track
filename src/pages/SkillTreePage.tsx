import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllUnits, isLessonUnlocked } from '../data/units';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows, gradients, transitions, blurs } from '../theme/theme';
import type { Lesson } from '../models/lesson';
import { analytics } from '../services/analytics';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Chip';
import { StandaloneBadge } from '../components/Badge';
import { ToastContainer } from '../components/Toast';
import { Progress } from '../components/Progress';
import { Button } from '../components/Button';

export const SkillTreePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, getCompletedLessonIds } = useApp();
  const units = getAllUnits();
  const completedLessonIds = getCompletedLessonIds();
  const [toasts, setToasts] = useState<Array<{ id: string; type?: 'info' | 'success' | 'warning' | 'error'; message: string; duration?: number }>>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, navigate]);

  const getLessonStatus = (lesson: Lesson) => {
    if (completedLessonIds.includes(lesson.id)) {
      return 'completed';
    }
    if (isLessonUnlocked(lesson.id, completedLessonIds)) {
      return 'unlocked';
    }
    return 'locked';
  };

  const handleLessonClick = (lesson: Lesson) => {
    const status = getLessonStatus(lesson);
    if (status !== 'locked') {
      navigate(`/lesson/${lesson.id}`);
    } else {
      setToasts(prev => [...prev, {
        id: Date.now().toString(),
        type: 'warning',
        message: 'Complete previous lessons to unlock this one!',
        duration: 3000
      }]);
    }
  };

  useEffect(() => {
    if (!user) return;
    analytics.trackEvent('map_loaded', {
      unitsCount: units.length,
      completedLessons: completedLessonIds.length,
    });
  }, [user, units.length, completedLessonIds.length]);

  // Daily reminder toast (simple local-first): if no completion today and user has a streak
  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const hasCompletedToday = user.lastStreakDate === todayStr;
    const hasSeen = localStorage.getItem('reminderShown') === todayStr;

    if (!hasCompletedToday && !hasSeen && user.streakCount > 0) {
      setTimeout(() => {
        setToasts(prev => [...prev, {
          id: 'streak-reminder',
          type: 'info',
          message: `Keep your ${user.streakCount} day streak going! Complete a lesson today!`,
          duration: 5000
        }]);
        localStorage.setItem('reminderShown', todayStr);
      }, 1000);
    }
  }, [user]);

  // Calculate unit progress
  const unitProgress = useMemo(() => {
    return units.map(unit => {
      const total = unit.lessons.length;
      const done = unit.lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
      return { unit: unit.unit, total, done };
    });
  }, [units, completedLessonIds]);

  if (!user) return null;

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const overallProgress = (completedLessonIds.length / totalLessons) * 100;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
        paddingBottom: spacing.xxl,
      }}
    >
      {/* Hero Section with Gradient Background */}
      <div
        style={{
          background: gradients.warm,
          color: colors.text,
          padding: `${spacing.xxl} 0`,
          position: 'relative',
          overflow: 'hidden',
          marginBottom: spacing.xxl,
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        
        <Container>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: spacing.xl,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                <img
                  src="/img/kooka-burra-singing.png"
                  alt="Kooka singing"
                  style={{
                    width: '80px',
                    borderRadius: '50%',
                    border: `4px solid ${colors.surface}`,
                    boxShadow: shadows.lg,
                  }}
                />
                <div>
                  <h1
                    style={{
                      fontSize: fontSize.xxxl,
                      fontWeight: fontWeight.extrabold,
                      marginBottom: spacing.xs,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                  >
                    Welcome back, {user.name}!
                  </h1>
                  <p style={{ 
                    fontSize: fontSize.lg, 
                    opacity: 0.95,
                    fontWeight: fontWeight.medium,
                  }}>
                    Your voice is getting stronger every day!
                  </p>
                </div>
              </div>
              
              {/* Overall Progress */}
              <div style={{ marginTop: spacing.lg }}>
                <div style={{ marginBottom: spacing.sm, fontSize: fontSize.sm, opacity: 0.9 }}>
                  Journey Progress
                </div>
                <Progress
                  value={overallProgress}
                  max={100}
                  size="large"
                  color="success"
                  animated
                  label={`${completedLessonIds.length} of ${totalLessons} lessons`}
                />
              </div>
            </div>
            
            <div
              style={{
                display: 'flex',
                gap: spacing.md,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* Stats Cards */}
              <Card
                variant="glass"
                style={{
                  padding: spacing.lg,
                  textAlign: 'center',
                  minWidth: '120px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: `blur(${blurs.md})`,
                  WebkitBackdropFilter: `blur(${blurs.md})`,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ fontSize: fontSize.xs, opacity: 0.9, marginBottom: spacing.xs }}>
                  Points Earned
                </div>
                <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                  {user.totalPoints}
                </div>
                <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>
                  <Icon name="star" size={18} />
                </div>
              </Card>
              
              {/* Streak Card */}
              {typeof user.streakCount === 'number' && user.streakCount > 0 && (
                <Card
                  variant="glass"
                  style={{
                    padding: spacing.lg,
                    textAlign: 'center',
                    minWidth: '120px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: `blur(${blurs.md})`,
                    WebkitBackdropFilter: `blur(${blurs.md})`,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div style={{ fontSize: fontSize.xs, opacity: 0.9, marginBottom: spacing.xs }}>
                    Daily Streak
                  </div>
                  <div style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold }}>
                    {user.streakCount}
                  </div>
                  <div style={{ fontSize: fontSize.sm }}>
                    <Icon name="fire" size={18} />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Units Section */}
      <Container>
        <div style={{ marginBottom: spacing.xxl }}>
          <h2
            style={{
              fontSize: fontSize.xxxl,
              fontWeight: fontWeight.extrabold,
              color: colors.text,
              marginBottom: spacing.md,
              textAlign: 'center',
              
            }}
          >
            Your Singing Journey
          </h2>
          <p
            style={{
              fontSize: fontSize.lg,
              color: colors.textLight,
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Each unit teaches you new skills. Complete lessons to unlock the next adventures!
          </p>
        </div>

        {units.map((unit, unitIndex) => {
          const unitProg = unitProgress.find(u => u.unit === unit.unit);
          const isUnitComplete = unitProg && unitProg.done === unitProg.total;
          const isExpanded = selectedUnit === unit.unit;
          
          return (
            <div 
              key={unit.unit} 
              style={{ 
                marginBottom: spacing.xxl,
                opacity: 0,
                animation: `slideUp 0.5s ease-out ${unitIndex * 0.1}s forwards`,
              }}
            >
              <Card
                variant={isUnitComplete ? 'gradient' : 'elevated'}
                decorative
                style={{
                  marginBottom: spacing.lg,
                  cursor: 'pointer',
                  transition: transitions.smooth,
                  transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                }}
                onClick={() => setSelectedUnit(isExpanded ? null : unit.unit)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: spacing.md,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: borderRadius.round,
                          background: isUnitComplete ? gradients.forest : gradients.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: fontSize.xxl,
                          boxShadow: shadows.md,
                        }}
                      >
                        <Icon name={isUnitComplete ? 'star' : 'play'} size={28} color={colors.textOnPrimary} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: fontSize.xxl,
                            fontWeight: fontWeight.bold,
                            color: colors.text,
                            marginBottom: spacing.xs,
                          }}
                        >
                          Unit {unit.unit}: {unit.title}
                        </h3>
                        <p
                          style={{
                            fontSize: fontSize.md,
                            color: colors.textLight,
                            margin: 0,
                          }}
                        >
                          {unit.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Unit Progress */}
                    {unitProg && (
                      <div style={{ marginTop: spacing.md, maxWidth: '400px' }}>
                        <Progress
                          value={unitProg.done}
                          max={unitProg.total}
                          label={`${unitProg.done} of ${unitProg.total} lessons completed`}
                          showValue
                          color={isUnitComplete ? 'success' : 'primary'}
                          size="small"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Icon
                    name={isExpanded ? 'up' : 'down'}
                    size={32}
                    color={colors.textLight}
                  />
                </div>

                {isUnitComplete && (
                  <StandaloneBadge
                    icon={<Icon name="star" size={18} color={colors.textOnPrimary} />}
                    label="Unit Complete!"
                    color="success"
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '20px',
                    }}
                  />
                )}
              </Card>

              {/* Lessons Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: spacing.lg,
                  maxHeight: isExpanded ? '2000px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s ease-in-out',
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                {unit.lessons.map((lesson, lessonIndex) => {
                  // Derive safe fallbacks for lessons missing optional metadata
                  let durationMinutes = (lesson as any).durationMinutes as number | undefined;
                  let points = (lesson as any).points as number | undefined;
                  let shortDescription = (lesson as any).shortDescription as string | undefined;
                  try {
                    const parsed = JSON.parse(lesson.content) as any;
                    const stepsCount = Array.isArray(parsed?.steps) ? parsed.steps.length : undefined;
                    if (durationMinutes == null && stepsCount != null) {
                      durationMinutes = Math.max(1, stepsCount);
                    }
                  } catch (_) {
                    // ignore JSON parse errors; fallbacks will remain undefined
                  }
                  if (durationMinutes == null) durationMinutes = 3;
                  if (points == null) points = 10;
                  if (!shortDescription) shortDescription = lesson.description;
                  const status = getLessonStatus(lesson);
                  const isLocked = status === 'locked';
                  const isCompleted = status === 'completed';
                  
                  return (
                    <Card
                      key={lesson.id}
                      variant={isCompleted ? 'gradient' : isLocked ? 'default' : 'elevated'}
                      onClick={() => handleLessonClick(lesson)}
                      style={{
                        opacity: isLocked ? 0.85 : 1,
                        transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                        transition: `all 0.3s ease-out ${lessonIndex * 0.05}s`,
                        backgroundColor: isLocked ? colors.gray100 : undefined,
                        border: isLocked ? `2px solid ${colors.gray300}` : undefined,
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        {/* Lesson Icon */}
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: borderRadius.round,
                            background: isCompleted 
                              ? gradients.forest 
                              : isLocked 
                                ? colors.gray200 
                                : gradients.sunset,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: spacing.md,
                            boxShadow: isLocked ? 'none' : shadows.md,
                            border: isLocked ? `2px solid ${colors.gray300}` : 'none',
                          }}
                        >
                          {isLocked ? (
                            <Icon name="error" size={24} color={colors.gray600} />
                          ) : isCompleted ? (
                            <Icon name="check" size={24} color={colors.text} />
                          ) : (
                            <Icon name="play" size={24} color={colors.textOnPrimary} />
                          )}
                        </div>

                        {/* Lesson Content */}
                        <h4
                          style={{
                            fontSize: fontSize.lg,
                            fontWeight: fontWeight.semibold,
                            color: colors.text,
                            marginBottom: spacing.sm,
                          }}
                        >
                          {lesson.title}
                        </h4>
                        
                        <p
                          style={{
                            fontSize: fontSize.sm,
                            color: colors.textLight,
                            marginBottom: spacing.md,
                            minHeight: '40px',
                          }}
                        >
                          {shortDescription}
                        </p>

                        {/* Lesson Details */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: spacing.sm,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', gap: spacing.sm }}>
                            <Chip
                              label={`${durationMinutes} min`}
                              size="small"
                              variant="outlined"
                              icon={<Icon name="schedule" size={14} />}
                            />
                            <Chip
                              label={`${points} pts`}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              icon={<Icon name="star" size={14} />}
                            />
                          </div>
                          
                          {!isLocked && (
                            <Button
                              size="small"
                              variant={isCompleted ? 'outline' : 'primary'}
                              style={{ minWidth: '80px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLessonClick(lesson);
                              }}
                            >
                              {isCompleted ? 'Review' : 'Start'}
                            </Button>
                          )}
                        </div>

                        {/* Completed Badge */}
                        {isCompleted && (
                          <StandaloneBadge
                            icon={<Icon name="check" size={14} color={colors.textOnPrimary} />}
                            label="Complete"
                            color="success"
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                            }}
                          />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Motivational Footer */}
        <Card
          variant="gradient"
          decorative
          style={{
            marginTop: spacing.xxxl,
            textAlign: 'center',
            background: gradients.sunset,
          }}
        >
          <img
            src="/img/kooka-burra-breathing.png"
            alt="Kooka encouraging you"
                          style={{
                width: '120px',
                margin: '0 auto',
                marginBottom: spacing.lg,
              }}
          />
          <h3
            style={{
              fontSize: fontSize.xxl,
              fontWeight: fontWeight.bold,
              color: colors.text,
              marginBottom: spacing.md,
            }}
          >
            You're doing amazing!
          </h3>
          <p
            style={{
              fontSize: fontSize.lg,
              color: colors.text,
              opacity: 0.95,
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Every lesson brings you closer to finding your unique voice. Keep singing, keep growing!
          </p>
        </Card>
      </Container>

      <ToastContainer toasts={toasts} />
    </div>
  );
};