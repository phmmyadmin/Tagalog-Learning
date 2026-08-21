import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getSrsSettings, saveSrsSettings } from '../utils/srsStore';
import { getAiConfig, saveAiConfig } from '../utils/aiConfigStore';

export default function SrsSettingsPanel({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getSrsSettings());
  const [aiConfig, setAiConfig] = useState(getAiConfig());
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveSrsSettings(settings);
    saveAiConfig(aiConfig);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      if (onClose) onClose();
    }, 1000);
  };

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
    >
      <Card
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
            ⚙️ SRS & AI Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: FSRS Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎴 Spaced Repetition (FSRS-5)
            </h3>

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
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: 0 }} />

          {/* Section 2: Gemini AI Config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🤖 Google Gemini AI Settings
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Google AI Studio API Key:
              </label>
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                Get a free key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Google AI Studio</a>. Saved locally.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Model:
              </label>
              <select
                value={aiConfig.model}
                onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                }}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Proxy / Edge Endpoint URL (Optional):
              </label>
              <Input
                type="text"
                placeholder="https://my-worker.workers.dev (Optional CORS Proxy)"
                value={aiConfig.proxyUrl}
                onChange={(e) => setAiConfig({ ...aiConfig, proxyUrl: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                Optional if calling through Cloudflare Worker proxy.
              </span>
            </div>
          </div>

          {savedMessage && (
            <div style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
              ✓ Settings saved successfully!
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

  return createPortal(modalContent, document.body);
}
