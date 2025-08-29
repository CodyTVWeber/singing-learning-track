import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, transitions } from '../theme/theme';
import { IconButton } from './Icon';

interface ScrollToTopProps {
  showAfter?: number;
  position?: 'bottom-right' | 'bottom-left';
  smooth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  showAfter = 300,
  position = 'bottom-right',
  smooth = true,
  className = '',
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > showAfter);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const buttonStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing.xl,
    [position === 'bottom-right' ? 'right' : 'left']: spacing.xl,
    backgroundColor: colors.primary,
    color: 'white',
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.round,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.lg,
    cursor: 'pointer',
    border: 'none',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: transitions.normal,
    zIndex: 1000,
    ...style,
  };

  return (
    <button
      className={className}
      style={buttonStyles}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadows.xl;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
        e.currentTarget.style.boxShadow = shadows.lg;
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    </button>
  );
};

interface ScrollAreaProps {
  children: React.ReactNode;
  height?: string | number;
  showScrollbar?: 'always' | 'hover' | 'auto';
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  height = '400px',
  showScrollbar = 'auto',
  className = '',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyles: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    ...style,
  };

  const scrollbarStyles = showScrollbar === 'hover' ? `
    .scroll-area-${Date.now()}::-webkit-scrollbar {
      width: 8px;
      opacity: ${isHovered ? 1 : 0};
      transition: opacity 0.3s;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-track {
      background: ${colors.background};
      border-radius: 4px;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-thumb {
      background: ${colors.featherLight};
      border-radius: 4px;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-thumb:hover {
      background: ${colors.textLight};
    }
  ` : showScrollbar === 'always' ? `
    .scroll-area-${Date.now()}::-webkit-scrollbar {
      width: 8px;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-track {
      background: ${colors.background};
      border-radius: 4px;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-thumb {
      background: ${colors.featherLight};
      border-radius: 4px;
    }
    
    .scroll-area-${Date.now()}::-webkit-scrollbar-thumb:hover {
      background: ${colors.textLight};
    }
  ` : '';

  return (
    <>
      {scrollbarStyles && <style>{scrollbarStyles}</style>}
      <div
        className={`scroll-area-${Date.now()} ${className}`}
        style={containerStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
    </>
  );
};