import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import slideMap from '../data/slideMap.json';

/**
 * VocabularyCard Component - Warm light card displaying word, POS badge, phonetics, audio synthesis, mastered toggle, and example sentences.
 */
export default function VocabularyCard({ vocabItem, isMastered = false, onToggleMastered, onSpeak, onOpenLesson }) {
  const getPosVariant = (pos) => {
    const p = (pos || '').toLowerCase();
    if (p.includes('noun')) return 'noun';
    if (p.includes('verb')) return 'verb';
    if (p.includes('adjective') || p.includes('adj')) return 'adjective';
    if (p.includes('pronoun')) return 'pronoun';
    if (p.includes('adverb')) return 'adverb';
    return 'default';
  };

  const vocabSlide =
    slideMap.vocabulary?._keyword_overrides?.[vocabItem.id]?.slide ||
    slideMap.vocabulary?._default_slides?.[vocabItem.lesson] ||
    1;

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && vocabItem.lesson) {
        onOpenLesson(vocabItem.lesson, vocabSlide, vocabSlide, vocabItem.word);
      }
    }
  };

  return (
    <Card
      variant="default"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem',
        border: isMastered ? '1px solid var(--accent-success)' : '1px solid var(--border-default)',
      }}
      className="animate-fade-in"
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onToggleMastered && (
              <button
                type="button"
                onClick={() => onToggleMastered(vocabItem.id)}
                aria-label={isMastered ? `Mark ${vocabItem.word} as unmastered` : `Mark ${vocabItem.word} as mastered`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isMastered ? '✅' : '⚪'}
              </button>
            )}

            <Badge variant={getPosVariant(vocabItem.partOfSpeech)}>
              {vocabItem.partOfSpeech}
            </Badge>

            {isMastered && (
              <Badge variant="success">Mastered</Badge>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {vocabItem.lesson && (
              <a
                href={`#slides-${vocabItem.lesson}-slide-${vocabSlide}`}
                onClick={handleLessonLinkClick}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-alt)',
                }}
              >
                🖼️ Slide {vocabSlide}
              </a>
            )}
          </div>
        </div>

        {/* Word Title & Audio */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.2rem' }}>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
            {vocabItem.word}
          </h3>
          {onSpeak && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(vocabItem.word)}
              ariaLabel={`Listen to Tagalog pronunciation of ${vocabItem.word}`}
              style={{ padding: '0.2rem 0.4rem', fontSize: '1rem' }}
            >
              🔊
            </Button>
          )}
        </div>

        {/* English Translation */}
        {(vocabItem.meaning || vocabItem.translation) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-surface-alt)',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                letterSpacing: '0.04em',
              }}
            >
              EN
            </span>
            <span style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {vocabItem.meaning || vocabItem.translation}
            </span>
          </div>
        )}

        {/* Phonetics / Notes */}
        {vocabItem.phonetic && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
            [{vocabItem.phonetic}]
          </p>
        )}
      </div>

      {/* Example Sentences */}
      {vocabItem.example && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof vocabItem.example === 'string' ? vocabItem.example : vocabItem.example.tagalog}
          </div>
          {vocabItem.example.english && (
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.15rem' }}>
              {vocabItem.example.english}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
