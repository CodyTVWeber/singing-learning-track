import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from './Icon';
import { colors, shadows, spacing, gradients } from '../theme/theme';

interface FloatingLogoutButtonProps {
  position?: 'top-right' | 'bottom-right';
}

export const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({ position = 'bottom-right' }) => {
  const navigate = useNavigate();
  const { logout } = useApp();

  const isTop = position === 'top-right';

  const buttonStyles: React.CSSProperties = {
    position: 'fixed',
    right: spacing.xl,
    bottom: isTop ? undefined : spacing.xl,
    top: isTop ? spacing.xl : undefined,
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
    zIndex: 2000,
  };

  const handleClick = async () => {
    await logout();
    navigate('/');
  };

  return (
    <button onClick={handleClick} aria-label="Log out" style={buttonStyles}>
      <Icon name="logout" size={22} color={colors.textOnSecondary} />
    </button>
  );
};

