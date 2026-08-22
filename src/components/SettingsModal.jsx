import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { pushProgressToCloud, pullProgressFromCloud } from '../utils/cloudSyncManager';
import { getSrsSettings, saveSrsSettings } from '../utils/srsStore';
import { getAiConfig, saveAiConfig } from '../utils/aiConfigStore';

/**
 * Unified Settings & Cloud Sync Modal
 * Integrates:
 * 1. ☁️ Cloud Sync & Account (Supabase)
 * 2. 🎴 Spaced Repetition (FSRS-5 parameters)
 * 3. 🤖 Gemini AI API Key & Ingestion Settings
 */
export const SettingsModal = ({ isOpen, onClose, initialTab = 'sync' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'sync' | 'srs' | 'ai'

  // Sync / Supabase State
  const [configured, setConfigured] = useState(isSupabaseConfigured());
  const [urlInput, setUrlInput] = useState(localStorage.getItem('tagalog_supabase_url') || '');
  const [keyInput, setKeyInput] = useState(localStorage.getItem('tagalog_supabase_anon_key') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // SRS & AI Settings State
  const [srsSettings, setSrsSettings] = useState(getSrsSettings());
  const [aiConfig, setAiConfig] = useState(getAiConfig());
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'sync');
      setSrsSettings(getSrsSettings());
      setAiConfig(getAiConfig());
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [configured]);

  if (!isOpen || typeof document === 'undefined') return null;

  // Supabase Auth Handlers
  const handleSaveCredentials = (e) => {
    e.preventDefault();
    localStorage.setItem('tagalog_supabase_url', urlInput.trim());
    localStorage.setItem('tagalog_supabase_anon_key', keyInput.trim());
    window.location.reload();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSyncLoading(true);
    setSyncMessage(null);

    const formatErrorMessage = (err) => {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        return 'Supabase Email Rate Limit Exceeded. In Supabase Dashboard > Auth > Email, turn OFF "Confirm email" to log in freely.';
      }
      return msg;
    };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setSyncMessage({ type: 'danger', text: formatErrorMessage(signUpError) });
      } else {
        setSyncMessage({ type: 'success', text: 'Account created! Syncing progress...' });
        if (signUpData?.user) {
          await pullProgressFromCloud(signUpData.user.id);
        }
      }
    } else if (data?.user) {
      setSyncMessage({ type: 'success', text: 'Logged in! Progress synced.' });
      await pullProgressFromCloud(data.user.id);
    }
    setSyncLoading(false);
  };

  const handleManualPush = async () => {
    if (!user) return;
    setSyncLoading(true);
    try {
      await pushProgressToCloud(user.id);
      setSyncMessage({ type: 'success', text: 'Local progress uploaded to cloud!' });
    } catch (err) {
      setSyncMessage({ type: 'danger', text: 'Cloud upload failed: ' + err.message });
    }
    setSyncLoading(false);
  };

  const handleManualPull = async () => {
    if (!user) return;
    setSyncLoading(true);
    try {
      await pullProgressFromCloud(user.id);
      setSyncMessage({ type: 'success', text: 'Cloud progress downloaded to device!' });
    } catch (err) {
      setSyncMessage({ type: 'danger', text: 'Cloud download failed: ' + err.message });
    }
    setSyncLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setSyncMessage({ type: 'info', text: 'Logged out.' });
    }
  };

  // SRS & AI Save Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveSrsSettings(srsSettings);
    saveAiConfig(aiConfig);
    setSettingsSavedMsg(true);
    setTimeout(() => {
      setSettingsSavedMsg(false);
    }, 1500);
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.2))',
          borderRadius: 'var(--radius-lg)',
        }}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                Settings & Preferences
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Cloud sync, spaced repetition algorithms, and AI configuration.
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close Settings">
            ✕
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            backgroundColor: 'var(--bg-surface-alt)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Button
            variant={activeTab === 'sync' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sync')}
            style={{ flex: 1, fontSize: '0.825rem', padding: '0.4rem 0.5rem' }}
            icon={<span>☁️</span>}
          >
            Cloud Sync
          </Button>
          <Button
            variant={activeTab === 'srs' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('srs')}
            style={{ flex: 1, fontSize: '0.825rem', padding: '0.4rem 0.5rem' }}
            icon={<span>🎴</span>}
          >
            Spaced Repetition
          </Button>
          <Button
            variant={activeTab === 'ai' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('ai')}
            style={{ flex: 1, fontSize: '0.825rem', padding: '0.4rem 0.5rem' }}
            icon={<span>🤖</span>}
          >
            Gemini AI
          </Button>
        </div>

        {/* Tab 1: Cloud Sync & Account */}
        {activeTab === 'sync' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {syncMessage && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  backgroundColor: syncMessage.type === 'success' ? 'var(--accent-success-light, #F0FDF4)' : 'var(--accent-danger-light, #FEE2E2)',
                  color: syncMessage.type === 'success' ? 'var(--accent-success, #16A34A)' : 'var(--accent-danger, #DC2626)',
                  border: `1px solid ${syncMessage.type === 'success' ? 'var(--accent-success, #16A34A)' : 'var(--accent-danger, #DC2626)'}`,
                }}
              >
                {syncMessage.text}
              </div>
            )}

            {!configured ? (
              <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter your Supabase URL & Anon Key to enable multi-device cloud backup and sync.
                </p>

                <Input
                  label="Supabase Project URL"
                  placeholder="https://xyzcompany.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />

                <Input
                  label="Supabase Anon Key"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  required
                />

                <Button variant="primary" type="submit" fullWidth>
                  Save Credentials & Connect
                </Button>
              </form>
            ) : user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                  <Badge variant="success" style={{ marginBottom: '0.5rem' }}>Cloud Connected</Badge>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {user.email}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Your study streak, mastered vocabulary, lessons, and quiz history sync automatically across all devices.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Button variant="primary" onClick={handleManualPush} disabled={syncLoading} style={{ flex: 1 }}>
                    ⬆️ Upload Local
                  </Button>
                  <Button variant="secondary" onClick={handleManualPull} disabled={syncLoading} style={{ flex: 1 }}>
                    ⬇️ Download Cloud
                  </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout} style={{ color: 'var(--accent-danger)', alignSelf: 'flex-start' }}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Sign in or create an account to synchronize your progress and custom lessons across devices.
                </p>

                <Input
                  label="Email"
                  type="email"
                  placeholder="pablo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button variant="primary" type="submit" disabled={syncLoading} fullWidth>
                  {syncLoading ? 'Connecting...' : 'Sign In / Register'}
                </Button>
              </form>
            )}

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                PostgreSQL Cloud Sync
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('tagalog_supabase_url');
                  localStorage.removeItem('tagalog_supabase_anon_key');
                  window.location.reload();
                }}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
              >
                Reset Supabase URL
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Spaced Repetition (FSRS-5) */}
        {activeTab === 'srs' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {settingsSavedMsg && (
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--accent-success-light)', color: 'var(--accent-success)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                ✓ Spaced repetition settings saved!
              </div>
            )}

            {/* New Cards Per Day */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                New Cards Per Day: <strong>{srsSettings.newCardsPerDay}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={srsSettings.newCardsPerDay}
                onChange={(e) => setSrsSettings({ ...srsSettings, newCardsPerDay: parseInt(e.target.value, 10) })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Controls how many unstudied cards are introduced each day.
              </span>
            </div>

            {/* Max Reviews Per Day */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Max Reviews Per Day: <strong>{srsSettings.maxReviewsPerDay}</strong>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={srsSettings.maxReviewsPerDay}
                onChange={(e) => setSrsSettings({ ...srsSettings, maxReviewsPerDay: parseInt(e.target.value, 10) })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Caps the daily workload to prevent study fatigue.
              </span>
            </div>

            {/* Target Retention Rate */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Target Retention Rate: <strong>{Math.round((srsSettings.requestedRetention || 0.9) * 100)}%</strong>
              </label>
              <input
                type="range"
                min="70"
                max="97"
                value={Math.round((srsSettings.requestedRetention || 0.9) * 100)}
                onChange={(e) => setSrsSettings({ ...srsSettings, requestedRetention: parseInt(e.target.value, 10) / 100 })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Higher retention requires more frequent review intervals (FSRS-5 standard is 90%).
              </span>
            </div>

            {/* Timer Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Show Flashcard Timer
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Tracks response time to calculate retention stability.
                </div>
              </div>
              <input
                type="checkbox"
                checked={srsSettings.enableTimer !== false}
                onChange={(e) => setSrsSettings({ ...srsSettings, enableTimer: e.target.checked })}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </div>

            <Button variant="primary" type="submit" fullWidth>
              Save Spaced Repetition Settings
            </Button>
          </form>
        )}

        {/* Tab 3: Gemini AI API Key */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {settingsSavedMsg && (
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--accent-success-light)', color: 'var(--accent-success)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                ✓ Gemini AI API Key saved!
              </div>
            )}

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your Google Gemini API Key powers in-browser PowerPoint lesson structuring and dynamic AI quiz generation.
            </p>

            <Input
              label="Google Gemini API Key"
              type="password"
              placeholder="AIzaSy..."
              value={aiConfig.apiKey || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
              hint="Get a free Gemini API key at aistudio.google.com"
            />

            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              🔒 <strong>Privacy:</strong> Your API key is stored securely in your browser's local storage and called directly to Google's official Gemini endpoint.
            </div>

            <Button variant="primary" type="submit" fullWidth>
              Save AI Key
            </Button>
          </form>
        )}
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SettingsModal;
