import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';

/**
 * SrsFlashcard Component - Interactive 3D flip SRS flashcard with rating controls.
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

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

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
        if (e.key === '1') onRateCard('again');
        if (e.key === '2') onRateCard('hard');
        if (e.key === '3') onRateCard('good');
        if (e.key === '4') onRateCard('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRateCard, onUndoCard, canUndo]);

  if (!currentCard) return null;

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
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onUndoCard) onUndoCard();
            }}
            ariaLabel="Undo / Go back to previous card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-alt)',
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            ↩️ Deshacer
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          <Button variant="danger" size="md" onClick={() => onRateCard('again')}>
            1. Again
          </Button>
          <Button variant="secondary" size="md" onClick={() => onRateCard('hard')}>
            2. Hard
          </Button>
          <Button variant="primary" size="md" onClick={() => onRateCard('good')}>
            3. Good
          </Button>
          <Button variant="success" size="md" onClick={() => onRateCard('easy')}>
            4. Easy ⭐
          </Button>
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
