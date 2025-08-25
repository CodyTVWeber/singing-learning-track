import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useUser } from '../contexts/UserContext';
import { Kookaburra } from './Kookaburra';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.surface};
  padding: ${theme.spacing.md};
  padding-top: calc(${theme.spacing.md} + env(safe-area-inset-top));
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid ${theme.colors.tertiary};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Greeting = styled.span`
  font-size: 14px;
  color: ${theme.colors.textLight};
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${theme.colors.tertiary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
`;

const KookaburraWrapper = styled.div`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
`;

export const MobileHeader: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <UserSection>
          <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
          <UserInfo>
            <Greeting>{getTimeOfDay()},</Greeting>
            <UserName>{user.name}!</UserName>
          </UserInfo>
        </UserSection>
        
        <StatsSection>
          <StatBadge>
            <span>K-points</span>
            <span>{user.totalPoints}</span>
          </StatBadge>
          <StatBadge>
            <span>K-streak</span>
            <span>{user.streak || 0}</span>
          </StatBadge>
        </StatsSection>
      </HeaderContent>
    </HeaderContainer>
  );
};