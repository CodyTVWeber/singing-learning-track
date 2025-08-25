import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { AudioRecorder } from '../components/AudioRecorder';

const PracticeContainer = styled.div`
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

const Instructions = styled.div`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.white};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  font-size: ${theme.fonts.sizes.large};
`;

export const Practice: React.FC = () => {
  return (
    <PracticeContainer>
      <Title>Practice with Kooka</Title>
      <Instructions>
        Welcome to Kooka's practice room! Click the record button and sing your heart out! 
        Don't worry about being perfect - just have fun exploring your voice!
      </Instructions>
      <AudioRecorder />
    </PracticeContainer>
  );
};