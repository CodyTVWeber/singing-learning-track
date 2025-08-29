import React from 'react';
import { spacing } from '../theme/theme';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: keyof typeof spacing;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = '1200px',
  padding = 'md',
  className = '',
  style 
}) => {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding: spacing[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
};