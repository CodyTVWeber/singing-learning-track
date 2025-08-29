import React from 'react';
import { spacing, breakpoints } from '../theme/theme';

interface GridProps {
  children: React.ReactNode;
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: keyof typeof spacing;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  style?: React.CSSProperties;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 1,
  gap = 'md',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  className = '',
  style,
}) => {
  const getColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    // For responsive columns, we'll use CSS custom properties
    return 'var(--grid-columns)';
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getColumns(),
    gap: spacing[gap],
    alignItems,
    justifyItems,
    width: '100%',
    ...style,
  };

  // Add responsive column styles if columns is an object
  if (typeof columns === 'object') {
    const responsiveStyles = `
      @media (max-width: ${breakpoints.mobile}) {
        .responsive-grid-${Date.now()} {
          --grid-columns: repeat(${columns.mobile || 1}, 1fr);
        }
      }
      @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
        .responsive-grid-${Date.now()} {
          --grid-columns: repeat(${columns.tablet || columns.mobile || 1}, 1fr);
        }
      }
      @media (min-width: ${breakpoints.tablet}) {
        .responsive-grid-${Date.now()} {
          --grid-columns: repeat(${columns.desktop || columns.tablet || columns.mobile || 1}, 1fr);
        }
      }
    `;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
        <div 
          className={`responsive-grid-${Date.now()} ${className}`} 
          style={gridStyles}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div className={className} style={gridStyles}>
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  span?: number | { mobile?: number; tablet?: number; desktop?: number };
  className?: string;
  style?: React.CSSProperties;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  span = 1,
  className = '',
  style,
}) => {
  const getSpan = () => {
    if (typeof span === 'number') {
      return span;
    }
    return 'var(--grid-span)';
  };

  const itemStyles: React.CSSProperties = {
    gridColumn: `span ${getSpan()}`,
    minWidth: 0, // Prevent grid blowout
    ...style,
  };

  // Add responsive span styles if span is an object
  if (typeof span === 'object') {
    const responsiveStyles = `
      @media (max-width: ${breakpoints.mobile}) {
        .responsive-grid-item-${Date.now()} {
          --grid-span: ${span.mobile || 1};
        }
      }
      @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
        .responsive-grid-item-${Date.now()} {
          --grid-span: ${span.tablet || span.mobile || 1};
        }
      }
      @media (min-width: ${breakpoints.tablet}) {
        .responsive-grid-item-${Date.now()} {
          --grid-span: ${span.desktop || span.tablet || span.mobile || 1};
        }
      }
    `;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
        <div 
          className={`responsive-grid-item-${Date.now()} ${className}`} 
          style={itemStyles}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div className={className} style={itemStyles}>
      {children}
    </div>
  );
};