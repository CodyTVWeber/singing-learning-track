import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, shadows, transitions } from '../theme/theme';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  arrow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  arrow = true,
  className = '',
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    zIndex: 9999,
    backgroundColor: colors.darkBrown,
    color: 'white',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.sm,
    boxShadow: shadows.lg,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transform: isVisible ? 'scale(1)' : 'scale(0.9)',
    transition: transitions.fast,
    pointerEvents: 'none',
    maxWidth: '300px',
    wordWrap: 'break-word',
    ...style,
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  const getArrowStyles = (): React.CSSProperties => {
    const arrowSize = 6;
    const baseArrowStyles = { ...arrowStyles };

    switch (position) {
      case 'top':
        return {
          ...baseArrowStyles,
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0`,
          borderColor: `${colors.darkBrown} transparent transparent`,
        };
      case 'bottom':
        return {
          ...baseArrowStyles,
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${colors.darkBrown}`,
        };
      case 'left':
        return {
          ...baseArrowStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${colors.darkBrown}`,
        };
      case 'right':
        return {
          ...baseArrowStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${colors.darkBrown} transparent transparent`,
        };
      default:
        return baseArrowStyles;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={className}
          style={tooltipStyles}
          role="tooltip"
        >
          {content}
          {arrow && <div style={getArrowStyles()} />}
        </div>
      )}
    </>
  );
};