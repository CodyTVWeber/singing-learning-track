import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/lessons', label: 'Learn', icon: '📚' },
  { path: '/practice', label: 'Practice', icon: '🎤' },
  { path: '/progress', label: 'Progress', icon: '📊' },
];

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.surface};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
`;

const NavItemButton = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$isActive && `
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 4px;
      background: ${theme.colors.primary};
      border-radius: 2px;
    }
  `}
`;

const IconWrapper = styled.div<{ $isActive: boolean }>`
  font-size: 24px;
  transform: ${props => props.$isActive ? 'scale(1.2)' : 'scale(1)'};
  transition: transform 0.3s ease;
`;

const Label = styled.span<{ $isActive: boolean }>`
  font-size: 12px;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  color: ${props => props.$isActive ? theme.colors.primary : theme.colors.textLight};
`;

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <BottomNav>
      <NavContainer>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavItemButton
              key={item.path}
              to={item.path}
              $isActive={isActive}
            >
              <IconWrapper $isActive={isActive}>
                {item.icon}
              </IconWrapper>
              <Label $isActive={isActive}>
                {item.label}
              </Label>
            </NavItemButton>
          );
        })}
      </NavContainer>
    </BottomNav>
  );
};