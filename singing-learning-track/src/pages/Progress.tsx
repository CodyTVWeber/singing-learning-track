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

// Sample achievements
const achievements = [
  { id: 1, icon: '🎤', name: 'First Recording', earned: true },
  { id: 2, icon: '🎵', name: '5 Lessons', earned: true },
  { id: 3, icon: '🏆', name: '100 Points', earned: true },
  { id: 4, icon: '🔥', name: '7 Day Streak', earned: false },
  { id: 5, icon: '⭐', name: 'Perfect Score', earned: false },
  { id: 6, icon: '🎯', name: 'Pitch Master', earned: false },
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
  const userAchievements = [
    { id: 1, icon: '🎤', name: 'First Recording', earned: stats.completedLessons >= 1 },
    { id: 2, icon: '🎵', name: '5 Lessons', earned: stats.completedLessons >= 5 },
    { id: 3, icon: '🏆', name: '100 Points', earned: user.totalPoints >= 100 },
    { id: 4, icon: '🔥', name: '7 Day Streak', earned: stats.streak >= 7 },
    { id: 5, icon: '⭐', name: 'Perfect Score', earned: stats.totalScore >= 250 },
    { id: 6, icon: '🎯', name: 'Level 2 Unlock', earned: stats.completedLessons >= 2 },
  ];
  
  return (
    <ProgressContainer>
      <Title>📊 {user.name}'s Progress</Title>
      
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