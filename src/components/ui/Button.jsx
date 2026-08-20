import React from 'react';

/**
 * Reusable Button component with accessible focus, variants, and sizes.
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  fullWidth = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--accent-primary)',
    },
    secondary: {
      backgroundColor: 'var(--bg-surface-alt)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'var(--accent-danger)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--accent-danger)',
    },
    warning: {
      backgroundColor: 'var(--accent-warning)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--accent-warning)',
    },
    success: {
      backgroundColor: 'var(--accent-success)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--accent-success)',
    },
  };

  const sizeStyles = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1.125rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
  };

  const combinedStyles = {
    ...baseStyles,
    ...(variantStyles[variant] || variantStyles.primary),
    ...(sizeStyles[size] || sizeStyles.md),
  };

  return (
    <button
      type={type}
      style={combinedStyles}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`ui-button ${className}`}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
