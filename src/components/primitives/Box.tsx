import React from 'react';
import { spacing, colors, borderRadius, shadows } from '../../theme/theme';

type SpacingKey = keyof typeof spacing;
type RadiusKey = keyof typeof borderRadius;
type ShadowKey = keyof typeof shadows;

type ElementTag = keyof HTMLElementTagNameMap;

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementTag;
  children?: React.ReactNode;
  // Spacing shorthands
  p?: SpacingKey | number | string;
  px?: SpacingKey | number | string;
  py?: SpacingKey | number | string;
  pt?: SpacingKey | number | string;
  pr?: SpacingKey | number | string;
  pb?: SpacingKey | number | string;
  pl?: SpacingKey | number | string;
  m?: SpacingKey | number | string;
  mx?: SpacingKey | number | string;
  my?: SpacingKey | number | string;
  mt?: SpacingKey | number | string;
  mr?: SpacingKey | number | string;
  mb?: SpacingKey | number | string;
  ml?: SpacingKey | number | string;
  // Layout
  display?: React.CSSProperties['display'];
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  gap?: SpacingKey | number | string;
  width?: React.CSSProperties['width'];
  maxWidth?: React.CSSProperties['maxWidth'];
  height?: React.CSSProperties['height'];
  // Visuals
  bg?: string;
  color?: string;
  radius?: boolean | RadiusKey | string;
  shadow?: ShadowKey;
  bordered?: boolean | string;
}

function getSpace(value?: SpacingKey | number | string): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string' && value in spacing) return spacing[value as SpacingKey];
  return String(value);
}

export const Box: React.FC<BoxProps> = ({
  as = 'div',
  children,
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  display,
  align,
  justify,
  gap,
  width,
  maxWidth,
  height,
  bg,
  color,
  radius,
  shadow,
  bordered,
  style,
  ...rest
}) => {
  const Component = as as any;

  const computedStyles: React.CSSProperties = {
    display,
    alignItems: align,
    justifyContent: justify,
    gap: getSpace(gap),
    width,
    maxWidth,
    height,
    background: bg,
    color: color || colors.text,
    borderRadius: typeof radius === 'string'
      ? (borderRadius as any)[radius] ?? radius
      : radius
        ? borderRadius.md
        : undefined,
    boxShadow: shadow ? shadows[shadow] : undefined,
    border: typeof bordered === 'string' ? bordered : bordered ? `1px solid ${colors.gray100}` : undefined,
    padding: getSpace(p),
    paddingLeft: getSpace(px) ?? getSpace(pl),
    paddingRight: getSpace(px) ?? getSpace(pr),
    paddingTop: getSpace(py) ?? getSpace(pt),
    paddingBottom: getSpace(py) ?? getSpace(pb),
    margin: getSpace(m),
    marginLeft: getSpace(mx) ?? getSpace(ml),
    marginRight: getSpace(mx) ?? getSpace(mr),
    marginTop: getSpace(my) ?? getSpace(mt),
    marginBottom: getSpace(my) ?? getSpace(mb),
    ...style,
  };

  return (
    <Component style={computedStyles} {...rest}>
      {children}
    </Component>
  );
};

export default Box;

