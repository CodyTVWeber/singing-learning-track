import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';

interface KookaburraProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'singing' | 'cheering';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  onClick?: () => void;
}

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
`;

const blink = keyframes`
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
`;

const sing = keyframes`
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.2); }
`;

const KookaburraContainer = styled.div<{ size: string; animate?: boolean }>`
  position: relative;
  cursor: pointer;
  user-select: none;
  display: inline-block;
  
  ${props => {
    const sizes = {
      small: { width: '80px', height: '80px' },
      medium: { width: '120px', height: '120px' },
      large: { width: '160px', height: '160px' }
    };
    return css`
      width: ${sizes[props.size as keyof typeof sizes].width};
      height: ${sizes[props.size as keyof typeof sizes].height};
    `;
  }}
  
  ${props => props.animate && css`
    animation: ${bounce} 2s ease-in-out infinite;
  `}
`;

const Head = styled.div`
  position: absolute;
  width: 60%;
  height: 50%;
  background: ${theme.colors.tertiary};
  border-radius: 50% 50% 40% 40%;
  top: 15%;
  left: 20%;
  border: 3px solid ${theme.colors.darkBrown};
  z-index: 10;
`;

const Beak = styled.div<{ mood: string }>`
  position: absolute;
  width: 35%;
  height: 15%;
  background: ${theme.colors.darkBrown};
  top: 35%;
  left: 32.5%;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  z-index: 11;
  transform-origin: right center;
  
  ${props => props.mood === 'singing' && css`
    animation: ${sing} 1s ease-in-out infinite;
  `}
`;

const Eye = styled.div<{ side: 'left' | 'right' }>`
  position: absolute;
  width: 8%;
  height: 8%;
  background: ${theme.colors.darkBrown};
  border-radius: 50%;
  top: 30%;
  ${props => props.side === 'left' ? 'left: 35%' : 'right: 35%'};
  z-index: 12;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${theme.colors.darkBrown};
    border-radius: 50%;
    animation: ${blink} 4s ease-in-out infinite;
  }
`;

const Body = styled.div`
  position: absolute;
  width: 70%;
  height: 50%;
  background: ${theme.colors.secondary};
  border-radius: 50% 50% 45% 45%;
  bottom: 10%;
  left: 15%;
  border: 3px solid ${theme.colors.darkBrown};
  z-index: 5;
  
  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 70%;
    background: ${theme.colors.tertiary};
    border-radius: 50%;
    top: 20%;
    left: 20%;
  }
`;

const Wing = styled.div<{ side: 'left' | 'right' }>`
  position: absolute;
  width: 30%;
  height: 40%;
  background: ${theme.colors.primary};
  border-radius: 70% 30% 50% 50%;
  bottom: 20%;
  ${props => props.side === 'left' ? 'left: 5%' : 'right: 5%'};
  border: 3px solid ${theme.colors.darkBrown};
  z-index: 4;
  transform-origin: ${props => props.side === 'left' ? 'right' : 'left'} center;
  
  &:hover {
    animation: ${wiggle} 0.5s ease-in-out;
  }
`;

const Tail = styled.div`
  position: absolute;
  width: 35%;
  height: 30%;
  background: ${theme.colors.primary};
  border-radius: 30% 70% 50% 50%;
  bottom: 5%;
  right: 10%;
  border: 3px solid ${theme.colors.darkBrown};
  z-index: 3;
  transform: rotate(-30deg);
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    background: ${theme.colors.earthTone};
    border-radius: 30% 70% 50% 50%;
    border: 2px solid ${theme.colors.darkBrown};
  }
  
  &::before {
    top: -5px;
    left: 10px;
    transform: rotate(15deg);
  }
  
  &::after {
    top: -10px;
    left: 20px;
    transform: rotate(30deg);
  }
`;

const Flower = styled.div`
  position: absolute;
  width: 20%;
  height: 20%;
  top: 20%;
  right: 20%;
  z-index: 13;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${theme.colors.accent};
    border-radius: 50%;
    box-shadow: 
      -8px -8px 0 ${theme.colors.accent},
      8px -8px 0 ${theme.colors.accent},
      -8px 8px 0 ${theme.colors.accent},
      8px 8px 0 ${theme.colors.accent};
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 40%;
    height: 40%;
    background: ${theme.colors.error};
    border-radius: 50%;
    top: 30%;
    left: 30%;
    z-index: 1;
  }
`;

const MoodIndicator = styled.div<{ mood: string }>`
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  
  ${props => props.mood === 'excited' && css`
    animation: ${bounce} 0.5s ease-in-out infinite;
  `}
`;

export const Kookaburra: React.FC<KookaburraProps> = ({ 
  mood = 'happy', 
  size = 'medium', 
  animate = false,
  onClick 
}) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy': return '😊';
      case 'excited': return '🎉';
      case 'thinking': return '🤔';
      case 'singing': return '🎵';
      case 'cheering': return '⭐';
      default: return '😊';
    }
  };

  return (
    <KookaburraContainer size={size} animate={animate} onClick={onClick}>
      <MoodIndicator mood={mood}>{getMoodEmoji()}</MoodIndicator>
      <Head />
      <Eye side="left" />
      <Eye side="right" />
      <Beak mood={mood} />
      <Body />
      <Wing side="left" />
      <Wing side="right" />
      <Tail />
      <Flower />
    </KookaburraContainer>
  );
};