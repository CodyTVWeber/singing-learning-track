import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from './Icon';
import { colors, shadows, spacing, gradients } from '../theme/theme';

interface FloatingLogoutButtonProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({ position = 'bottom-right' }) => {
  const navigate = useNavigate();
  const { logout } = useApp();

  const isTop = position === 'top-right' || position === 'top-left';
  const isLeft = position === 'top-left' || position === 'bottom-left';

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    right: isLeft ? undefined : spacing.xl,
    left: isLeft ? spacing.xl : undefined,
    bottom: isTop ? undefined : spacing.xl,
    top: isTop ? spacing.xl : undefined,
    zIndex: 10000,
  };

  const buttonStyles: React.CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: gradients.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.xl,
    cursor: 'pointer',
    border: 'none',
  };

  const handleClick = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={containerStyles}>
      <button onClick={handleClick} aria-label="Log out" style={buttonStyles}>
        <Icon name="logout" size={22} color={colors.textOnSecondary} />
      </button>
    </div>
  );
};

