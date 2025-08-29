import React from 'react';
import { colors, borderRadius, fontSize, fontWeight, shadows, transitions } from '../theme/theme';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | number;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'medium',
  shape = 'circle',
  status,
  onClick,
  className = '',
  style,
}) => {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const currentSize = typeof size === 'number' ? size : sizes[size];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: currentSize,
    height: currentSize,
    cursor: onClick ? 'pointer' : 'default',
  };

  const avatarStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: shape === 'circle' ? borderRadius.round : borderRadius.md,
    backgroundColor: src ? 'transparent' : colors.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: currentSize < 40 ? fontSize.xs : currentSize < 60 ? fontSize.sm : fontSize.md,
    fontWeight: fontWeight.semibold,
    overflow: 'hidden',
    transition: transitions.fast,
    boxShadow: onClick ? shadows.sm : 'none',
    ...style,
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const statusStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: currentSize * 0.25,
    height: currentSize * 0.25,
    borderRadius: borderRadius.round,
    border: `2px solid ${colors.surface}`,
    backgroundColor: status === 'online' ? colors.success :
                     status === 'offline' ? colors.textLight :
                     status === 'busy' ? colors.error :
                     colors.warning,
  };

  const handleClick = onClick ? () => onClick() : undefined;
  const handleKeyDown = onClick ? (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  } : undefined;

  return (
    <div className={className} style={containerStyles}>
      <div
        style={avatarStyles}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} style={imageStyles} />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width={currentSize * 0.6} height={currentSize * 0.6}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        )}
      </div>
      {status && <div style={statusStyles} aria-label={`Status: ${status}`} />}
    </div>
  );
};

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  spacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  spacing = -8,
  className = '',
  style,
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = childrenArray.length - visibleChildren.length;

  const groupStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    ...style,
  };

  const avatarWrapperStyles = (index: number): React.CSSProperties => ({
    marginLeft: index === 0 ? 0 : spacing,
    zIndex: visibleChildren.length - index,
    position: 'relative',
  });

  const remainingStyles: React.CSSProperties = {
    marginLeft: spacing,
    zIndex: 0,
    position: 'relative',
  };

  return (
    <div className={className} style={groupStyles}>
      {visibleChildren.map((child, index) => (
        <div key={index} style={avatarWrapperStyles(index)}>
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div style={remainingStyles}>
          <Avatar
            name={`+${remainingCount}`}
            size={React.isValidElement(visibleChildren[0]) ? visibleChildren[0].props.size : 'medium'}
          />
        </div>
      )}
    </div>
  );
};