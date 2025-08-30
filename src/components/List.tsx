import React from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, transitions } from '../theme/theme';

interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  icon,
  avatar,
  action,
  subtitle,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  style,
}) => {
  const itemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: selected ? colors.featherLight : 'transparent',
    cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    transition: transitions.fast,
    borderRadius: borderRadius.md,
    minHeight: subtitle ? '72px' : '56px',
    ...style,
  };

  const leadingStyles: React.CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    color: colors.textLight,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const primaryTextStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: colors.textLight,
    lineHeight: 1.5,
    marginTop: spacing.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const actionStyles: React.CSSProperties = {
    flexShrink: 0,
    marginLeft: 'auto',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li
      className={className}
      style={itemStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-selected={selected}
      aria-disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled && onClick && !selected) {
          e.currentTarget.style.backgroundColor = colors.background;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && onClick && !selected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {(icon || avatar) && (
        <div style={leadingStyles}>
          {icon && <div style={iconStyles}>{icon}</div>}
          {avatar}
        </div>
      )}
      
      <div style={contentStyles}>
        <div style={primaryTextStyles}>{children}</div>
        {subtitle && <div style={subtitleStyles}>{subtitle}</div>}
      </div>
      
      {action && <div style={actionStyles}>{action}</div>}
    </li>
  );
};

interface ListProps {
  children: React.ReactNode;
  dense?: boolean;
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const List: React.FC<ListProps> = ({
  children,
  dense = false,
  divider = false,
  className = '',
  style,
}) => {
  const listStyles: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    ...style,
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <ul className={className} style={listStyles}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {React.isValidElement(child) && React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: {
              ...((child.props as { style?: React.CSSProperties }).style || {}),
              padding: dense ? `${spacing.sm} ${spacing.lg}` : undefined,
            },
          })}
          {divider && index < childrenArray.length - 1 && (
            <li
              style={{
                height: '1px',
                backgroundColor: colors.featherLight,
                margin: `0 ${spacing.lg}`,
              }}
              aria-hidden="true"
            />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

interface ListSubheaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ListSubheader: React.FC<ListSubheaderProps> = ({
  children,
  className = '',
  style,
}) => {
  const subheaderStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textLight,
    backgroundColor: colors.background,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...style,
  };

  return (
    <li className={className} style={subheaderStyles}>
      {children}
    </li>
  );
};