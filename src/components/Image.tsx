import React, { useState, useEffect } from 'react';
import { borderRadius, transitions, colors } from '../theme/theme';
import { Skeleton } from './Skeleton';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean | keyof typeof borderRadius;
  lazy?: boolean;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc,
  aspectRatio,
  objectFit = 'cover',
  rounded = false,
  lazy = true,
  placeholder,
  onLoad,
  onError,
  className = '',
  style,
  children: _children,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setError(false);
    setLoading(true);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setError(false);
      setLoading(true);
    }
    onError?.();
  };

  const containerStyles: React.CSSProperties = aspectRatio ? {
    position: 'relative',
    width: '100%',
    paddingBottom: aspectRatio,
    overflow: 'hidden',
    borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                  rounded ? borderRadius.md : 0,
  } : {};

  const imageStyles: React.CSSProperties = {
    ...(aspectRatio ? {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    } : {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
    }),
    objectFit,
    borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                  rounded ? borderRadius.md : 0,
    opacity: loading ? 0 : 1,
    transition: transitions.normal,
    ...style,
  };

  const placeholderContent = placeholder || (
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height="100%"
      style={{
        borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                      rounded ? borderRadius.md : 0,
      }}
    />
  );

  if (aspectRatio) {
    return (
      <div style={containerStyles}>
        {loading && placeholderContent}
        {!error && (
          <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={imageStyles}
            loading={lazy ? 'lazy' : undefined}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
        {error && !fallbackSrc && (
          <div style={{
            ...imageStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.featherLight,
            color: colors.textLight,
          }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {loading && placeholderContent}
      {!error && (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          style={imageStyles}
          loading={lazy ? 'lazy' : undefined}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {error && !fallbackSrc && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: colors.featherLight,
          color: colors.textLight,
          borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                        rounded ? borderRadius.md : 0,
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>
          </svg>
        </div>
      )}
    </>
  );
};