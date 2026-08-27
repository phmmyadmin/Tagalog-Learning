import React, { useState, useEffect, useRef } from 'react';
import SrsFlashcard from '../components/SrsFlashcard';
import SrsAiConversationCard from '../components/SrsAiConversationCard';
import SrsSessionSummary from '../components/SrsSessionSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { buildStudyQueue } from '../utils/srsQueueBuilder';
import { scheduleReview, RATING } from '../utils/fsrsEngine';
import { updateCardState, addReviewLogEntry, getSrsSettings, saveSrsSettings } from '../utils/srsStore';
import { addXpForReview, checkAchievements } from '../utils/gamification';

export default function SrsSessionView({
  vocabularyList = [],
  searchQuery = '',
  selectedLesson = 'all',
  selectedPos = 'all',
  filterMastered = 'all',
  masteredIds = [],
  onToggleMastered,
  onOpenSettings,
  onSpeak,
}) {
  const [sessionQueue, setSessionQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [historyStack, setHistoryStack] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studyMode, setStudyMode] = useState('classic'); // 'classic' | 'conversational'
  const [cardDirection, setCardDirection] = useState(() => getSrsSettings().cardDirection || 'random');
  const isRatingInProgressRef = useRef(false);
  const [sessionStats, setSessionStats] = useState({
    totalReviewed: 0,
    againCount: 0,
    hardCount: 0,
    goodCount: 0,
    easyCount: 0,
    totalTimeMs: 0,
    xpEarned: 0,
    newlyUnlocked: [],
  });

  // Filter key to initialize queue ONCE when filters change (not when card states mutate)
  const filterKey = `${vocabularyList.length}_${searchQuery}_${selectedLesson}_${selectedPos}_${filterMastered}`;

  // Sync direction setting if changed externally
  useEffect(() => {
    const handleSrsUpdate = () => {
      const current = getSrsSettings().cardDirection || 'random';
      setCardDirection(current);
    };
    window.addEventListener('tagalog_srs_updated', handleSrsUpdate);
    return () => window.removeEventListener('tagalog_srs_updated', handleSrsUpdate);
  }, []);

  const handleDirectionChange = (newDirection) => {
    setCardDirection(newDirection);
    const settings = getSrsSettings();
    saveSrsSettings({ ...settings, cardDirection: newDirection });
    // Dynamically update active queue cards without resetting current index/progress
    setSessionQueue((prevQueue) =>
      prevQueue.map((card) => {
        let dir = 'forward';
        if (newDirection === 'reverse') {
          dir = 'reverse';
        } else if (newDirection === 'random') {
          dir = Math.random() < 0.5 ? 'forward' : 'reverse';
        } else {
          dir = 'forward';
        }
        return {
          ...card,
          cardDirection: dir,
        };
      })
    );
  };

  const matchesLesson = (itemLesson, filter) => {
    if (!filter || filter === 'all') return true;
    if (!itemLesson) return false;
    const parts = String(itemLesson)
      .split(',')
      .map((s) => s.trim().replace('Lesson ', 'Lesson_'));
    const normFilter = filter.replace('Lesson ', 'Lesson_');
    return parts.some((p) => p === normFilter || p === normFilter.replace('Lesson_', ''));
  };

  const initQueue = (includeUpcoming = false) => {
    const baseList = vocabularyList.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchWord = item.word?.toLowerCase().includes(q);
        const matchMeaning = item.meaning?.toLowerCase().includes(q);
        if (!matchWord && !matchMeaning) return false;
      }

      if (selectedPos !== 'all') {
        const p = (item.partOfSpeech || '').toLowerCase();
        if (!p.includes(selectedPos)) return false;
      }

      if (!matchesLesson(item.lesson, selectedLesson)) {
        return false;
      }

      const isMastered = masteredIds.includes(item.id);
      if (filterMastered === 'mastered' && !isMastered) return false;
      if (filterMastered === 'unmastered' && isMastered) return false;

      return true;
    });

    const { queue } = buildStudyQueue(baseList, null, new Date(), { includeUpcoming });
    setSessionQueue(queue);
    setCurrentIndex(0);
    setHistoryStack([]);
    setIsCompleted(false);
    isRatingInProgressRef.current = false;
    setSessionStats({
      totalReviewed: 0,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      totalTimeMs: 0,
      xpEarned: 0,
      newlyUnlocked: [],
    });
  };

  useEffect(() => {
    initQueue(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const currentCard = sessionQueue[currentIndex];

  const handleRateCard = (ratingName, timeMs = 0) => {
    if (!currentCard || isRatingInProgressRef.current) return;
    isRatingInProgressRef.current = true;

    const ratingMap = { again: RATING.AGAIN, hard: RATING.HARD, good: RATING.GOOD, easy: RATING.EASY };
    const ratingGrade = ratingMap[ratingName] || RATING.GOOD;

    const previousSrsState = currentCard.srs;
    const isNew = !previousSrsState || previousSrsState.state === 'new';
    const wasMasteredBefore = masteredIds.includes(currentCard.id);
    let newlyMastered = false;

    // FSRS Schedule
    const { updatedCard } = scheduleReview(previousSrsState, ratingGrade);
    updateCardState(currentCard.id, updatedCard);

    // Auto-master on easy rating if not mastered
    if (ratingName === 'easy' && !wasMasteredBefore && onToggleMastered) {
      onToggleMastered(currentCard.id);
      newlyMastered = true;
    }

    // Add Review Log
    addReviewLogEntry({
      cardId: currentCard.id,
      rating: ratingGrade,
      ratingName,
      timeMs,
      stateBefore: previousSrsState?.state || 'new',
      stateAfter: updatedCard.state,
    });

    // Award XP
    const { xpEarned } = addXpForReview(ratingGrade, isNew, timeMs);

    // Update Session Stats
    setSessionStats((prev) => {
      const nextStats = {
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        againCount: ratingName === 'again' ? prev.againCount + 1 : prev.againCount,
        hardCount: ratingName === 'hard' ? prev.hardCount + 1 : prev.hardCount,
        goodCount: ratingName === 'good' ? prev.goodCount + 1 : prev.goodCount,
        easyCount: ratingName === 'easy' ? prev.easyCount + 1 : prev.easyCount,
        totalTimeMs: prev.totalTimeMs + timeMs,
        xpEarned: prev.xpEarned + xpEarned,
      };

      const unlocked = checkAchievements({
        totalReviews: nextStats.totalReviewed,
        sessionReviews: nextStats.totalReviewed,
        avgTimeMs: nextStats.totalTimeMs / (nextStats.totalReviewed || 1),
      });

      return {
        ...nextStats,
        newlyUnlocked: [...prev.newlyUnlocked, ...unlocked],
      };
    });

    // Record History for Undo
    setHistoryStack((prev) => [
      ...prev,
      {
        index: currentIndex,
        card: currentCard,
        previousSrsState,
        newlyMastered,
      },
    ]);

    // Advance Queue or Finish Session
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }

    // Release rating lock smoothly
    setTimeout(() => {
      isRatingInProgressRef.current = false;
    }, 150);
  };

  const handleUndoCard = () => {
    if (historyStack.length === 0) return;

    const lastState = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));

    // Revert Card State
    if (lastState.previousSrsState) {
      updateCardState(lastState.card.id, lastState.previousSrsState);
    }

    // Revert Mastered state
    if (lastState.newlyMastered && masteredIds.includes(lastState.card.id) && onToggleMastered) {
      onToggleMastered(lastState.card.id);
    }

    setCurrentIndex(lastState.index);
    if (isCompleted) setIsCompleted(false);
  };

  if (!currentCard || isCompleted) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <EmptyState
          icon="🎉"
          title="¡Al día por hoy!"
          description="Has completado todos los repasos y tarjetas nuevas programadas para hoy. Puedes ajustar tus límites diarios en Configuración (⚙️) o estudiar todas las palabras disponibles ahora."
          actionLabel="🔄 Comprobar tarjetas pendientes"
          onAction={() => initQueue(false)}
        />
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="md" onClick={() => initQueue(true)} icon={<span>⚡</span>}>
            Estudiar todas las tarjetas ahora (Modo Cram)
          </Button>
          {onOpenSettings && (
            <Button variant="secondary" size="md" onClick={onOpenSettings} icon={<span>⚙️</span>}>
              Ajustar límites diarios
            </Button>
          )}
        </div>
        {isCompleted && (
          <SrsSessionSummary
            sessionStats={sessionStats}
            onRestart={() => initQueue(false)}
            onClose={() => setIsCompleted(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Session Action Header with Mode Switcher & Direction Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Study Mode Selector (Clásico vs IA Conversacional) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
          }}
          role="group"
          aria-label="Seleccionar modo de estudio"
        >
          <button
            type="button"
            onClick={() => setStudyMode('classic')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: studyMode === 'classic' ? 700 : 500,
              backgroundColor: studyMode === 'classic' ? 'var(--accent-primary)' : 'transparent',
              color: studyMode === 'classic' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
          >
            🎴 Clásico
          </button>
          <button
            type="button"
            onClick={() => setStudyMode('conversational')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: studyMode === 'conversational' ? 700 : 500,
              backgroundColor: studyMode === 'conversational' ? 'var(--accent-primary)' : 'transparent',
              color: studyMode === 'conversational' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
            title="Modo interactivo con evaluación por voz/texto y tiempo de respuesta"
          >
            🎙️ Tutor IA
          </button>
        </div>

        {/* Instant Direction Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
          }}
          role="group"
          aria-label="Seleccionar dirección de tarjeta"
        >
          <button
            type="button"
            onClick={() => handleDirectionChange('forward')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: cardDirection === 'forward' ? 700 : 500,
              backgroundColor: cardDirection === 'forward' ? 'var(--accent-primary)' : 'transparent',
              color: cardDirection === 'forward' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
            title="Mostrar palabra en Tagalo en el anverso"
          >
            🇵🇭 Tagalo
          </button>
          <button
            type="button"
            onClick={() => handleDirectionChange('reverse')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: cardDirection === 'reverse' ? 700 : 500,
              backgroundColor: cardDirection === 'reverse' ? 'var(--accent-primary)' : 'transparent',
              color: cardDirection === 'reverse' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
            title="Mostrar significado (Inglés/Español) en el anverso para recordar la palabra en Tagalo"
          >
            🔄 Significado
          </button>
          <button
            type="button"
            onClick={() => handleDirectionChange('random')}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: cardDirection === 'random' ? 700 : 500,
              backgroundColor: cardDirection === 'random' ? 'var(--accent-primary)' : 'transparent',
              color: cardDirection === 'random' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
            title="Mezclar aleatoriamente el anverso (50% Tagalo / 50% Significado)"
          >
            🔀 Random
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Restantes: <strong>{sessionQueue.length - currentIndex}</strong>
          </div>
          {onOpenSettings && (
            <Button variant="ghost" size="sm" onClick={onOpenSettings} icon={<span>⚙️</span>}>
              Ajustes
            </Button>
          )}
        </div>
      </div>

      {/* Render Active Card Component based on Study Mode */}
      {studyMode === 'conversational' ? (
        <SrsAiConversationCard
          key={currentCard.id}
          card={currentCard}
          cardDirection={currentCard.cardDirection || cardDirection}
          onRate={handleRateCard}
          onOpenSettings={onOpenSettings}
        />
      ) : (
        <SrsFlashcard
          currentCard={currentCard}
          totalDue={sessionQueue.length}
          currentIndex={currentIndex}
          isMastered={masteredIds.includes(currentCard.id)}
          canUndo={historyStack.length > 0}
          onRateCard={handleRateCard}
          onUndoCard={handleUndoCard}
          onSpeak={onSpeak}
        />
      )}
    </div>
  );
}
