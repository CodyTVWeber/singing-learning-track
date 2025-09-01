import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles, setActiveProfileId } from '../storage/profilesStore';
import type { Profile } from '../models/profile';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius, animations } from '../theme/theme';
import { analytics } from '../services/analytics';

export const ProfileSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analytics.trackEvent('login_screen_shown');
    (async () => {
      const all = await getProfiles();
      setProfiles(all);
    })();
  }, []);

  const handleSelect = async (id: string) => {
    await setActiveProfileId(id);
    navigate('/skill-tree');
  };

  const handleCreate = () => {
    navigate('/onboarding');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: spacing.xxl,
      }}
    >
      {/* Background decorations from splash */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          backgroundImage: 'url(/img/kooka-burra-flying-blue-sky-clouds-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          filter: 'blur(2px)',
          opacity: 0.15,
          animation: animations.pulse,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: gradients.wing,
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: animations.pulse,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: gradients.feather,
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: animations.pulse,
          animationDelay: '1s',
          pointerEvents: 'none',
        }}
      />

      <Container>
        <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
          <img
            src="/img/kooka-burra-waiving.png"
            alt="Kooka greeting you"
            style={{
              width: '280px',
              margin: '0 auto',
              filter: `drop-shadow(${shadows.xl})`,
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
              marginBottom: spacing.sm,
              textAlign: 'center',
              letterSpacing: '-0.03em',
            }}
          >
            Kooka Sing
          </h1>
          <p
            style={{
              fontSize: fontSize.lg,
              color: colors.textLight,
              marginBottom: spacing.xl,
              textAlign: 'center',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Welcome! Choose your account to continue, or create a new one to begin your singing journey.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
            <Button variant="gradient" onClick={handleCreate}>Create New Account</Button>
          </div>
        </div>

        {profiles.length > 0 && (
          <Card variant="elevated" style={{ marginBottom: spacing.xl }}>
            <div style={{
              display: 'grid',
              gap: spacing.md,
              maxHeight: '50vh',
              overflowY: 'auto',
              paddingRight: spacing.sm,
            }}>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: spacing.md,
                    borderRadius: borderRadius.lg,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    boxShadow: shadows.sm,
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: fontWeight.bold }}>{p.name}</div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>{p.email || 'no email'}</div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>{p.ageGroup}</div>
                  </div>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>{p.completedLessons.length} lessons completed</div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};

