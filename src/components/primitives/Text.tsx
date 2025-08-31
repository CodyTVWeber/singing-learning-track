import React from 'react';
import { colors, fontSize, fontWeight } from '../../theme/theme';

type FontSizeKey = keyof typeof fontSize;
type FontWeightKey = keyof typeof fontWeight;

type TextTag = 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextTag;
  children: React.ReactNode;
  size?: FontSizeKey;
  weight?: FontWeightKey;
  color?: string;
  align?: 'left' | 'center' | 'right';
  muted?: boolean;
  truncate?: boolean;
}

export const Text: React.FC<TextProps> = ({
  as = 'p',
  children,
  size = 'md',
  weight = 'normal',
  color: colorProp,
  align,
  muted = false,
  truncate = false,
  style,
  ...rest
}) => {
  const Component = as as any;

  const styles: React.CSSProperties = {
    fontSize: fontSize[size],
    fontWeight: fontWeight[weight],
    color: colorProp || (muted ? colors.textLight : colors.text),
    textAlign: align,
    ...(truncate ? {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } : {}),
    ...style,
  };

  return (
    <Component style={styles} {...rest}>
      {children}
    </Component>
  );
};

export default Text;

