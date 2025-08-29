import React, { useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';
import { Icon } from './Icon';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  variant = 'default',
  className = '',
  style,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    ...style,
  };

  const itemStyles: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: variant === 'separated' ? borderRadius.md : 0,
    marginBottom: variant === 'separated' ? spacing.sm : 0,
    border: variant === 'bordered' ? `1px solid ${colors.featherLight}` : 'none',
    borderBottom: variant === 'default' ? `1px solid ${colors.featherLight}` : undefined,
    overflow: 'hidden',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: transitions.fast,
  };

  const titleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  };

  const iconStyles: React.CSSProperties = {
    transition: transitions.normal,
    color: colors.textLight,
  };

  const contentStyles: React.CSSProperties = {
    overflow: 'hidden',
    transition: transitions.normal,
  };

  const contentInnerStyles: React.CSSProperties = {
    padding: `0 ${spacing.md} ${spacing.md} ${spacing.md}`,
    color: colors.textLight,
    fontSize: fontSize.sm,
    lineHeight: 1.6,
  };

  return (
    <div className={className} style={containerStyles}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id);
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            style={{
              ...itemStyles,
              borderBottom: variant === 'default' && isLast ? 'none' : itemStyles.borderBottom,
            }}
          >
            <button
              style={headerStyles}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={titleContainerStyles}>
                {item.icon}
                <span style={titleStyles}>{item.title}</span>
              </div>
              <div
                style={{
                  ...iconStyles,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <Icon name="down" size="small" />
              </div>
            </button>
            
            <div
              id={`accordion-content-${item.id}`}
              style={{
                ...contentStyles,
                maxHeight: isExpanded ? '500px' : '0',
                opacity: isExpanded ? 1 : 0,
              }}
              aria-hidden={!isExpanded}
            >
              <div style={contentInnerStyles}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  className = '',
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const containerStyles: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.featherLight}`,
    overflow: 'hidden',
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: transitions.fast,
  };

  const titleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  };

  const contentStyles: React.CSSProperties = {
    maxHeight: isExpanded ? '500px' : '0',
    opacity: isExpanded ? 1 : 0,
    overflow: 'hidden',
    transition: transitions.normal,
  };

  const contentInnerStyles: React.CSSProperties = {
    padding: `0 ${spacing.md} ${spacing.md} ${spacing.md}`,
  };

  return (
    <div className={className} style={containerStyles}>
      <button
        style={headerStyles}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.background;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={titleContainerStyles}>
          {icon}
          <span style={titleStyles}>{title}</span>
        </div>
        <Icon
          name="down"
          size="small"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: transitions.normal,
          }}
        />
      </button>
      
      <div style={contentStyles}>
        <div style={contentInnerStyles}>
          {children}
        </div>
      </div>
    </div>
  );
};