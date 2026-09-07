import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { Header } from '../components/Header';
import { Icon, IconButton } from '../components/Icon';
import { Card } from '../components/Card';
import { SongPerformance } from '../components/SongPerformance';
import { bundledSongCharts } from '../data/songCharts';
import type { SongChart } from '../models/songChart';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../theme/theme';

export const SingAlongPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState<SongChart | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <Header
        title="Sing Along"
        subtitle="Pick a song and score your singing"
        variant="gradient"
        leftAction={
          <IconButton
            icon="back"
            onClick={() => navigate('/skill-tree')}
            ariaLabel="Back to skill tree"
          />
        }
      />

      <Container style={{ paddingTop: spacing.xl, paddingBottom: spacing.xxl }}>
        {!selectedChart ? (
          <>
            <p
              style={{
                fontSize: fontSize.lg,
                color: colors.text,
                marginBottom: spacing.lg,
                textAlign: 'center',
              }}
            >
              Choose a song to practice with live pitch scoring.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: spacing.md,
              }}
            >
              {bundledSongCharts.map((chart) => (
                <Card
                  key={chart.id}
                  variant="elevated"
                  decorative
                  style={{
                    padding: spacing.lg,
                    cursor: 'pointer',
                    minHeight: 120,
                  }}
                  onClick={() => setSelectedChart(chart)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: borderRadius.round,
                        backgroundColor: colors.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="play" color={colors.textOnSecondary} />
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: fontSize.lg,
                          fontWeight: fontWeight.bold,
                          color: colors.text,
                        }}
                      >
                        {chart.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textLight }}>
                        {Math.round(chart.durationMs / 1000)}s · {chart.bpm ?? 120} BPM
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSelectedChart(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.xs,
                marginBottom: spacing.lg,
                background: 'none',
                border: 'none',
                color: colors.secondary,
                fontSize: fontSize.md,
                fontWeight: fontWeight.semibold,
                cursor: 'pointer',
                minHeight: 44,
                padding: spacing.sm,
              }}
            >
              <Icon name="back" size={16} />
              Pick another song
            </button>
            <SongPerformance chart={selectedChart} allowCustomChart />
          </>
        )}
      </Container>
    </div>
  );
};
