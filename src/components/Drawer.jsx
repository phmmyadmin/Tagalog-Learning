import React, { useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { FilterChip } from './ui/FilterChip';

/**
 * Drawer Component - Accessible slide-over side panel for contextual filters, lesson navigation, and shortcuts.
 */
export const Drawer = ({
  isOpen,
  onClose,
  lessons = ['Lesson 02', 'Lesson 03', 'Lesson 04', 'Lesson 05'],
  selectedLesson = 'all',
  onSelectLesson,
  filterMastered = 'all', // 'all' | 'mastered' | 'unmastered'
  onSelectFilterMastered,
  onOpenSlideViewer,
  activeView,
}) => {
  const drawerRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation and Filters Drawer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-overlay)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-start',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className="animate-fade-in"
        style={{
          width: '320px',
          maxWidth: '85vw',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1.5rem',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
            🎛️ Navigation & Filters
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} ariaLabel="Close Drawer">
            ✕
          </Button>
        </div>

        {/* Lesson Filter Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter by Lesson
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <FilterChip
              label="All Lessons"
              active={selectedLesson === 'all'}
              onClick={() => onSelectLesson('all')}
            />
            {lessons.map((lesson) => (
              <FilterChip
                key={lesson}
                label={lesson}
                active={selectedLesson === lesson}
                onClick={() => onSelectLesson(lesson)}
              />
            ))}
          </div>
        </div>

        {/* Mastered / Due Status Filter Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mastery Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <FilterChip
              label="All Items"
              active={filterMastered === 'all'}
              onClick={() => onSelectFilterMastered('all')}
            />
            <FilterChip
              label="✅ Mastered Only"
              active={filterMastered === 'mastered'}
              onClick={() => onSelectFilterMastered('mastered')}
            />
            <FilterChip
              label="📖 Needs Study"
              active={filterMastered === 'unmastered'}
              onClick={() => onSelectFilterMastered('unmastered')}
            />
          </div>
        </div>

        {/* Slide Viewer Shortcut */}
        {onOpenSlideViewer && (
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-default)' }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                onClose();
                onOpenSlideViewer(selectedLesson !== 'all' ? selectedLesson : 'Lesson_02');
              }}
              icon={<span>🖼️</span>}
            >
              View Lesson Slides
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
