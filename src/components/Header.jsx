import React from 'react';
import { BookOpen, Search, Layers, GraduationCap, CheckCircle2, X, HelpCircle } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  activeView, 
  setActiveView,
  masteredCount,
  totalTopics
}) {
  const percentMastered = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;

  const handleTabClick = (e, targetView) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      setActiveView(targetView);
      window.location.hash = targetView;
    }
  };

  return (
    <header className="glass-card" style={{
      margin: '1rem 1.5rem 0 1.5rem',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem 1.75rem',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <div className="header-content" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: 'var(--shadow-glow)'
          }} aria-hidden="true">
            🇵🇭
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Tagalog Master</h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>v1.0</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Grammar & Theory Contents Hub
            </p>
          </div>
        </div>

        {/* View Switcher / Tabs */}
        <nav className="nav-tabs" role="tablist" aria-label="Main Navigation Tabs" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(9, 13, 22, 0.6)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <a
            href="#theory"
            role="tab"
            aria-selected={activeView === 'theory'}
            aria-controls="main-content"
            id="tab-theory"
            onClick={(e) => handleTabClick(e, 'theory')}
            className={activeView === 'theory' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <BookOpen size={16} aria-hidden="true" />
            Theory & Contents
          </a>
          
          <a
            href="#vocabulary"
            role="tab"
            aria-selected={activeView === 'vocabulary'}
            aria-controls="main-content"
            id="tab-vocabulary"
            onClick={(e) => handleTabClick(e, 'vocabulary')}
            className={activeView === 'vocabulary' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <Layers size={16} aria-hidden="true" />
            Vocabulary
          </a>

          <a
            href="#activities"
            role="tab"
            aria-selected={activeView === 'activities'}
            aria-controls="main-content"
            id="tab-activities"
            onClick={(e) => handleTabClick(e, 'activities')}
            className={activeView === 'activities' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <GraduationCap size={16} aria-hidden="true" />
            Activities
          </a>

          <a
            href="#quizzes"
            role="tab"
            aria-selected={activeView === 'quizzes'}
            aria-controls="main-content"
            id="tab-quizzes"
            onClick={(e) => handleTabClick(e, 'quizzes')}
            className={activeView === 'quizzes' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <HelpCircle size={16} aria-hidden="true" />
            Quizzes
          </a>
        </nav>

        {/* Search Bar & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            position: 'relative',
            minWidth: '240px'
          }}>
            <label htmlFor="search-input" className="sr-only">Search grammar, rules, words</label>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} aria-hidden="true" />
            <input
              id="search-input"
              type="text"
              placeholder="Search grammar, rules, words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.2rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mastery Progress Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Mastered
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                {masteredCount} / {totalTopics} ({percentMastered}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
