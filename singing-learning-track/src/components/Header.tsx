import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useUser } from '../contexts/UserContext';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.white};
  box-shadow: ${theme.shadows.small};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${theme.fonts.sizes.xlarge};
  font-weight: 700;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    color: ${theme.colors.secondary};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    gap: ${theme.spacing.md};
  }
`;

const NavLink = styled(Link)`
  font-size: ${theme.fonts.sizes.medium};
  font-weight: 500;
  color: ${theme.colors.text};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.small};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.white};
  }
  
  &.active {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  font-size: ${theme.fonts.sizes.medium};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const PointsBadge = styled.div`
  background-color: ${theme.colors.warning};
  color: ${theme.colors.text};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-weight: 600;
`;

export const Header: React.FC = () => {
  const { user } = useUser();
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          🎵 SingTrack
        </Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/lessons">Lessons</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/progress">Progress</NavLink>
        </Nav>
        {user && (
          <UserInfo>
            <span>Hi, {user.name}!</span>
            <PointsBadge>⭐ {user.totalPoints} pts</PointsBadge>
          </UserInfo>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};