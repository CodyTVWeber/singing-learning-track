import React, { useRef, useState } from 'react';
import { colors, spacing, borderRadius, shadows, transitions } from '../theme/theme';
import { IconButton } from './Icon';

interface VideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  rounded?: boolean | keyof typeof borderRadius;
  className?: string;
  style?: React.CSSProperties;
}

export const Video: React.FC<VideoProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  width,
  height,
  aspectRatio,
  rounded = false,
  className = '',
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(!controls);

  const containerStyles: React.CSSProperties = aspectRatio ? {
    position: 'relative',
    width: width || '100%',
    paddingBottom: aspectRatio,
    backgroundColor: colors.darkBrown,
    borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                  rounded ? borderRadius.md : 0,
    overflow: 'hidden',
  } : {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: colors.darkBrown,
    borderRadius: typeof rounded === 'string' ? borderRadius[rounded] : 
                  rounded ? borderRadius.md : 0,
    overflow: 'hidden',
  };

  const videoStyles: React.CSSProperties = {
    ...(aspectRatio ? {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    } : {
      width: '100%',
      height: '100%',
    }),
    objectFit: 'contain',
    ...style,
  };

  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: showControls || !isPlaying ? 1 : 0,
    transition: transitions.normal,
    cursor: 'pointer',
  };

  const playButtonStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.round,
    padding: spacing.md,
    boxShadow: shadows.lg,
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    if (!controls) {
      handlePlayPause();
    }
  };

  return (
    <div 
      className={className} 
      style={containerStyles}
      onMouseEnter={() => !controls && setShowControls(true)}
      onMouseLeave={() => !controls && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        style={videoStyles}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={handleVideoClick}
      />
      
      {!controls && (
        <div 
          style={overlayStyles}
          onClick={handlePlayPause}
        >
          {(!isPlaying || showControls) && (
            <div style={playButtonStyles}>
              <IconButton
                icon={isPlaying ? 'pause' : 'play'}
                onClick={handlePlayPause}
                size="large"
                color="white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};