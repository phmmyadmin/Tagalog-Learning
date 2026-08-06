import React from 'react';

/**
 * Accessible Input component with integrated label, hints, and error states.
 */
export const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  hint = '',
  icon = null,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`ui-input-group ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--accent-danger)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          style={{
            width: '100%',
            padding: icon ? '0.6rem 1rem 0.6rem 2.5rem' : '0.6rem 1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-surface)',
            border: `1px solid ${error ? 'var(--accent-danger)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
          {...props}
        />
      </div>

      {error && (
        <span id={`${inputId}-error`} style={{ fontSize: '0.8rem', color: 'var(--accent-danger)' }}>
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${inputId}-hint`} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {hint}
        </span>
      )}
    </div>
  );
};
