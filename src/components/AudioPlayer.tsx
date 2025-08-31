import React, { useRef, useState, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme/theme';
import { IconButton } from './Icon';
import { Progress } from './Progress';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  cover?: string;
  autoPlay?: boolean;
  loop?: boolean;
  variant?: 'simple' | 'full';
  onPlay?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  artist,
  cover,
  autoPlay = false,
  loop = false,
  variant = 'simple',
  onPlay,
  className = '',
  style,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    const updateDuration = () => {
      let d = audio.duration;
      if (!Number.isFinite(d) || isNaN(d) || d === Infinity) {
        try {
          if (audio.seekable && audio.seekable.length > 0) {
            d = audio.seekable.end(audio.seekable.length - 1);
          } else {
            d = 0;
          }
        } catch (_) {
          d = 0;
        }
      }
      setDuration(d);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || isNaN(time) || time <= 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (variant === 'simple') {
    const simpleStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      ...style,
    };

    return (
      <div className={className} style={simpleStyles}>
        <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />
        
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          onClick={handlePlayPause}
          size="medium"
        />
        
        <div style={{ flex: 1 }}>
          <Progress
            value={currentTime}
            max={duration}
            size="small"
            color={colors.primary}
          />
        </div>
        
        <span style={{ fontSize: fontSize.sm, color: colors.textLight, minWidth: '80px', textAlign: 'right' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    );
  }

  // Full variant
  const containerStyles: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    overflow: 'hidden',
    maxWidth: '400px',
    ...style,
  };

  const coverStyles: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  };

  const artistStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.lg,
  };

  const progressContainerStyles: React.CSSProperties = {
    marginBottom: spacing.md,
  };

  const timeStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.xs,
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  };

  const volumeContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const volumeSliderStyles: React.CSSProperties = {
    width: '100px',
    height: '4px',
    borderRadius: borderRadius.round,
    backgroundColor: colors.featherLight,
    cursor: 'pointer',
    appearance: 'none',
    outline: 'none',
  };

  return (
    <div className={className} style={containerStyles}>
      <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />
      
      {cover ? (
        <img src={cover} alt={title || 'Album cover'} style={coverStyles} />
      ) : (
        <div style={coverStyles}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
      )}
      
      <div style={contentStyles}>
        {title && <div style={titleStyles}>{title}</div>}
        {artist && <div style={artistStyles}>{artist}</div>}
        
        <div style={progressContainerStyles}>
          <div onClick={handleSeek} style={{ cursor: 'pointer' }}>
            <Progress
              value={currentTime}
              max={duration}
              size="small"
              color={colors.primary}
            />
          </div>
          <div style={timeStyles}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div style={controlsStyles}>
          <IconButton
            icon="skipPrevious"
            onClick={() => {}}
            size="small"
          />
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            onClick={handlePlayPause}
            size="large"
          />
          <IconButton
            icon="skipNext"
            onClick={() => {}}
            size="small"
          />
        </div>
        
        <div style={volumeContainerStyles}>
          <IconButton
            icon={isMuted ? 'volumeOff' : 'volumeUp'}
            onClick={toggleMute}
            size="small"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={volumeSliderStyles}
          />
        </div>
      </div>
    </div>
  );
};