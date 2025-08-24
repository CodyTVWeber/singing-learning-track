import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/theme';

interface FunButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: css`
    background-color: ${theme.colors.primary};
    color: white;
    &:hover:not(:disabled) {
      background-color: #FF5555;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(255, 107, 107, 0.3);
    }
  `,
  secondary: css`
    background-color: ${theme.colors.secondary};
    color: white;
    &:hover:not(:disabled) {
      background-color: #3DBDB4;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(78, 205, 196, 0.3);
    }
  `,
  success: css`
    background-color: ${theme.colors.success};
    color: ${theme.colors.text};
    &:hover:not(:disabled) {
      background-color: #00E090;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(6, 255, 165, 0.3);
    }
  `,
  warning: css`
    background-color: ${theme.colors.warning};
    color: ${theme.colors.text};
    &:hover:not(:disabled) {
      background-color: #FFC300;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(255, 217, 61, 0.3);
    }
  `,
};

const buttonSizes = {
  small: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fonts.sizes.small};
    border-radius: ${theme.borderRadius.small};
  `,
  medium: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fonts.sizes.medium};
    border-radius: ${theme.borderRadius.medium};
  `,
  large: css`
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: ${theme.fonts.sizes.large};
    border-radius: ${theme.borderRadius.large};
  `,
};

const StyledButton = styled.button<FunButtonProps>`
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'medium' }) => buttonSizes[size]}
  
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.medium};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FunButton: React.FC<FunButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};