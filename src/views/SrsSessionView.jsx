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

export function normalizeSrsRating(ratingParam) {
  if (ratingParam === RATING.AGAIN || ratingParam === 'again' || ratingParam === '1' || ratingParam === 1 || ratingParam === 'AGAIN') {
    return { ratingGrade: RATING.AGAIN, ratingName: 'again' };
  }
  if (ratingParam === RATING.HARD || ratingParam === 'hard' || ratingParam === '2' || ratingParam === 2 || ratingParam === 'HARD') {
    return { ratingGrade: RATING.HARD, ratingName: 'hard' };
  }
  if (ratingParam === RATING.GOOD || ratingParam === 'good' || ratingParam === '3' || ratingParam === 3 || ratingParam === 'GOOD') {
    return { ratingGrade: RATING.GOOD, ratingName: 'good' };
  }
  if (ratingParam === RATING.EASY || ratingParam === 'easy' || ratingParam === '4' || ratingParam === 4 || ratingParam === 'EASY') {
    return { ratingGrade: RATING.EASY, ratingName: 'easy' };
  }
  return { ratingGrade: RATING.GOOD, ratingName: 'good' };
}

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

  const handleRateCard = (ratingInput, timeMs = 0) => {
    if (!currentCard || isRatingInProgressRef.current) return;
    isRatingInProgressRef.current = true;

    const { ratingGrade, ratingName } = normalizeSrsRating(ratingInput);

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
          title="All caught up for today!"
          description="You have completed all scheduled reviews and new cards for today. You can adjust your daily limits in Settings (⚙️) or review all available words right now."
          actionLabel="🔄 Check Due Cards"
          onAction={() => initQueue(false)}
        />
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="md" onClick={() => initQueue(true)} icon={<span>⚡</span>}>
            Study all cards now (Cram Mode)
          </Button>
          {onOpenSettings && (
            <Button variant="secondary" size="md" onClick={onOpenSettings} icon={<span>⚙️</span>}>
              Adjust daily limits
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
        {/* Study Mode Selector (Classic vs AI Conversational) */}
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
          aria-label="Select study mode"
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
            🎴 Classic
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
            title="Interactive mode with voice/text evaluation and response time scoring"
          >
            🎙️ AI Tutor
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
          aria-label="Select card prompt direction"
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
            title="Show Tagalog word on front"
          >
            🇵🇭 Tagalog
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
            title="Show meaning on front to recall Tagalog word"
          >
            🔄 Meaning
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
            title="Randomly mix front side (50% Tagalog / 50% Meaning)"
          >
            🔀 Random
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Remaining: <strong>{sessionQueue.length - currentIndex}</strong>
          </div>
          {onOpenSettings && (
            <Button variant="ghost" size="sm" onClick={onOpenSettings} icon={<span>⚙️</span>}>
              Settings
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
