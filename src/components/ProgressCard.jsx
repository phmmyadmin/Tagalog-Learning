import React from 'react';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

/**
 * ProgressCard Component - Visualizes section completion percentage and direct action link.
 */
export const ProgressCard = ({
  title,
  icon,
  completedCount,
  totalCount,
  onNavigate,
  targetTab = 'theory',
  actionLabel = 'Continue',
  color = 'var(--accent-primary)',
}) => {
  const handleNavClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      onNavigate();
    }
  };

  return (
    <Card
      variant="interactive"
      onClick={onNavigate}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {completedCount} of {totalCount} completed
          </p>
        </div>
      </div>

      <ProgressBar value={completedCount} max={totalCount} color={color} showPercent={true} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
        <a
          href={`#${targetTab}`}
          onClick={handleNavClick}
          style={{
            fontSize: '0.875rem',
            color: 'var(--accent-primary)',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {actionLabel} →
        </a>
      </div>
    </Card>
  );
};
