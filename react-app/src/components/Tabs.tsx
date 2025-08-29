import React, { useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
  style,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    ...style,
  };

  const tabListStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    borderBottom: variant === 'default' ? `2px solid ${colors.featherLight}` : 'none',
    marginBottom: variant === 'pills' ? spacing.md : 0,
    gap: variant === 'pills' ? spacing.sm : 0,
    padding: variant === 'pills' ? spacing.sm : 0,
    backgroundColor: variant === 'pills' ? colors.background : 'transparent',
    borderRadius: variant === 'pills' ? borderRadius.lg : 0,
  };

  const tabStyles = (isActive: boolean, isDisabled: boolean): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      flex: fullWidth ? 1 : '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: transitions.fast,
      position: 'relative',
      fontSize: fontSize.md,
      fontWeight: isActive ? fontWeight.semibold : fontWeight.normal,
      color: isActive ? colors.primary : colors.textLight,
    };

    if (variant === 'pills') {
      return {
        ...baseStyles,
        borderRadius: borderRadius.md,
        backgroundColor: isActive ? colors.primary : 'transparent',
        color: isActive ? 'white' : colors.textLight,
      };
    }

    if (variant === 'underline') {
      return {
        ...baseStyles,
        borderBottom: `3px solid ${isActive ? colors.primary : 'transparent'}`,
        marginBottom: '-2px',
      };
    }

    // Default variant
    return {
      ...baseStyles,
      borderBottom: `2px solid ${isActive ? colors.primary : 'transparent'}`,
      marginBottom: '-2px',
    };
  };

  const iconStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tabPanelStyles: React.CSSProperties = {
    padding: spacing.lg,
    animation: 'fadeIn 0.3s ease-in-out',
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={className} style={containerStyles}>
      <div role="tablist" style={tabListStyles}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const tabStyle = tabStyles(isActive, tab.disabled || false);

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              style={tabStyle}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              onMouseEnter={(e) => {
                if (!tab.disabled && !isActive) {
                  if (variant === 'pills') {
                    e.currentTarget.style.backgroundColor = colors.featherLight;
                  } else {
                    e.currentTarget.style.color = colors.text;
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!tab.disabled && !isActive) {
                  if (variant === 'pills') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else {
                    e.currentTarget.style.color = colors.textLight;
                  }
                }
              }}
            >
              {tab.icon && <span style={iconStyles}>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTabData && (
        <div
          id={`tabpanel-${activeTabData.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTabData.id}`}
          style={tabPanelStyles}
        >
          {activeTabData.content}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};