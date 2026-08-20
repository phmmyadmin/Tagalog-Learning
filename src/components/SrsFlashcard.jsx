import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { previewNextIntervals, RATING } from '../utils/fsrsEngine';

/**
 * SrsFlashcard Component - Interactive 3D flip SRS flashcard with rating controls & FSRS intervals.
 */
export default function SrsFlashcard({
  currentCard,
  totalDue = 1,
  currentIndex = 0,
  isMastered = false,
  canUndo = false,
  onRateCard,
  onUndoCard,
  onSpeak,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setIsFlipped(false);
    startTimeRef.current = Date.now();
  }, [currentCard?.id]);

  const intervals = previewNextIntervals(currentCard?.srs);

  const handleRate = (ratingName) => {
    const timeMs = Date.now() - startTimeRef.current;
    onRateCard(ratingName, timeMs);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
        if (canUndo && onUndoCard) {
          e.preventDefault();
          onUndoCard();
        }
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRateCard, onUndoCard, canUndo]);

  if (!currentCard) return null;

  const cardStateStr = currentCard.srs?.state || 'new';

  const getStateBadgeVariant = (state) => {
    if (state === 'new') return 'primary';
    if (state === 'learning' || state === 'relearning') return 'warning';
    if (state === 'review') return 'success';
    return 'default';
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Session Progress Header + Undo Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <ProgressBar
            value={currentIndex + 1}
            max={totalDue}
            label={`Card ${currentIndex + 1} of ${totalDue}`}
            color="var(--accent-primary)"
          />
        </div>
        {canUndo && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onUndoCard) onUndoCard();
            }}
            ariaLabel="Undo / Go back to previous card"
            icon={<span>↩️</span>}
          >
            Deshacer
          </Button>
        )}
      </div>

      {/* Flashcard Container */}
      <Card
        variant="default"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem',
          cursor: 'pointer',
          border: '2px solid var(--accent-primary)',
          backgroundColor: isFlipped ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
      >
        {!isFlipped ? (
          /* FRONT SIDE */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant={getStateBadgeVariant(cardStateStr)}>
                {cardStateStr.toUpperCase()}
              </Badge>
              <Badge variant="primary">{currentCard.partOfSpeech || 'Vocabulary'}</Badge>
              {isMastered && <Badge variant="success">✅ Mastered</Badge>}
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {currentCard.word}
            </h2>
            {currentCard.word && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(currentCard.word);
                }}
                ariaLabel={`Listen to ${currentCard.word}`}
              >
                🔊 Listen
              </Button>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Click or press <kbd style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)' }}>Space</kbd> to reveal answer
            </span>
          </div>
        ) : (
          /* BACK SIDE */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="success">Answer</Badge>
              <Badge variant={getStateBadgeVariant(cardStateStr)}>
                {cardStateStr.toUpperCase()}
              </Badge>
              {isMastered && <Badge variant="success">✅ Mastered</Badge>}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {currentCard.meaning}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <strong>{currentCard.word}</strong> ({currentCard.partOfSpeech})
            </p>

            {currentCard.example && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.875rem',
                  maxWidth: '420px',
                  color: 'var(--text-primary)',
                }}
              >
                {typeof currentCard.example === 'string' ? currentCard.example : currentCard.example.tagalog}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* SRS Rating Buttons (Only visible when flipped) */}
      {isFlipped ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
          {/* AGAIN */}
          <button
            type="button"
            onClick={() => handleRate('again')}
            className="srs-rate-btn srs-rate-again"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-danger-light)',
              color: 'var(--accent-danger)',
              border: '1.5px solid rgba(220, 38, 38, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>1. Again</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.AGAIN]}
            </span>
          </button>

          {/* HARD */}
          <button
            type="button"
            onClick={() => handleRate('hard')}
            className="srs-rate-btn srs-rate-hard"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-warning-light)',
              color: 'var(--accent-warning)',
              border: '1.5px solid rgba(217, 119, 6, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>2. Hard</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.HARD]}
            </span>
          </button>

          {/* GOOD */}
          <button
            type="button"
            onClick={() => handleRate('good')}
            className="srs-rate-btn srs-rate-good"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              border: '1.5px solid rgba(37, 99, 235, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>3. Good</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.GOOD]}
            </span>
          </button>

          {/* EASY */}
          <button
            type="button"
            onClick={() => handleRate('easy')}
            className="srs-rate-btn srs-rate-easy"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-success-light)',
              color: 'var(--accent-success)',
              border: '1.5px solid rgba(22, 163, 74, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>4. Easy ⭐</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.EASY]}
            </span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setIsFlipped(true)}>
            Show Answer (Space)
          </Button>
        </div>
      )}
    </div>
  );
}
