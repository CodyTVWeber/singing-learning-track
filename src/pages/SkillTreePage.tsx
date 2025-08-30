import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllUnits, isLessonUnlocked } from '../data/units';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme/theme';
import type { Lesson } from '../models/lesson';
import { Icon } from '../components/Icon';

export const SkillTreePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, getCompletedLessonIds } = useApp();
  const units = getAllUnits();
  const completedLessonIds = getCompletedLessonIds();

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
    }
  };

  if (!user) {
    navigate('/onboarding');
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        paddingBottom: spacing.xl,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: 'white',
          padding: spacing.lg,
          boxShadow: shadows.md,
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: spacing.md,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: fontWeight.bold,
                  marginBottom: spacing.xs,
                  color: 'white',
                }}
              >
                Hi {user.name}!
              </h1>
              <p style={{ fontSize: fontSize.md, opacity: 0.9 }}>
                Keep singing every day!
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: spacing.lg,
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fontSize.xs, opacity: 0.8 }}>Points</div>
                <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>
                  {user.totalPoints}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fontSize.xs, opacity: 0.8 }}>Streak</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}>
                  <Icon name="star" />
                  <span style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>{user.streak}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Units */}
      <Container>
        {units.map((unit) => (
          <div key={unit.unit} style={{ marginTop: spacing.xl }}>
            <h2
              style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.darkBrown,
                marginBottom: spacing.md,
              }}
            >
              Unit {unit.unit}: {unit.title}
            </h2>
            <p
              style={{
                fontSize: fontSize.lg,
                color: colors.textLight,
                marginBottom: spacing.lg,
              }}
            >
              {unit.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: spacing.lg,
              }}
            >
              {unit.lessons.map((lesson) => {
                const status = getLessonStatus(lesson);
                return (
                  <Card
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    style={{
                      opacity: status === 'locked' ? 0.6 : 1,
                      cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: borderRadius.round,
                          backgroundColor:
                            status === 'completed'
                              ? colors.success
                              : status === 'unlocked'
                              ? colors.secondary
                              : colors.featherLight,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: fontSize.xxl,
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          name={status === 'completed' ? 'check' : status === 'locked' ? 'close' : 'play'}
                          color={status === 'locked' ? colors.earthTone : 'white'}
                          size={28}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: fontSize.lg,
                            fontWeight: fontWeight.semibold,
                            color: colors.darkBrown,
                            marginBottom: spacing.xs,
                          }}
                        >
                          {lesson.title}
                        </h3>
                        <p
                          style={{
                            fontSize: fontSize.md,
                            color: colors.textLight,
                          }}
                        >
                          {lesson.description}
                        </p>
                        <div
                          style={{
                            marginTop: spacing.sm,
                            fontSize: fontSize.sm,
                            color: colors.earthTone,
                          }}
                        >
                          {lesson.type === 'practice' && 'Practice'}
                          {lesson.type === 'sound' && 'Sound'}
                          {lesson.type === 'song' && 'Song'}
                        </div>
                      </div>
                    </div>
                    {status === 'unlocked' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, transparent 50%, ${colors.warning} 50%)`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          padding: spacing.xs,
                        }}
                      >
                        <span
                          style={{
                            fontSize: fontSize.xs,
                            fontWeight: fontWeight.bold,
                            color: 'white',
                            transform: 'rotate(45deg) translate(10px, -5px)',
                          }}
                        >
                          NEW
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};