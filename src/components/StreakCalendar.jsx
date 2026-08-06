import React from 'react';
import { Card } from './ui/Card';

/**
 * StreakCalendar Component - Visualizes study streak activity in a clean weekly grid.
 */
export const StreakCalendar = ({ streakCount = 5, daysActive = [0, 1, 2, 3, 4] }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card variant="alt" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔥</span> Study Streak
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            You've been active <strong style={{ color: 'var(--accent-primary)' }}>{streakCount} days</strong> in a row!
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'var(--accent-warning-light)',
            color: 'var(--accent-warning)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {streakCount} Day Streak
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        {daysOfWeek.map((day, idx) => {
          const isActive = daysActive.includes(idx);
          return (
            <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{day}</span>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  maxHeight: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--accent-success)' : 'var(--bg-surface)',
                  border: `1px solid ${isActive ? 'var(--accent-success)' : 'var(--border-default)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#FFFFFF' : 'transparent',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)',
                }}
                title={isActive ? `${day}: Active study session` : `${day}: No activity`}
              >
                {isActive ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
