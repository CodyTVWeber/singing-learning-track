import React from 'react';
import { spacing } from '../../theme/theme';

type SpacingKey = keyof typeof spacing;

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: SpacingKey;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  gap,
  fullWidth = false,
  fullHeight = false,
  style,
  ...rest
}) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap,
    gap: gap ? spacing[gap] : undefined,
    width: fullWidth ? '100%' : undefined,
    height: fullHeight ? '100%' : undefined,
    ...style,
  };

  return (
    <div style={styles} {...rest}>
      {children}
    </div>
  );
};

export default Stack;

