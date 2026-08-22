import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

/**
 * Header Component - Sticky TopBar navigation with drawer toggle, semantic <a> links, and global search.
 */
export const Header = ({
  activeTab = 'dashboard',
  onTabChange,
  onOpenDrawer,
  onOpenCloudSync,
  searchQuery = '',
  onSearchChange,
  masteredCount = 0,
  totalCount = 0,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'theory', label: 'Theory', icon: '📖' },
    { id: 'vocabulary', label: 'Vocab', icon: '🎴' },
    { id: 'activities', label: 'Practice', icon: '✍️' },
    { id: 'quizzes', label: 'Quizzes', icon: '🏆' },
    { id: 'ingest', label: 'Import PPTX', icon: '📤' },
  ];

  const handleNavClick = (e, tabId) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      onTabChange(tabId);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Brand + Drawer Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Drawer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-alt)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
            }}
          >
            <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
          </Button>

          <a
            href="#dashboard"
            onClick={(e) => handleNavClick(e, 'dashboard')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '1.5rem' }}>🇵🇭</span>
            <div>
              <h1 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1, color: 'var(--text-primary)' }}>Tagalog Master</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {masteredCount}/{totalCount} Mastered
              </span>
            </div>
          </a>
        </div>

        {/* Center: Semantic <a> Navigation Tabs */}
        <nav className="header-nav">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => handleNavClick(e, tab.id)}
                aria-selected={isActive}
                className="header-nav-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{tab.icon}</span>
                <span className="nav-text">{tab.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Global Search Input & Cloud Sync Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '280px' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search grammar, words..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon="🔍"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCloudSync}
            ariaLabel="Open Multi-Device Cloud Sync"
            style={{
              fontSize: '0.8rem',
              padding: '0.45rem 0.65rem',
              whiteSpace: 'nowrap',
              gap: '0.35rem',
            }}
          >
            ☁️ Sync
          </Button>
        </div>
      </div>
    </header>
  );
};
