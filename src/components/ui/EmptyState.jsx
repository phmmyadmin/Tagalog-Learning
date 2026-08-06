import React from 'react';

/**
 * EmptyState component for zero-data or filtered out results.
 */
export const EmptyState = ({
  icon = '🔍',
  title = 'No dynamic results found',
  description = 'Try adjusting your search criteria or resetting filters.',
  action = null,
  className = '',
}) => {
  return (
    <div
      className={`ui-empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p style={{ maxWidth: '400px', fontSize: '0.925rem', marginBottom: action ? '1.5rem' : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
