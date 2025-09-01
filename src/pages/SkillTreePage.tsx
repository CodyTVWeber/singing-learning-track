import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllUnits, isLessonUnlocked } from '../data/units';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing, shadows, gradients } from '../theme/theme';
import type { Lesson } from '../models/lesson';
import { analytics } from '../services/analytics';
import { ToastContainer } from '../components/Toast';
import { Progress } from '../components/Progress';
import { StatCard } from '../components/StatCard';
import { UnitCard } from '../components/UnitCard';
import { LessonCard } from '../components/LessonCard';

export const SkillTreePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, getCompletedLessonIds } = useApp();
  const units = getAllUnits();
  const completedLessonIds = getCompletedLessonIds();
  const [toasts, setToasts] = useState<Array<{ id: string; type?: 'info' | 'success' | 'warning' | 'error'; message: string; duration?: number }>>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  // Get appropriate kooka image for each unit
  const getUnitKookaImage = (unitNumber: number, isComplete: boolean) => {
    if (isComplete) {
      return '/img/kooka-burra-dancing.png'; // Celebration for completed units
    }

    const kookaOptions = [
      '/img/kooka-burra-singing.png',
      '/img/kooka-burra-calling-out.png',
      '/img/kooka-burra-flying.png',
      '/img/kooka-burra-waiving.png',
    ];

    // Use unit number to consistently assign same image to same unit
    return kookaOptions[unitNumber % kookaOptions.length];
  };

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
              {/* Centered Kooka Image */}
              <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <img
                  src="/img/kooka-burra-flying.png"
                  alt="Kooka flying high"
                  style={{
                    width: '280px',
                    margin: '0 auto',
                    marginBottom: spacing.xl,
                    filter: `drop-shadow(${shadows.xl})`,
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                />
              </div>

              {/* Centered Text Content */}
              <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
                <h1
                  style={{
                    fontSize: fontSize.xxxl,
                    fontWeight: fontWeight.extrabold,
                    marginBottom: spacing.md,
                    letterSpacing: '-0.02em',
                    color: colors.text,
                  }}
                >
                  Welcome back, {user.name}!
                </h1>
                <p style={{
                  fontSize: fontSize.lg,
                  color: colors.textLight,
                  fontWeight: fontWeight.medium,
                  opacity: 0.75,
                  maxWidth: '350px',
                  margin: '0 auto',
                  lineHeight: 1.4,
                }}>
                  Your voice is getting stronger every day!
                </p>
              </div>

              {/* Overall Progress */}
              <div style={{ marginTop: spacing.lg, width: '100%' }}>
                <div
                  className="progress-row-mobile"
                  style={{
                    display: 'flex',
                    gap: spacing.md,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: spacing.lg,
                  }}
                >
                  <div style={{
                    flex: '1 1 300px',
                    minWidth: '200px',
                    maxWidth: user.streakCount > 0 ? 'calc(100% - 320px)' : 'calc(100% - 160px)',
                    order: 1
                  }}>
                    <Progress
                      value={overallProgress}
                      max={100}
                      size="large"
                      color="success"
                      animated
                      title="Journey Progress"
                      label={`${completedLessonIds.length} of ${totalLessons} lessons`}
                    />
                  </div>
                  <div style={{
                    flex: '0 0 auto',
                    order: 2,
                    marginTop: '8px'
                  }}>
                    <StatCard label="Points Earned" value={user.totalPoints} accent="primary" />
                  </div>
                  {user.streakCount > 0 && (
                    <div style={{
                      flex: '0 0 auto',
                      order: 3,
                      minWidth: '140px',
                      marginTop: '8px'
                    }}>
                      <StatCard label="Daily Streak" value={user.streakCount} accent="success" />
                    </div>
                  )}
                </div>
              </div>
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
          const isUnitComplete = unitProg ? unitProg.done === unitProg.total : false;
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
              <UnitCard
                unitNumber={unit.unit}
                title={unit.title}
                description={unit.description}
                imageSrc={getUnitKookaImage(unit.unit, isUnitComplete)}
                progressDone={unitProg ? unitProg.done : 0}
                progressTotal={unitProg ? unitProg.total : 0}
                isExpanded={isExpanded}
                isComplete={Boolean(isUnitComplete)}
                onToggle={() => setSelectedUnit(isExpanded ? null : unit.unit)}
              />

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

                  const duration = durationMinutes ?? (lesson.type === 'song' ? 5 : lesson.type === 'practice' ? 4 : 3);
                  const pts = points ?? lesson.level * 5;

                  return (
                    <div
                      key={lesson.id}
                      style={{
                        transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                        transition: `all 0.3s ease-out ${lessonIndex * 0.05}s`,
                      }}
                    >
                      <LessonCard
                        title={lesson.title}
                        description={shortDescription}
                        status={status as any}
                        durationMinutes={duration}
                        points={pts}
                        onClick={() => handleLessonClick(lesson)}
                        onStart={() => handleLessonClick(lesson)}
                      />
                    </div>
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
            src="/img/kooka-burra-dancing.png"
            alt="Kooka dancing with excitement"
            style={{
              width: '180px',
              margin: '0 auto',
              marginBottom: spacing.xl,
              filter: `drop-shadow(${shadows.xl})`,
              transform: 'scale(1)',
              transition: 'transform 0.4s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15) rotate(-3deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
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