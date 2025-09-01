import React, { useMemo } from 'react';
import { shadows } from '../theme/theme';

interface KookaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  size?: number | string;
  hover?: boolean;
  shadow?: boolean;
}

const KOOKA_IMAGES = [
  '/img/kooka-burra-waiving.png',
  '/img/kooka-burra-singing.png',
  '/img/kooka-burra-dancing.png',
  '/img/kooka-burra-flying.png',
];

export const KookaImage: React.FC<KookaImageProps> = ({
  src,
  size = 400,
  hover = true,
  shadow: useShadow = true,
  style,
  ...rest
}) => {
  const chosenSrc = useMemo(() => src || KOOKA_IMAGES[Math.floor(Math.random() * KOOKA_IMAGES.length)], [src]);

  const width = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src={chosenSrc}
      alt={rest.alt || 'Kooka the Kookaburra'}
      {...rest}
      style={{
        width,
        filter: useShadow ? `drop-shadow(${shadows.xl})` : undefined,
        transform: 'rotate(-3deg)',
        transition: hover ? 'transform 0.3s ease' : undefined,
        cursor: hover ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'rotate(-3deg) scale(1)';
      }}
    />
  );
};

export default KookaImage;

