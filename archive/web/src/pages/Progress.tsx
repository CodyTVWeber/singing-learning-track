import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useUser } from '../contexts/UserContext';
import { getUserStats } from '../utils/storage';

const ProgressContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fonts.sizes.xxlarge};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${theme.fonts.sizes.medium};
  color: ${theme.colors.textLight};
`;

const AchievementsSection = styled.section`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xlarge};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${theme.spacing.md};
`;

const Achievement = styled.div<{ earned?: boolean }>`
  background-color: ${({ earned }) => earned ? theme.colors.warning : '#F0F0F0'};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  text-align: center;
  opacity: ${({ earned }) => earned ? 1 : 0.5};
  
  div:first-child {
    font-size: 48px;
    margin-bottom: ${theme.spacing.xs};
  }
  
  div:last-child {
    font-size: ${theme.fonts.sizes.small};
    color: ${({ earned }) => earned ? theme.colors.text : theme.colors.textLight};
  }
`;

// Kookaburra-themed achievements
const getKookaAchievements = (user: any, stats: any) => [
  { id: 1, icon: 'K-first-song', name: 'First Song with Kooka', description: 'Completed your first lesson!', earned: stats.completedLessons >= 1 },
  { id: 2, icon: 'K-voice-explorer', name: 'Voice Explorer', description: 'Found your singing voice!', earned: stats.completedLessons >= 3 },
  { id: 3, icon: 'K-pitch-pupil', name: 'Pitch Pupil', description: 'Learning high and low sounds!', earned: stats.completedLessons >= 5 },
  { id: 4, icon: 'K-rhythm-ranger', name: 'Rhythm Ranger', description: 'Master of beat and timing!', earned: stats.completedLessons >= 7 },
  { id: 5, icon: 'K-forest-singer', name: 'Forest Singer', description: 'Completed a whole unit!', earned: stats.completedLessons >= 3 },
  { id: 6, icon: 'K-daily-singer', name: 'Daily Singer', description: 'Sang 7 days in a row!', earned: stats.streak >= 7 },
  { id: 7, icon: 'K-point-collector', name: 'Point Collector', description: 'Earned 100 singing points!', earned: user.totalPoints >= 100 },
  { id: 8, icon: 'K-expression-expert', name: 'Expression Expert', description: 'Learning to sing with feeling!', earned: stats.completedLessons >= 10 },
];

export const Progress: React.FC = () => {
  const { user } = useUser();
  
  if (!user) {
    return (
      <ProgressContainer>
        <Title>📊 Your Progress</Title>
        <p style={{ textAlign: 'center', color: theme.colors.textLight }}>
          Please create a profile to track your progress!
        </p>
      </ProgressContainer>
    );
  }
  
  const stats = getUserStats(user.id);
  
  // Dynamic achievements based on user progress
  const userAchievements = getKookaAchievements(user, stats);
  
  return (
    <ProgressContainer>
      <Title>{user.name}'s Singing Journey</Title>
      
      <StatsGrid>
        <StatCard className="fade-in">
          <StatValue>{stats.completedLessons}</StatValue>
          <StatLabel>Lessons Completed</StatLabel>
        </StatCard>
        <StatCard className="fade-in">
          <StatValue>{user.totalPoints}</StatValue>
          <StatLabel>Total Points</StatLabel>
        </StatCard>
        <StatCard className="fade-in">
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>Day Streak</StatLabel>
        </StatCard>
        <StatCard className="fade-in">
          <StatValue>{user.currentLevel}</StatValue>
          <StatLabel>Current Level</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <AchievementsSection>
        <SectionTitle>🏅 Achievements</SectionTitle>
        <AchievementGrid>
          {userAchievements.map((achievement) => (
            <Achievement key={achievement.id} earned={achievement.earned}>
              <div>{achievement.icon}</div>
              <div>{achievement.name}</div>
            </Achievement>
          ))}
        </AchievementGrid>
      </AchievementsSection>
    </ProgressContainer>
  );
};