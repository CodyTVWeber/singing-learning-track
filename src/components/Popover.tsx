import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, borderRadius, fontSize, shadows, transitions } from '../theme/theme';

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactElement;
  trigger?: 'click' | 'hover';
  position?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  trigger = 'click',
  position = 'bottom',
  arrow = true,
  onOpen,
  onClose,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, trigger]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);

  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const spacing = 12;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Ensure popover stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;

    if (left < margin) left = margin;
    if (left + popoverRect.width > viewportWidth - margin) {
      left = viewportWidth - popoverRect.width - margin;
    }

    if (top < margin) top = margin;
    if (top + popoverRect.height > viewportHeight - margin) {
      top = viewportHeight - popoverRect.height - margin;
    }

    setPopoverPosition({ top, left });
  };

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const popoverStyles: React.CSSProperties = {
    position: 'fixed',
    top: popoverPosition.top,
    left: popoverPosition.left,
    zIndex: 1500,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    boxShadow: shadows.xl,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    transition: transitions.fast,
    minWidth: '200px',
    maxWidth: '400px',
    ...style,
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  const getArrowStyles = (): React.CSSProperties => {
    const arrowSize = 8;
    const baseArrowStyles = { ...arrowStyles };

    switch (position) {
      case 'top':
        return {
          ...baseArrowStyles,
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0`,
          borderColor: `${colors.surface} transparent transparent`,
          filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`,
        };
      case 'bottom':
        return {
          ...baseArrowStyles,
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${colors.surface}`,
          filter: `drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1))`,
        };
      case 'left':
        return {
          ...baseArrowStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${colors.surface}`,
          filter: `drop-shadow(2px 0 4px rgba(0, 0, 0, 0.1))`,
        };
      case 'right':
        return {
          ...baseArrowStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${colors.surface} transparent transparent`,
          filter: `drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.1))`,
        };
      default:
        return baseArrowStyles;
    }
  };

  const triggerProps = trigger === 'click' 
    ? { onClick: handleToggle }
    : { 
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
      };

  return (
    <>
      <div
        ref={triggerRef}
        style={{ display: 'inline-block' }}
        {...triggerProps}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={className}
          style={popoverStyles}
          role="dialog"
          aria-modal="false"
          onMouseEnter={trigger === 'hover' ? handleOpen : undefined}
          onMouseLeave={trigger === 'hover' ? handleClose : undefined}
        >
          <div style={contentStyles}>
            {content}
          </div>
          {arrow && <div style={getArrowStyles()} />}
        </div>
      )}
    </>
  );
};