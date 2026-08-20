import React from 'react';
import { createPortal } from 'react-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function AchievementModal({ achievement, isUnlocked, onClose }) {
  if (!achievement || typeof document === 'undefined') return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <Card
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          textAlign: 'center',
          border: isUnlocked ? '2px solid var(--accent-warning)' : '1px solid var(--border-default)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          borderRadius: 'var(--radius-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '0.25rem', opacity: isUnlocked ? 1 : 0.6 }}>
            {achievement.icon}
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
            {achievement.title}
          </h2>
          <div style={{ marginTop: '0.4rem' }}>
            {isUnlocked ? (
              <Badge variant="success">✅ Unlocked (+{achievement.xp} XP)</Badge>
            ) : (
              <Badge variant="secondary">🔒 Locked</Badge>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            🎯 How to unlock
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {achievement.desc}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0 0.25rem' }}>
          <span>Reward:</span>
          <strong style={{ color: '#8B5CF6', fontSize: '1rem' }}>+{achievement.xp} XP</strong>
        </div>

        <Button variant="primary" onClick={onClose} style={{ marginTop: '0.25rem' }}>
          Got it!
        </Button>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}
