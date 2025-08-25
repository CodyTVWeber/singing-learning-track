import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { FunButton } from '../components/FunButton';
import { AudioRecorder } from '../components/AudioRecorder';
import { useUser } from '../contexts/UserContext';
import { getLessonById } from '../data/sampleLessons';
import { saveProgress, updateUserPoints } from '../utils/storage';

const LessonContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const LessonHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
`;

const LessonIcon = styled.div`
  font-size: 72px;
  margin-bottom: ${theme.spacing.md};
`;

const LessonTitle = styled.h1`
  font-size: ${theme.fonts.sizes.xxlarge};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const LessonContent = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  margin-bottom: ${theme.spacing.xl};
  
  p {
    margin-bottom: ${theme.spacing.md};
    line-height: 1.8;
  }
  
  ol, ul {
    margin-left: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.md};
    
    li {
      margin-bottom: ${theme.spacing.sm};
      line-height: 1.8;
    }
  }
  
  strong {
    color: ${theme.colors.primary};
  }
`;

const CompletionSection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.success};
  border-radius: ${theme.borderRadius.large};
  margin-top: ${theme.spacing.xl};
  animation: bounce 1s ease-in-out;
`;

const PointsEarned = styled.div`
  font-size: ${theme.fonts.sizes.xxlarge};
  color: ${theme.colors.text};
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.xl};
  gap: ${theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [lesson, setLesson] = useState(lessonId ? getLessonById(lessonId) : null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!lesson) {
      navigate('/lessons');
    }
  }, [lesson, navigate]);

  if (!lesson || !user) {
    return null;
  }

  const handleComplete = () => {
    const points = 50; // Base points for completing a lesson
    
    // Save progress
    saveProgress({
      userId: user.id,
      lessonId: lesson.id,
      completed: true,
      score: points,
      completedDate: new Date(),
    });
    
    // Update user points
    updateUserPoints(user.id, points);
    updateUser({ totalPoints: user.totalPoints + points });
    
    setIsCompleted(true);
  };

  const renderContent = () => {
    // Convert content string to formatted JSX
    const lines = lesson.content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Check if it's a numbered list item
      if (/^\d+\./.test(line.trim())) {
        return <li key={index}>{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      
      // Check if it's a bullet point
      if (line.trim().startsWith('-')) {
        return <li key={index}>{line.replace(/^-\s*/, '')}</li>;
      }
      
      // Check if it's a heading (contains ':' at the end)
      if (line.trim().endsWith(':') && line.trim().length < 50) {
        return <p key={index}><strong>{line}</strong></p>;
      }
      
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <LessonContainer>
      <LessonHeader>
        <LessonIcon>{lesson.imageUrl}</LessonIcon>
        <LessonTitle>{lesson.title}</LessonTitle>
        <p>{lesson.description}</p>
      </LessonHeader>

      <LessonContent>
        {renderContent()}
      </LessonContent>

      {!isCompleted && (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
            🎤 Now it's your turn! Record yourself trying this lesson:
          </h2>
          <AudioRecorder />
          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <p style={{ marginBottom: theme.spacing.md, color: theme.colors.textLight }}>
              Record yourself practicing this lesson, then click complete!
            </p>
            <FunButton
              size="large"
              variant="success"
              onClick={handleComplete}
            >
              ✅ Complete Lesson
            </FunButton>
          </div>
        </>
      )}

      {isCompleted && (
        <CompletionSection>
          <h2 style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>🎉</h2>
          <PointsEarned>+50 Points!</PointsEarned>
          <h2>Great Job! You completed the lesson!</h2>
          <p style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            Keep practicing to become an even better singer!
          </p>
        </CompletionSection>
      )}

      <NavigationButtons>
        <FunButton
          size="medium"
          variant="secondary"
          onClick={() => navigate('/lessons')}
        >
          ← Back to Lessons
        </FunButton>
        {isCompleted && (
          <FunButton
            size="medium"
            variant="primary"
            onClick={() => navigate('/lessons')}
          >
            Next Lesson →
          </FunButton>
        )}
      </NavigationButtons>
    </LessonContainer>
  );
};