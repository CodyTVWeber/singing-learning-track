import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { FunButton } from '../components/FunButton';
import { getAllUnits, isLessonUnlocked } from '../data/sampleLessons';
import { useUser } from '../contexts/UserContext';
import { getUserProgress } from '../utils/storage';
import { Kookaburra } from '../components/Kookaburra';

const LessonsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fonts.sizes.xxlarge};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${theme.colors.textLight};
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.fonts.sizes.large};
`;

const SkillTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const UnitCard = styled.div<{ unlocked: boolean }>`
  background: ${props => props.unlocked ? theme.colors.white : theme.colors.featherLight};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  overflow: hidden;
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.unlocked ? theme.shadows.large : theme.shadows.medium};
  }
`;

const UnitHeader = styled.div<{ unlocked: boolean }>`
  background: ${props => props.unlocked 
    ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
    : `linear-gradient(135deg, ${theme.colors.earthTone}, ${theme.colors.featherLight})`
  };
  color: ${theme.colors.white};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const UnitTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xlarge};
  margin-bottom: ${theme.spacing.sm};
`;

const UnitDescription = styled.p`
  opacity: 0.9;
  font-size: ${theme.fonts.sizes.medium};
`;

const LessonsGrid = styled.div`
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.md};
`;

const LessonNode = styled.div<{ unlocked: boolean; completed: boolean }>`
  background: ${props => {
    if (props.completed) return theme.colors.success;
    if (props.unlocked) return theme.colors.white;
    return theme.colors.featherLight;
  }};
  border: 3px solid ${props => {
    if (props.completed) return theme.colors.success;
    if (props.unlocked) return theme.colors.secondary;
    return theme.colors.earthTone;
  }};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => props.unlocked ? 1 : 0.6};
  
  &:hover {
    transform: ${props => props.unlocked ? 'scale(1.02)' : 'none'};
    cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  }
`;

const LessonIcon = styled.div<{ unlocked: boolean; completed: boolean }>`
  font-size: 48px;
  margin-bottom: ${theme.spacing.sm};
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%)'};
`;

const LessonTitle = styled.h4`
  font-size: ${theme.fonts.sizes.medium};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const LessonStatus = styled.div`
  font-size: ${theme.fonts.sizes.small};
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${theme.colors.success};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const KookaGuide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.skyLight};
  border-radius: ${theme.borderRadius.medium};
`;

const KookaMessage = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border: 10px solid transparent;
    border-right-color: ${theme.colors.white};
  }
`;

export const Lessons: React.FC = () => {
  const { user } = useUser();
  const units = getAllUnits();

  if (!user) {
    return (
      <LessonsContainer>
        <Title>Please create your profile first!</Title>
      </LessonsContainer>
    );
  }

  const userProgress = getUserProgress(user.id);
  const completedLessonIds = userProgress.filter(p => p.completed).map(p => p.lessonId);

  const getKookaMessage = () => {
    const totalCompleted = completedLessonIds.length;
    if (totalCompleted === 0) {
      return "Welcome to your singing journey! Let's start with the basics - breathing is the foundation of everything!";
    } else if (totalCompleted < 3) {
      return "Great start! You're building your vocal foundation. Each lesson makes you stronger!";
    } else if (totalCompleted < 6) {
      return "Fantastic progress! You're becoming a real singer. Keep up the amazing work!";
    } else {
      return "Wow! You're becoming a singing expert! I'm so proud of how far you've come!";
    }
  };

  const isUnitUnlocked = (unitNumber: number): boolean => {
    if (unitNumber === 1) return true;
    
    // Unit is unlocked if all lessons in the previous unit are completed
    const previousUnit = units.find(u => u.unit === unitNumber - 1);
    if (!previousUnit) return false;
    
    return previousUnit.lessons.every(lesson => 
      completedLessonIds.includes(lesson.id)
    );
  };

  return (
    <LessonsContainer>
      <Title>Your Learning Journey with Kooka</Title>
      <Subtitle>Follow the path and unlock new skills as you progress!</Subtitle>
      
      <KookaGuide>
        <Kookaburra mood="excited" size="medium" animate />
        <KookaMessage>
          <p>{getKookaMessage()}</p>
        </KookaMessage>
      </KookaGuide>

      <SkillTreeContainer>
        {units.map((unit) => {
          const unitUnlocked = isUnitUnlocked(unit.unit);
          const unitCompleted = unit.lessons.every(lesson => 
            completedLessonIds.includes(lesson.id)
          );

          return (
            <UnitCard key={unit.unit} unlocked={unitUnlocked}>
              <UnitHeader unlocked={unitUnlocked}>
                <UnitTitle>
                  {unitCompleted && "✅ "} Unit {unit.unit}: {unit.title}
                </UnitTitle>
                <UnitDescription>{unit.description}</UnitDescription>
              </UnitHeader>
              
              {unitUnlocked && (
                <LessonsGrid>
                  {unit.lessons.map((lesson) => {
                    const lessonUnlocked = isLessonUnlocked(lesson.id, completedLessonIds);
                    const lessonCompleted = completedLessonIds.includes(lesson.id);
                    
                    return (
                      <LessonNode 
                        key={lesson.id} 
                        unlocked={lessonUnlocked}
                        completed={lessonCompleted}
                      >
                        {lessonCompleted && <CompletedBadge>✓</CompletedBadge>}
                        
                        <LessonIcon unlocked={lessonUnlocked} completed={lessonCompleted}>
                          <Kookaburra 
                            mood={lessonCompleted ? "cheering" : lessonUnlocked ? "happy" : "thinking"}
                            size="small"
                          />
                        </LessonIcon>
                        
                        <LessonTitle>{lesson.title}</LessonTitle>
                        
                        <LessonStatus>
                          {lessonCompleted ? "Completed!" : lessonUnlocked ? "Ready to learn!" : "Locked"}
                        </LessonStatus>
                        
                        {lessonUnlocked ? (
                          <Link to={`/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                            <FunButton 
                              size="small"
                              variant={lessonCompleted ? 'success' : 'primary'}
                              fullWidth
                            >
                              {lessonCompleted ? 'Practice Again' : 'Start Lesson'}
                            </FunButton>
                          </Link>
                        ) : (
                          <FunButton 
                            size="small"
                            variant="secondary"
                            disabled
                            fullWidth
                          >
                            Complete Previous
                          </FunButton>
                        )}
                      </LessonNode>
                    );
                  })}
                </LessonsGrid>
              )}
              
              {!unitUnlocked && (
                <div style={{ 
                  padding: theme.spacing.lg, 
                  textAlign: 'center',
                  color: theme.colors.textLight 
                }}>
                  <Kookaburra mood="thinking" size="medium" />
                  <p style={{ marginTop: theme.spacing.md }}>
                    Complete Unit {unit.unit - 1} to unlock this section!
                  </p>
                </div>
              )}
            </UnitCard>
          );
        })}
      </SkillTreeContainer>
    </LessonsContainer>
  );
};