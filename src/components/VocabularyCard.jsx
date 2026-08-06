import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import slideMap from '../data/slideMap.json';

/**
 * VocabularyCard Component - Warm light card displaying word, POS badge, phonetics, audio synthesis, and example sentences.
 */
export default function VocabularyCard({ vocabItem, srsStatus, onSpeak, onOpenLesson }) {
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
      }}
      className="animate-fade-in"
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <Badge variant={getPosVariant(vocabItem.partOfSpeech)}>
            {vocabItem.partOfSpeech}
          </Badge>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {vocabItem.lesson && (
              <a
                href={`#slides?lesson=${vocabItem.lesson}&slide=${vocabSlide}`}
                onClick={handleLessonLinkClick}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
                title={`Open ${vocabItem.lesson.replace('_', ' ')} Slide ${vocabSlide}`}
              >
                🖼️ {vocabItem.lesson.replace('_', ' ')} (p. {vocabSlide})
              </a>
            )}
            {srsStatus && srsStatus.interval >= 3 && (
              <Badge variant="success" size="sm">Mastered</Badge>
            )}
          </div>
        </div>

        {/* Word + Audio button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {vocabItem.word}
          </h3>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSpeak(vocabItem.word)}
            ariaLabel={`Listen to pronunciation of ${vocabItem.word}`}
            style={{ fontSize: '1.25rem', padding: '0.25rem' }}
          >
            🔊
          </Button>
        </div>

        {/* Phonetic Pronunciation if present */}
        {vocabItem.phonetic && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            /{vocabItem.phonetic}/
          </span>
        )}

        {/* English Meaning */}
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          {vocabItem.meaning}
        </p>

        {/* Example Sentence */}
        {vocabItem.example && (
          <div
            style={{
              padding: '0.75rem 0.85rem',
              backgroundColor: 'var(--bg-surface-alt)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--accent-primary)',
              fontSize: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {typeof vocabItem.example === 'string' ? vocabItem.example : vocabItem.example.tagalog}
            </span>
            {typeof vocabItem.example === 'object' && vocabItem.example.english && (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {vocabItem.example.english}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
