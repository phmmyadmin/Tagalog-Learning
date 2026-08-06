import React from 'react';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';

/**
 * ProgressCard Component - Visualizes section completion percentage and direct action button.
 */
export const ProgressCard = ({
  title,
  icon,
  completedCount,
  totalCount,
  onNavigate,
  actionLabel = 'Continue',
  color = 'var(--accent-primary)',
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card variant="interactive" onClick={onNavigate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onNavigate(); }}>
          {actionLabel} →
        </Button>
      </div>
    </Card>
  );
};
