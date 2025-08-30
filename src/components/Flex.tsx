import React from 'react';
import { spacing } from '../theme/theme';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: keyof typeof spacing;
  fullWidth?: boolean;
  fullHeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap,
  fullWidth = false,
  fullHeight = false,
  className = '',
  style,
}) => {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
  };

  const flexStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justifyMap[justify],
    alignItems: alignMap[align],
    gap: gap ? spacing[gap] : undefined,
    width: fullWidth ? '100%' : undefined,
    height: fullHeight ? '100%' : undefined,
    ...style,
  };

  return (
    <div className={className} style={flexStyles}>
      {children}
    </div>
  );
};