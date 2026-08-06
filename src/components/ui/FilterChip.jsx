import React from 'react';

/**
 * FilterChip component for interactive category / state filters.
 */
export const FilterChip = ({
  label,
  active = false,
  onClick,
  count = null,
  icon = null,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`ui-filter-chip ${active ? 'active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.85rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
        backgroundColor: active ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{label}</span>
      {count !== null && count !== undefined && (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.1rem 0.4rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface-alt)',
            color: active ? 'var(--text-inverse)' : 'var(--text-muted)',
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
