import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { pushProgressToCloud, pullProgressFromCloud } from '../utils/cloudSyncManager';

/**
 * CloudSyncModal Component - Modal dialog for Cloud Multi-device Sync configuration & user auth.
 */
export const CloudSyncModal = ({ isOpen, onClose }) => {
  const [configured, setConfigured] = useState(isSupabaseConfigured());
  const [urlInput, setUrlInput] = useState(localStorage.getItem('tagalog_supabase_url') || '');
  const [keyInput, setKeyInput] = useState(localStorage.getItem('tagalog_supabase_anon_key') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [configured]);

  if (!isOpen) return null;

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    localStorage.setItem('tagalog_supabase_url', urlInput.trim());
    localStorage.setItem('tagalog_supabase_anon_key', keyInput.trim());
    window.location.reload();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Try signup if login fails
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setMessage({ type: 'danger', text: signUpError.message });
      } else {
        setMessage({ type: 'success', text: 'Account created! Logged in successfully.' });
        if (signUpData?.user) {
          await pullProgressFromCloud(signUpData.user.id);
        }
      }
    } else if (data?.user) {
      setMessage({ type: 'success', text: 'Logged in! Progress synced.' });
      await pullProgressFromCloud(data.user.id);
    }
    setLoading(false);
  };

  const handleManualPush = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await pushProgressToCloud(user.id);
      setMessage({ type: 'success', text: 'Local progress uploaded to cloud!' });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Cloud upload failed: ' + err.message });
    }
    setLoading(false);
  };

  const handleManualPull = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await pullProgressFromCloud(user.id);
      setMessage({ type: 'success', text: 'Cloud progress downloaded to device!' });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Cloud download failed: ' + err.message });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setMessage({ type: 'info', text: 'Logged out.' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
        className="animate-fade-in"
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>☁️</span> Multi-Device Cloud Sync
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {message && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              backgroundColor: message.type === 'success' ? 'var(--accent-success-light)' : 'var(--accent-danger-light)',
              color: message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
              border: `1px solid ${message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Step 1: Credentials Setup */}
        {!configured ? (
          <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Enter your Supabase URL & Anon Key to connect multi-device PostgreSQL cloud sync.
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
        ) : (
          /* Step 2: Auth Login / User Status */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                  <Badge variant="success" style={{ marginBottom: '0.5rem' }}>Cloud Connected</Badge>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {user.email}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Your progress syncs automatically across your phone and PC.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="primary" onClick={handleManualPush} disabled={loading} style={{ flex: 1 }}>
                    ⬆️ Upload Local
                  </Button>
                  <Button variant="secondary" onClick={handleManualPull} disabled={loading} style={{ flex: 1 }}>
                    ⬇️ Download Cloud
                  </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout} style={{ marginTop: '0.5rem' }}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Sign in or create a free account to sync your study streak, mastered vocabulary, and quiz history on your phone.
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

                <Button variant="primary" type="submit" disabled={loading} fullWidth>
                  {loading ? 'Connecting...' : 'Sign In / Register'}
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
      </Card>
    </div>
  );
};
