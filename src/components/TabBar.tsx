import React from 'react';
import { colors, spacing, transitions, fontSize, fontWeight, borderRadius } from '../theme/theme';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  position?: 'top' | 'bottom';
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  position = 'bottom',
  variant = 'default',
  fullWidth = true,
  className = '',
  style,
}) => {
  const tabBarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: fullWidth ? 'stretch' : 'center',
    backgroundColor: colors.surface,
    borderTop: position === 'bottom' && variant === 'default' ? `1px solid ${colors.featherLight}` : 'none',
    borderBottom: position === 'top' && variant === 'default' ? `1px solid ${colors.featherLight}` : 'none',
    padding: variant === 'pills' ? spacing.sm : 0,
    gap: variant === 'pills' ? spacing.xs : 0,
    ...style,
  };

  const tabStyles = (isActive: boolean): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      flex: fullWidth ? 1 : '0 0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      padding: `${spacing.md} ${spacing.sm}`,
      minHeight: '56px',
      cursor: 'pointer',
      transition: transitions.fast,
      position: 'relative',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: fontSize.sm,
      fontWeight: isActive ? fontWeight.semibold : fontWeight.normal,
      color: isActive ? colors.primary : colors.textLight,
    };

    if (variant === 'pills') {
      return {
        ...baseStyles,
        borderRadius: borderRadius.lg,
        backgroundColor: isActive ? colors.primary : 'transparent',
        color: isActive ? 'white' : colors.textLight,
      };
    }

    if (variant === 'underline') {
      return {
        ...baseStyles,
      };
    }

    return baseStyles;
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '20px',
    width: '20px',
    height: '20px',
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    minWidth: '18px',
    height: '18px',
    padding: '0 4px',
    borderRadius: borderRadius.round,
    backgroundColor: colors.error,
    color: 'white',
    fontSize: '11px',
    fontWeight: fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={className} style={tabBarStyles} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const tabStyle = tabStyles(isActive);
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            style={tabStyle}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={(e) => {
              if (!isActive && variant !== 'pills') {
                e.currentTarget.style.backgroundColor = colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && variant !== 'pills') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.icon && <span style={iconStyles}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span style={badgeStyles}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
            {variant === 'underline' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: colors.primary,
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transition: transitions.fast,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};