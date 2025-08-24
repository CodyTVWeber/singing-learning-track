import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import { FunButton } from '../components/FunButton';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const Hero = styled.section`
  padding: ${theme.spacing.xxl} 0;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.fonts.sizes.xlarge};
  color: ${theme.colors.textLight};
  margin-bottom: ${theme.spacing.xl};
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xxl};
`;

const FeatureCard = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large};
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fonts.sizes.large};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.textLight};
  line-height: 1.6;
`;

const CTASection = styled.div`
  margin-top: ${theme.spacing.xxl};
`;

export const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Hero>
        <Title>🎵 Learn to Sing with Fun!</Title>
        <Subtitle>
          Join the musical adventure and discover your voice through playful lessons and exciting challenges!
        </Subtitle>
        <Link to="/practice">
          <FunButton size="large" variant="primary">
            Start Singing Now! 🎤
          </FunButton>
        </Link>
      </Hero>

      <Features>
        <FeatureCard className="fade-in">
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>Fun Lessons</FeatureTitle>
          <FeatureDescription>
            Learn through engaging lessons designed for all ages. From animal sounds to your favorite songs!
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard className="fade-in">
          <FeatureIcon>🏆</FeatureIcon>
          <FeatureTitle>Earn Rewards</FeatureTitle>
          <FeatureDescription>
            Collect stickers, earn points, and unlock achievements as you improve your singing skills!
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard className="fade-in">
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Track Progress</FeatureTitle>
          <FeatureDescription>
            See how far you've come with visual progress tracking and celebrate your musical journey!
          </FeatureDescription>
        </FeatureCard>
      </Features>

      <CTASection>
        <h2>Ready to become a singing star? 🌟</h2>
        <p style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg, color: theme.colors.textLight }}>
          It's free, fun, and perfect for the whole family!
        </p>
        <Link to="/lessons">
          <FunButton size="large" variant="secondary">
            Explore Lessons 📚
          </FunButton>
        </Link>
      </CTASection>
    </HomeContainer>
  );
};