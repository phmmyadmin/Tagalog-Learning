import React from 'react';

/**
 * Badge component for tags, status indicators, and Parts of Speech labels.
 */
export const Badge = ({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'noun' | 'verb' | 'adjective' | 'pronoun' | 'adverb'
  size = 'md', // 'sm' | 'md'
  icon = null,
  className = '',
  style = {},
}) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--pos-default-bg)',
      color: 'var(--pos-default-text)',
    },
    primary: {
      backgroundColor: 'var(--accent-primary-light)',
      color: 'var(--accent-primary)',
    },
    success: {
      backgroundColor: 'var(--accent-success-light)',
      color: 'var(--accent-success)',
    },
    warning: {
      backgroundColor: 'var(--accent-warning-light)',
      color: 'var(--accent-warning)',
    },
    danger: {
      backgroundColor: 'var(--accent-danger-light)',
      color: 'var(--accent-danger)',
    },
    noun: {
      backgroundColor: 'var(--pos-noun-bg)',
      color: 'var(--pos-noun-text)',
    },
    verb: {
      backgroundColor: 'var(--pos-verb-bg)',
      color: 'var(--pos-verb-text)',
    },
    adjective: {
      backgroundColor: 'var(--pos-adj-bg)',
      color: 'var(--pos-adj-text)',
    },
    pronoun: {
      backgroundColor: 'var(--pos-pronoun-bg)',
      color: 'var(--pos-pronoun-text)',
    },
    adverb: {
      backgroundColor: 'var(--pos-adverb-bg)',
      color: 'var(--pos-adverb-text)',
    },
  };

  const sizeStyles = {
    sm: { padding: '0.15rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
  };

  const combinedStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.01em',
    ...(variantStyles[variant] || variantStyles.default),
    ...(sizeStyles[size] || sizeStyles.md),
    ...style,
  };

  return (
    <span style={combinedStyles} className={`ui-badge ${className}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </span>
  );
};
