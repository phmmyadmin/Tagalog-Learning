import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getSrsSettings, saveSrsSettings } from '../utils/srsStore';

export default function SrsSettingsPanel({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getSrsSettings());
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveSrsSettings(settings);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      className="animate-fade-in"
    >
      <Card
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
            ⚙️ SRS & FSRS Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* New Cards Per Day */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              New Cards Per Day: <strong>{settings.newCardsPerDay}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={settings.newCardsPerDay}
              onChange={(e) => setSettings({ ...settings, newCardsPerDay: parseInt(e.target.value, 10) })}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Controls how many unstudied cards are introduced each day.
            </span>
          </div>

          {/* Max Reviews Per Day */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Max Reviews Per Day: <strong>{settings.maxReviewsPerDay}</strong>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={settings.maxReviewsPerDay}
              onChange={(e) => setSettings({ ...settings, maxReviewsPerDay: parseInt(e.target.value, 10) })}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Maximum review workload limit per day.
            </span>
          </div>

          {/* Target Retention Rate */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Target Retention Rate: <strong>{Math.round(settings.requestedRetention * 100)}%</strong>
            </label>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={Math.round(settings.requestedRetention * 100)}
              onChange={(e) => setSettings({ ...settings, requestedRetention: parseInt(e.target.value, 10) / 100 })}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Target recall probability (FSRS-5 interval calculation).
            </span>
          </div>

          {/* Enable Timer Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="enableTimer"
              checked={settings.enableTimer}
              onChange={(e) => setSettings({ ...settings, enableTimer: e.target.checked })}
            />
            <label htmlFor="enableTimer" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Track response time per card
            </label>
          </div>

          {savedMessage && (
            <div style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
              ✓ Settings saved!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
