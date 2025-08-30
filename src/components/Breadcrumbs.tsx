import React from 'react';
import { colors, spacing, transitions, fontSize } from '../theme/theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  onItemClick,
  className = '',
  style,
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    fontSize: fontSize.sm,
    ...style,
  };

  const itemStyles = (isLast: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    color: isLast ? colors.text : colors.textLight,
    cursor: isLast ? 'default' : 'pointer',
    transition: transitions.fast,
    textDecoration: 'none',
  });

  const separatorStyles: React.CSSProperties = {
    color: colors.textLight,
    opacity: 0.5,
  };

  const iconStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <nav className={className} style={containerStyles} aria-label="Breadcrumb">
      <ol style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && (
                <span style={separatorStyles} aria-hidden="true">
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  style={itemStyles(isLast)}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick?.(item, index);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textLight;
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span style={iconStyles}>{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span 
                  style={itemStyles(isLast)}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span style={iconStyles}>{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};