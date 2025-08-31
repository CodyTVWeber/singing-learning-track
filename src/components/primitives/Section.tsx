import React from 'react';
import { gradients, spacing, colors } from '../../theme/theme';
import { Container } from '../Container';

type Variant = 'plain' | 'soft' | 'warm';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: Variant;
  padding?: keyof typeof spacing;
  center?: boolean;
  container?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'plain',
  padding = 'xl',
  center = false,
  container = false,
  style,
  ...rest
}) => {
  const background = variant === 'soft' ? gradients.soft
    : variant === 'warm' ? gradients.warm
    : undefined;

  const content = container ? (
    <Container>
      {children}
    </Container>
  ) : children;

  return (
    <div
      style={{
        background,
        color: colors.text,
        padding: spacing[padding],
        display: center ? 'flex' : undefined,
        alignItems: center ? 'center' : undefined,
        justifyContent: center ? 'center' : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {content}
    </div>
  );
};

export default Section;

