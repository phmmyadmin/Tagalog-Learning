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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setIsFlipped(false);
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    startTimeRef.current = Date.now();
  }, [currentCard?.id, currentIndex]);

  const intervals = previewNextIntervals(currentCard?.srs);

  const handleRate = (ratingName) => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const timeMs = Date.now() - startTimeRef.current;
    onRateCard(ratingName, timeMs);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.repeat) return; // Prevent key repeat when holding keys down

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
        if (canUndo && onUndoCard && !isSubmittingRef.current) {
          e.preventDefault();
          onUndoCard();
        }
      } else if (isFlipped && !isSubmittingRef.current) {
        if (e.key === '1') { e.preventDefault(); handleRate('again'); }
        if (e.key === '2') { e.preventDefault(); handleRate('hard'); }
        if (e.key === '3') { e.preventDefault(); handleRate('good'); }
        if (e.key === '4') { e.preventDefault(); handleRate('easy'); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isSubmitting, onRateCard, onUndoCard, canUndo]);

  if (!currentCard) return null;

  const cardStateStr = currentCard.srs?.state || 'new';

  const getStateBadgeVariant = (state) => {
    if (state === 'new') return 'primary';
    if (state === 'learning' || state === 'relearning') return 'warning';
    if (state === 'review') return 'success';
    return 'default';
  };

  const isReverse = currentCard.cardDirection === 'reverse';

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
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem',
          cursor: 'pointer',
          border: isReverse ? '2px solid var(--accent-secondary, #D97706)' : '2px solid var(--accent-primary)',
          backgroundColor: isFlipped ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
      >
        {!isFlipped ? (
          /* FRONT SIDE */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Badge variant={isReverse ? 'warning' : 'primary'}>
                {isReverse ? '🇬🇧 English ➔ 🇵🇭 Tagalog' : '🇵🇭 Tagalog ➔ 🇬🇧 English'}
              </Badge>
              <Badge variant={getStateBadgeVariant(cardStateStr)}>
                {cardStateStr.toUpperCase()}
              </Badge>
              <Badge variant="default">{currentCard.partOfSpeech || 'Vocabulary'}</Badge>
              {isMastered && <Badge variant="success">✅ Mastered</Badge>}
            </div>

            {/* Front Prompt Text */}
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {isReverse ? currentCard.meaning : currentCard.word}
            </h2>

            {/* Sub-prompt if reverse */}
            {isReverse && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                ¿Cómo se dice en Tagalo? / What is the Tagalog word?
              </p>
            )}

            {!isReverse && currentCard.word && (
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

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Click or press <kbd style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)' }}>Space</kbd> to reveal answer
            </span>
          </div>
        ) : (
          /* BACK SIDE */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Badge variant="success">
                {isReverse ? '🇵🇭 Tagalog Answer' : '🇬🇧 English Answer'}
              </Badge>
              <Badge variant={getStateBadgeVariant(cardStateStr)}>
                {cardStateStr.toUpperCase()}
              </Badge>
              {isMastered && <Badge variant="success">✅ Mastered</Badge>}
            </div>

            {/* Back Answer Text */}
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {isReverse ? currentCard.word : currentCard.meaning}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                <strong>{isReverse ? currentCard.meaning : currentCard.word}</strong> ({currentCard.partOfSpeech})
              </p>
              {currentCard.word && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(currentCard.word);
                  }}
                  ariaLabel={`Listen to pronunciation of ${currentCard.word}`}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                >
                  🔊 Listen
                </Button>
              )}
            </div>

            {currentCard.example && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.875rem',
                  maxWidth: '440px',
                  color: 'var(--text-primary)',
                  marginTop: '0.25rem',
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
            disabled={isSubmitting}
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
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.15s ease',
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
            disabled={isSubmitting}
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
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.15s ease',
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
            disabled={isSubmitting}
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
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.15s ease',
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
            disabled={isSubmitting}
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
              border: '1.5px solid rgba(220, 38, 38, 0.3)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.15s ease',
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
