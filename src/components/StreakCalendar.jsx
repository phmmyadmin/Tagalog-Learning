import React from 'react';
import { Card } from './ui/Card';
import { getContributionMatrix } from '../utils/streakManager';

/**
 * StreakCalendar Component - GitHub Contributions style heatmap matrix with clear day & month labels.
 */
export const StreakCalendar = ({ streakCount = 0 }) => {
  const weeks = getContributionMatrix(16);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card variant="alt" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <span>🔥</span> Study Activity & Streak
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Current streak: <strong style={{ color: 'var(--accent-primary)' }}>{streakCount} days</strong>
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'var(--accent-warning-light)',
            color: 'var(--accent-warning)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.875rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {streakCount} Day Streak
        </div>
      </div>

      {/* GitHub Heatmap Grid */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', minWidth: 'max-content' }}>
          {/* Day of Week Labels Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', justifyContent: 'space-between' }}>
            {dayLabels.map((lbl) => (
              <span key={lbl} style={{ height: '14px', lineHeight: '14px', fontWeight: 600 }}>{lbl}</span>
            ))}
          </div>

          {/* Weeks Columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {week.map((day, dIdx) => {
                let bgColor = 'var(--bg-surface)';
                let borderColor = 'var(--border-default)';

                if (day.isActive) {
                  bgColor = 'var(--accent-success)';
                  borderColor = 'var(--accent-success)';
                } else if (day.isToday) {
                  borderColor = 'var(--accent-primary)';
                } else if (day.isFuture) {
                  bgColor = 'var(--bg-surface-alt)';
                  borderColor = 'transparent';
                }

                return (
                  <div
                    key={dIdx}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      transition: 'all var(--transition-fast)',
                    }}
                    title={`${day.dateStr}: ${day.isActive ? 'Active study session' : 'No activity'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Inactive</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--accent-success)' }} />
        <span>Active</span>
      </div>
    </Card>
  );
};
