import React from 'react';

/**
 * Surface Container Card component with warm light elevation.
 */
export const Card = ({
  children,
  variant = 'default', // 'default' | 'alt' | 'interactive'
  padding = '1.25rem',
  className = '',
  style = {},
  onClick,
  role,
  tabIndex,
  ariaLabel,
  ...props
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;

  const baseStyles = {
    backgroundColor: variant === 'alt' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    padding,
    transition: 'all var(--transition-normal)',
    cursor: isInteractive ? 'pointer' : 'default',
    overflow: 'hidden',
  };

  return (
    <div
      style={{ ...baseStyles, ...style }}
      onClick={onClick}
      role={role || (isInteractive ? 'button' : undefined)}
      tabIndex={tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : undefined)}
      aria-label={ariaLabel}
      className={`ui-card ${isInteractive ? 'ui-card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
