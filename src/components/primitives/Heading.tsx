import React from 'react';
import { colors, fontSize, fontWeight, gradients, spacing } from '../../theme/theme';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  children: React.ReactNode;
  size?: keyof typeof fontSize;
  weight?: keyof typeof fontWeight;
  align?: 'left' | 'center' | 'right';
  gradient?: boolean;
  color?: string;
  mb?: keyof typeof spacing;
}

const levelToSize: Record<Level, keyof typeof fontSize> = {
  1: 'huge',
  2: 'xxxl',
  3: 'xxl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  children,
  size,
  weight = 'extrabold',
  align,
  gradient: useGradient = false,
  color,
  mb,
  style,
  ...rest
}) => {
  const Tag = (`h${level}`) as keyof JSX.IntrinsicElements;
  const fontSizeKey = size ?? levelToSize[level];

  const styles: React.CSSProperties = {
    fontSize: fontSize[fontSizeKey],
    fontWeight: fontWeight[weight],
    textAlign: align,
    margin: 0,
    marginBottom: mb ? spacing[mb] : undefined,
    ...(useGradient ? {
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : {
      color: color || colors.text,
    }),
    ...style,
  };

  return (
    <Tag style={styles} {...rest}>
      {children}
    </Tag>
  );
};

export default Heading;

