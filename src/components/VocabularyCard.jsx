import React from 'react';
import { Volume2, Presentation } from 'lucide-react';
import slideMap from '../data/slideMap.json';

export default function VocabularyCard({ vocabItem, srsStatus, onSpeak, onOpenLesson }) {
  const getPosBadgeColor = (pos) => {
    const p = (pos || '').toLowerCase();
    if (p.includes('noun')) return 'badge-cyan';
    if (p.includes('adjective')) return 'badge-amber';
    if (p.includes('verb')) return 'badge-emerald';
    if (p.includes('pronoun')) return 'badge-indigo';
    return 'btn-secondary';
  };

  const vocabSlide = slideMap.vocabulary?._keyword_overrides?.[vocabItem.id]?.slide ||
    slideMap.vocabulary?._default_slides?.[vocabItem.lesson] || 1;

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && vocabItem.lesson) {
        onOpenLesson(vocabItem.lesson, vocabSlide, vocabSlide, vocabItem.word);
      }
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'relative'
    }}>
      {/* Top Header Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span className={`badge ${getPosBadgeColor(vocabItem.partOfSpeech)}`} style={{ fontSize: '0.7rem' }}>
            {vocabItem.partOfSpeech}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {vocabItem.lesson && (
              <a
                href={`#slides?lesson=${vocabItem.lesson}&slide=${vocabSlide}`}
                onClick={handleLessonLinkClick}
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--accent-indigo)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                title={`Open ${vocabItem.lesson.replace('_', ' ')} Slide ${vocabSlide}`}
              >
                <Presentation size={11} aria-hidden="true" />
                {vocabItem.lesson.replace('_', ' ')} (p. {vocabSlide})
              </a>
            )}
            {srsStatus && srsStatus.interval >= 3 && (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                Mastered
              </span>
            )}
          </div>
        </div>

        {/* Word & Audio */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {vocabItem.word}
          </h3>

          <button
            onClick={() => onSpeak(vocabItem.word)}
            className="btn-secondary"
            aria-label={`Listen to pronunciation of ${vocabItem.word}`}
            style={{ padding: '0.35rem 0.6rem', borderRadius: '20px' }}
            title="Listen to pronunciation"
          >
            <Volume2 size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          </button>
        </div>

        {/* Meaning */}
        <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-cyan)', margin: 0, marginBottom: '0.75rem' }}>
          {vocabItem.meaning}
        </p>

        {/* Example */}
        {vocabItem.example && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderLeft: '2px solid var(--accent-indigo)',
            borderRadius: '0 6px 6px 0',
            padding: '0.5rem 0.75rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'block', marginBottom: '0.15rem' }}>
              Example:
            </span>
            <em>"{vocabItem.example}"</em>
          </div>
        )}
      </div>

      {/* SRS Due Date Info */}
      {srsStatus && srsStatus.nextDueDateStr && (
        <div style={{
          fontSize: '0.725rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '0.5rem',
          marginTop: '0.25rem'
        }}>
          <span>Next SRS Review:</span>
          <span style={{ color: srsStatus.isDue ? 'var(--accent-amber)' : 'var(--text-secondary)', fontWeight: '600' }}>
            {srsStatus.isDue ? 'Due Now' : srsStatus.nextDueDateStr}
          </span>
        </div>
      )}
    </div>
  );
}
