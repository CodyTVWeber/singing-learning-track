import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { FunButton } from './FunButton';
import { User } from '../types';

interface UserOnboardingProps {
  onComplete: (name: string, ageGroup: User['ageGroup']) => void;
}

const OnboardingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const OnboardingCard = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
`;

const Title = styled.h2`
  font-size: ${theme.fonts.sizes.xxlarge};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  font-size: ${theme.fonts.sizes.large};
  border: 2px solid ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  
  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const AgeGroupContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  justify-content: center;
`;

const AgeGroupButton = styled.button<{ selected: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${({ selected }) => selected ? theme.colors.primary : theme.colors.secondary};
  background-color: ${({ selected }) => selected ? theme.colors.primary : theme.colors.white};
  color: ${({ selected }) => selected ? theme.colors.white : theme.colors.text};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.fonts.sizes.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.small};
  }
`;

const Emoji = styled.span`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
  display: block;
`;

export const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<User['ageGroup'] | null>(null);

  const handleSubmit = () => {
    if (name.trim() && ageGroup) {
      onComplete(name.trim(), ageGroup);
    }
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <Emoji>🎤</Emoji>
        <Title>Welcome to SingTrack!</Title>
        <p style={{ marginBottom: theme.spacing.lg, color: theme.colors.textLight }}>
          Let's get to know you better so we can personalize your singing journey!
        </p>
        
        <Input
          type="text"
          placeholder="What's your name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        
        <p style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
          Select your age group:
        </p>
        
        <AgeGroupContainer>
          <AgeGroupButton
            selected={ageGroup === 'kid'}
            onClick={() => setAgeGroup('kid')}
          >
            👶 Kid (4-12)
          </AgeGroupButton>
          <AgeGroupButton
            selected={ageGroup === 'teen'}
            onClick={() => setAgeGroup('teen')}
          >
            🧑 Teen (13-17)
          </AgeGroupButton>
          <AgeGroupButton
            selected={ageGroup === 'adult'}
            onClick={() => setAgeGroup('adult')}
          >
            👨 Adult (18+)
          </AgeGroupButton>
        </AgeGroupContainer>
        
        <FunButton
          size="large"
          variant="primary"
          onClick={handleSubmit}
          disabled={!name.trim() || !ageGroup}
          fullWidth
        >
          Let's Start Singing! 🎵
        </FunButton>
      </OnboardingCard>
    </OnboardingContainer>
  );
};