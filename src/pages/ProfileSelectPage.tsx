import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getProfiles, setActiveProfileId, saveProfile } from '../storage/profilesStore';
import type { Profile } from '../models/profile';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fontSize, fontWeight, spacing, gradients, shadows, borderRadius } from '../theme/theme';

export const ProfileSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ageGroup, setAgeGroup] = useState<'kid' | 'teen' | 'adult'>('kid');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const all = await getProfiles();
      setProfiles(all);
    })();
  }, []);

  const handleSelect = async (id: string) => {
    await setActiveProfileId(id);
    navigate('/skill-tree');
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmed || !trimmedEmail) {
      setError('Please enter a name and email');
      return;
    }
    const profile: Profile = {
      id: uuidv4(),
      name: trimmed,
      ageGroup,
      email: trimmedEmail,
      completedLessons: [],
    };
    try {
      await saveProfile(profile);
    } catch (e: any) {
      setError(e?.message || 'Could not create profile');
      return;
    }
    await setActiveProfileId(profile.id);
    navigate('/skill-tree');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gradients.soft,
        padding: spacing.lg,
      }}
    >
      <Container maxWidth="640px">
        <h1
          style={{
            fontSize: fontSize.xxxl,
            fontWeight: fontWeight.extrabold,
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.xl,
          }}
        >
          Choose Your Profile
        </h1>

        {profiles.length > 0 && (
          <Card variant="elevated" style={{ marginBottom: spacing.xl }}>
            <div style={{ display: 'grid', gap: spacing.md }}>
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
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
                    {p.completedLessons.length} lessons completed
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card variant="glass">
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>Create New Profile</h2>
          <div style={{ display: 'grid', gap: spacing.md }}>
            {error && (
              <div style={{ color: colors.error, fontSize: fontSize.sm }}>{error}</div>
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              inputMode="email"
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            />
            <div style={{ display: 'flex', gap: spacing.sm }}>
              {(['kid', 'teen', 'adult'] as const).map((group) => (
                <label key={group} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="radio"
                    name="ageGroup"
                    value={group}
                    checked={ageGroup === group}
                    onChange={() => setAgeGroup(group)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{group}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleCreate} disabled={!name.trim() || !email.trim()}>
              Create and Continue
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

