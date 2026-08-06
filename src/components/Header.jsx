import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

/**
 * Header Component - Sticky TopBar navigation with drawer toggle, tabs, and global search.
 */
export const Header = ({
  activeTab = 'dashboard',
  onTabChange,
  onOpenDrawer,
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
  ];

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
            variant="ghost"
            size="sm"
            onClick={onOpenDrawer}
            ariaLabel="Open Navigation Drawer"
            style={{ padding: '0.5rem', fontSize: '1.25rem' }}
          >
            ☰
          </Button>

          <div
            onClick={() => onTabChange('dashboard')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1.5rem' }}>🇵🇭</span>
            <div>
              <h1 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1 }}>Tagalog Master</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {masteredCount}/{totalCount} Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-selected={isActive}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Global Search Input */}
        <div style={{ width: '220px' }}>
          <Input
            placeholder="Search grammar, words..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon="🔍"
          />
        </div>
      </div>
    </header>
  );
};
