import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Kookaburra } from './Kookaburra';

interface KookaburraCompanionProps {
  message?: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'singing' | 'cheering';
  tips?: string[];
  encouragements?: string[];
  position?: 'floating' | 'static';
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const FloatingContainer = styled.div<{ position: string }>`
  ${props => props.position === 'floating' ? `
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 900;
    animation: ${float} 3s ease-in-out infinite;
  ` : `
    position: relative;
    margin: ${theme.spacing.lg} auto;
  `}
`;

const CompanionWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  animation: ${slideIn} 0.5s ease-out;
`;

const SpeechBubble = styled.div`
  background: ${theme.colors.surface};
  border: 3px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.md};
  max-width: 250px;
  position: relative;
  box-shadow: ${theme.shadows.medium};
  
  &::before {
    content: '';
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid ${theme.colors.primary};
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -11px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 11px solid ${theme.colors.surface};
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
`;

const Message = styled.p`
  color: ${theme.colors.text};
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.sm} 0 0 0;
`;

const TipItem = styled.li`
  color: ${theme.colors.textLight};
  font-size: 13px;
  padding: ${theme.spacing.xs} 0;
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
  
  &::before {
    content: '💡';
    flex-shrink: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.xs};
  right: ${theme.spacing.xs};
  background: transparent;
  border: none;
  font-size: 20px;
  color: ${theme.colors.textLight};
  padding: 4px;
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.text};
  }
`;

const defaultEncouragements = [
  "You're doing great! Keep singing! 🎵",
  "Every practice makes you better! 🌟",
  "I love hearing you sing! 🎤",
  "You're a natural performer! 🎭",
  "Your voice is getting stronger! 💪",
  "Keep up the amazing work! 🌈",
];

const defaultTips = [
  "Remember to breathe from your belly!",
  "Stand up straight for better sound",
  "Smile while you sing - it helps!",
  "Warm up your voice first",
  "Practice makes perfect!",
];

export const KookaburraCompanion: React.FC<KookaburraCompanionProps> = ({
  message,
  mood = 'happy',
  tips = [],
  encouragements = [],
  position = 'floating',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [currentMood, setCurrentMood] = useState(mood);
  
  useEffect(() => {
    if (!message && encouragements.length === 0) {
      // Show random encouragement every 30 seconds
      const interval = setInterval(() => {
        const randomEncouragement = defaultEncouragements[
          Math.floor(Math.random() * defaultEncouragements.length)
        ];
        setCurrentMessage(randomEncouragement);
        setCurrentMood(Math.random() > 0.5 ? 'cheering' : 'happy');
        setIsVisible(true);
        
        // Hide after 5 seconds
        setTimeout(() => {
          if (!message) setIsVisible(false);
        }, 5000);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [message, encouragements]);
  
  if (!isVisible && position === 'floating') return null;
  
  const displayTips = tips.length > 0 ? tips : (position === 'static' ? defaultTips.slice(0, 3) : []);
  
  return (
    <FloatingContainer position={position}>
      <CompanionWrapper>
        {position === 'floating' && (
          <SpeechBubble>
            {position === 'floating' && (
              <CloseButton onClick={() => setIsVisible(false)}>×</CloseButton>
            )}
            <Message>{currentMessage || "Hi! I'm Kooky, your singing buddy!"}</Message>
            {displayTips.length > 0 && (
              <TipsList>
                {displayTips.map((tip, index) => (
                  <TipItem key={index}>{tip}</TipItem>
                ))}
              </TipsList>
            )}
          </SpeechBubble>
        )}
        <Kookaburra mood={currentMood} size="medium" animate={position === 'floating'} />
        {position === 'static' && (
          <SpeechBubble>
            <Message>{currentMessage || "Ready to sing together?"}</Message>
            {displayTips.length > 0 && (
              <TipsList>
                {displayTips.map((tip, index) => (
                  <TipItem key={index}>{tip}</TipItem>
                ))}
              </TipsList>
            )}
          </SpeechBubble>
        )}
      </CompanionWrapper>
    </FloatingContainer>
  );
};