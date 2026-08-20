import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function SrsSessionSummary({ sessionStats, onRestart, onClose }) {
  if (!sessionStats) return null;

  const {
    totalReviewed = 0,
    againCount = 0,
    hardCount = 0,
    goodCount = 0,
    easyCount = 0,
    totalTimeMs = 0,
    xpEarned = 0,
    newlyUnlocked = [],
  } = sessionStats;

  const totalTimeSec = Math.round(totalTimeMs / 1000);
  const minutes = Math.floor(totalTimeSec / 60);
  const seconds = totalTimeSec % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const averageSec = totalReviewed > 0 ? (totalTimeSec / totalReviewed).toFixed(1) : 0;
  const correctCount = hardCount + goodCount + easyCount;
  const retentionRate = totalReviewed > 0 ? Math.round((correctCount / totalReviewed) * 100) : 100;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          textAlign: 'center',
          border: '2px solid var(--accent-primary)',
          boxShadow: 'var(--shadow-lg)',
          boxSizing: 'border-box',
        }}
        className="animate-fade-in"
      >
        <div>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
            Session Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem', marginBottom: 0 }}>
            Great job! You've consolidated your Tagalog memory.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {totalReviewed}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Reviewed
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-success)' }}>
              {retentionRate}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Retention Rate
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
              {timeFormatted}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Avg {averageSec}s / card
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8B5CF6' }}>
              +{xpEarned} XP
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              XP Earned
            </div>
          </div>
        </div>

        {/* Rating Breakdown Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <Badge variant="danger">Again: {againCount}</Badge>
          <Badge variant="secondary">Hard: {hardCount}</Badge>
          <Badge variant="primary">Good: {goodCount}</Badge>
          <Badge variant="success">Easy: {easyCount}</Badge>
        </div>

        {/* Unlocked Achievements Banner */}
        {newlyUnlocked.length > 0 && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid var(--accent-warning)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              🏅 New Achievement Unlocked!
            </div>
            {newlyUnlocked.map((ach) => (
              <div key={ach.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <span>{ach.icon}</span>
                <strong>{ach.title}</strong> — <span style={{ color: 'var(--text-secondary)' }}>+{ach.xp} XP</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.25rem' }}>
          {onRestart && (
            <Button variant="secondary" onClick={onRestart}>
              🔄 Study More
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
}
