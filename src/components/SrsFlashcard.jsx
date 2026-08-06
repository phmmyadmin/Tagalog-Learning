import React, { useState, useEffect } from 'react';
import { Volume2, RotateCw, Clock, Presentation } from 'lucide-react';
import slideMap from '../data/slideMap.json';

export default function SrsFlashcard({ 
  currentCard, 
  totalDue, 
  currentIndex, 
  onRateCard, 
  onSpeak,
  onOpenLesson
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

  const cardSlide = currentCard
    ? (slideMap.vocabulary?._keyword_overrides?.[currentCard.id]?.slide ||
       slideMap.vocabulary?._default_slides?.[currentCard.lesson] || 1)
    : 1;

  const handleLessonLinkClick = (e) => {
    e.stopPropagation(); // Don't trigger card flip when clicking lesson badge
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && currentCard?.lesson) {
        onOpenLesson(currentCard.lesson, cardSlide, cardSlide, currentCard.word);
      }
    }
  };

  // Keyboard shortcut handler (Space to flip, 1-4 for rating)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') onRateCard('again');
        if (e.key === '2') onRateCard('hard');
        if (e.key === '3') onRateCard('good');
        if (e.key === '4') onRateCard('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRateCard]);

  if (!currentCard) return null;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      {/* Session Progress Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <span>Reviewing Due Cards</span>
        </div>
        <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
          Card {currentIndex + 1} of {totalDue}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '3px',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.round(((currentIndex + 1) / totalDue) * 100)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* 3D Interactive Card Container */}
      <div 
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? `Flashcard revealed: ${currentCard.word} means ${currentCard.meaning}` : `Flashcard: ${currentCard.word}. Click or press space to flip.`}
        onClick={() => !isFlipped && setIsFlipped(true)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isFlipped) {
            e.preventDefault();
            setIsFlipped(true);
          }
        }}
        className="glass-card"
        style={{
          minHeight: '320px',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          cursor: isFlipped ? 'default' : 'pointer',
          position: 'relative',
          background: isFlipped 
            ? 'linear-gradient(135deg, rgba(18, 24, 38, 0.95) 0%, rgba(28, 37, 56, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(9, 13, 22, 0.9) 0%, rgba(18, 24, 38, 0.95) 100%)',
          border: isFlipped ? '1px solid var(--accent-cyan-glow)' : '1px solid var(--border-color)',
          boxShadow: isFlipped ? '0 0 30px rgba(6, 182, 212, 0.15)' : 'var(--shadow-subtle)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
        }}
      >
        {/* Card Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
            {currentCard.partOfSpeech || 'Vocab'}
          </span>
          {currentCard.lesson && (
            <a
              href={`#slides?lesson=${currentCard.lesson}&slide=${cardSlide}`}
              onClick={handleLessonLinkClick}
              className="badge badge-indigo"
              style={{
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer'
              }}
              title={`Open ${currentCard.lesson.replace('_', ' ')} Slide ${cardSlide}`}
            >
              <Presentation size={12} aria-hidden="true" />
              {currentCard.lesson.replace('_', ' ')} (p. {cardSlide})
            </a>
          )}
        </div>

        {/* Front Content (Tagalog Word) */}
        <div style={{ margin: '1.5rem 0' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tagalog Term
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {currentCard.word}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(currentCard.word);
              }}
              aria-label={`Listen to Tagalog pronunciation of ${currentCard.word}`}
              className="btn-primary"
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Listen to Tagalog pronunciation"
            >
              <Volume2 size={20} aria-hidden="true" />
            </button>
          </div>

          {!isFlipped && (
            <p style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', marginTop: '1.5rem', opacity: 0.8 }}>
              💡 Click card or press [Space] to reveal English meaning
            </p>
          )}
        </div>

        {/* Back Content (English Translation & Usage Example) */}
        {isFlipped ? (
          <div className="animate-fade-in" style={{ width: '100%', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              English Meaning
            </div>
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
              {currentCard.meaning}
            </h3>

            {currentCard.example && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderLeft: '3px solid var(--accent-indigo)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                textAlign: 'left',
                margin: '0 auto',
                maxWidth: '480px'
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  Example Context:
                </span>
                <em>"{currentCard.example}"</em>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(true);
            }}
            className="btn-secondary"
            aria-label="Flip card to reveal meaning"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
          >
            <RotateCw size={16} aria-hidden="true" /> Flip Card
          </button>
        )}
      </div>

      {/* Spaced Repetition System Rating Controls (Only shown when flipped) */}
      {isFlipped && (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Rate your recall (determines when this card will re-appear):
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem'
          }}>
            {/* 1. Again (<1 min) */}
            <button
              onClick={() => onRateCard('again')}
              aria-label="Rate Again, review in less than 1 minute"
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Again</div>
              <div style={{ fontSize: '0.725rem', opacity: 0.85, marginTop: '0.2rem' }}>&lt; 1 min</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>Key [1]</div>
            </button>

            {/* 2. Hard (1 day) */}
            <button
              onClick={() => onRateCard('hard')}
              aria-label="Rate Hard, review in 1 day"
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Hard</div>
              <div style={{ fontSize: '0.725rem', opacity: 0.85, marginTop: '0.2rem' }}>1 day</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>Key [2]</div>
            </button>

            {/* 3. Good (3 days) */}
            <button
              onClick={() => onRateCard('good')}
              aria-label="Rate Good, review in 3 days"
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Good</div>
              <div style={{ fontSize: '0.725rem', opacity: 0.85, marginTop: '0.2rem' }}>3 days</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>Key [3]</div>
            </button>

            {/* 4. Easy (7 days) */}
            <button
              onClick={() => onRateCard('easy')}
              aria-label="Rate Easy, review in 7 days"
              style={{
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#38bdf8',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Easy</div>
              <div style={{ fontSize: '0.725rem', opacity: 0.85, marginTop: '0.2rem' }}>7 days</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>Key [4]</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
