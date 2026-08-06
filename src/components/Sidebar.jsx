import React from 'react';
import { 
  Compass, 
  Bookmark, 
  CheckCircle, 
  ListFilter,
  Layers,
  CheckCheck,
  Hash,
  Presentation
} from 'lucide-react';

export default function Sidebar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  selectedLesson,
  setSelectedLesson,
  lessonsList,
  filterMastered,
  setFilterMastered,
  masteredCount,
  totalTopics,
  onOpenLesson
}) {
  const handleNavClick = (e, callback, hashUrl) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      callback();
      if (hashUrl) {
        window.history.pushState(null, '', hashUrl);
      }
    }
  };

  const handleOpenSlides = (e, lesson) => {
    e.stopPropagation();
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson) {
        onOpenLesson(lesson);
      }
    }
  };

  return (
    <aside style={{ width: '280px', flexShrink: 0 }} className="sidebar-container" aria-label="Filters and Navigation">
      <div className="glass-card" style={{ 
        padding: '1.25rem', 
        position: 'sticky', 
        top: '5.5rem',
        maxHeight: 'calc(100vh - 6.5rem)',
        overflowY: 'auto'
      }}>
        
        {/* Sidebar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <Compass size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Content Categories</h2>
        </div>

        {/* Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem' }} role="navigation" aria-label="Grammar categories">
          <a
            href="#theory?category=all"
            onClick={(e) => handleNavClick(e, () => setSelectedCategory('all'))}
            aria-pressed={selectedCategory === 'all'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedCategory === 'all' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
              background: selectedCategory === 'all' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: selectedCategory === 'all' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Layers size={16} aria-hidden="true" /> All Grammar Topics
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{totalTopics}</span>
          </a>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <a
                key={cat.id}
                href={`#theory?category=${cat.id}`}
                onClick={(e) => handleNavClick(e, () => setSelectedCategory(cat.id))}
                aria-pressed={isSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  textAlign: 'left',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '190px'
                }}>
                  {cat.topic}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.lesson}</span>
              </a>
            );
          })}
        </div>

        {/* Filter by Lesson */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ListFilter size={14} aria-hidden="true" /> Filter by Lesson
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <a
              href="#theory?lesson=all"
              onClick={(e) => handleNavClick(e, () => setSelectedLesson('all'))}
              aria-pressed={selectedLesson === 'all'}
              className={selectedLesson === 'all' ? 'badge badge-cyan' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer', textDecoration: 'none' }}
            >
              All Lessons
            </a>
            {lessonsList.map((lesson) => {
              const isSelected = selectedLesson === lesson;
              return (
                <div key={lesson} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <a
                    href={`#theory?lesson=${lesson}`}
                    onClick={(e) => handleNavClick(e, () => setSelectedLesson(lesson))}
                    aria-pressed={isSelected}
                    className={isSelected ? 'badge badge-cyan' : 'btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer', textDecoration: 'none', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}
                  >
                    {lesson.replace('_', ' ')}
                  </a>
                  <a
                    href={`#slides?lesson=${lesson}`}
                    onClick={(e) => handleOpenSlides(e, lesson)}
                    title={`View ${lesson.replace('_', ' ')} Presentation Slides`}
                    style={{
                      background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-color)',
                      borderLeft: 'none',
                      padding: '0.3rem 0.45rem',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      color: 'var(--accent-cyan)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    <Presentation size={11} aria-hidden="true" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mastery Filter Toggle */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <CheckCheck size={14} aria-hidden="true" /> Learning Status
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a
              href="#theory?status=all"
              onClick={(e) => handleNavClick(e, () => setFilterMastered('all'))}
              aria-pressed={filterMastered === 'all'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: filterMastered === 'all' ? '1px solid var(--border-highlight)' : '1px solid transparent',
                background: filterMastered === 'all' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: filterMastered === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <Hash size={14} aria-hidden="true" /> Show All Topics
            </a>

            <a
              href="#theory?status=mastered"
              onClick={(e) => handleNavClick(e, () => setFilterMastered('mastered'))}
              aria-pressed={filterMastered === 'mastered'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: filterMastered === 'mastered' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                background: filterMastered === 'mastered' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: filterMastered === 'mastered' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <CheckCircle size={14} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" /> Only Mastered ({masteredCount})
            </a>

            <a
              href="#theory?status=unmastered"
              onClick={(e) => handleNavClick(e, () => setFilterMastered('unmastered'))}
              aria-pressed={filterMastered === 'unmastered'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: filterMastered === 'unmastered' ? '1px solid var(--accent-amber)' : '1px solid transparent',
                background: filterMastered === 'unmastered' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                color: filterMastered === 'unmastered' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <Bookmark size={14} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" /> Needs Study ({totalTopics - masteredCount})
            </a>
          </div>
        </div>

      </div>
    </aside>
  );
}
