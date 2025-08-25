import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { FunButton } from '../components/FunButton';
import { sampleLessons } from '../data/sampleLessons';
import { useUser } from '../contexts/UserContext';
import { isLessonCompleted } from '../utils/storage';

const LessonsContainer = styled.div`
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

const LessonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const LessonCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large};
  }
`;

const LessonImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
`;

const LessonContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const LessonTitle = styled.h3`
  font-size: ${theme.fonts.sizes.large};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const LessonDescription = styled.p`
  color: ${theme.colors.textLight};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.6;
`;

const LevelBadge = styled.span`
  background-color: ${theme.colors.warning};
  color: ${theme.colors.text};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.fonts.sizes.small};
  font-weight: 600;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background-color: ${theme.colors.success};
  color: ${theme.colors.text};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.fonts.sizes.small};
  font-weight: 600;
`;

export const Lessons: React.FC = () => {
  const { user } = useUser();

  // Check if a lesson is unlocked based on level and previous completions
  const isLessonUnlocked = (lesson: typeof sampleLessons[0]): boolean => {
    if (!user) return false;
    
    // Level 1 lessons are always unlocked
    if (lesson.level === 1) return true;
    
    // For higher levels, check if previous level lessons are completed
    const previousLevelLessons = sampleLessons.filter(l => l.level < lesson.level);
    const completedPreviousLessons = previousLevelLessons.filter(l => 
      isLessonCompleted(user.id, l.id)
    );
    
    // Unlock if at least 2 lessons from previous level are completed
    return completedPreviousLessons.length >= 2;
  };

  return (
    <LessonsContainer>
      <Title>🎵 Choose Your Lesson</Title>
      <LessonGrid>
        {sampleLessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson);
          const completed = user ? isLessonCompleted(user.id, lesson.id) : false;
          
          return (
            <LessonCard key={lesson.id} className="fade-in" style={{ position: 'relative' }}>
              {completed && <CompletedBadge>✅ Completed</CompletedBadge>}
              <LessonImage>{lesson.imageUrl}</LessonImage>
              <LessonContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <LessonTitle>{lesson.title}</LessonTitle>
                  <LevelBadge>Level {lesson.level}</LevelBadge>
                </div>
                <LessonDescription>{lesson.description}</LessonDescription>
                {unlocked ? (
                  <Link to={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <FunButton 
                      fullWidth 
                      variant={completed ? 'success' : 'primary'}
                    >
                      {completed ? '🔄 Practice Again' : '🎮 Start Lesson'}
                    </FunButton>
                  </Link>
                ) : (
                  <FunButton 
                    fullWidth 
                    variant="secondary"
                    disabled
                  >
                    🔒 Complete more Level {lesson.level - 1} lessons
                  </FunButton>
                )}
              </LessonContent>
            </LessonCard>
          );
        })}
      </LessonGrid>
    </LessonsContainer>
  );
};