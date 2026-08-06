import React from 'react';

/**
 * Accessible ProgressBar component.
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  showPercent = true,
  color = 'var(--accent-primary)',
  height = '8px',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`ui-progress-container ${className}`} style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.35rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          {label && <span>{label}</span>}
          {showPercent && <span>{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--bg-surface-alt)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
};
