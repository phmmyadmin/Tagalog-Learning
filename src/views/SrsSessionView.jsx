import React, { useState, useEffect } from 'react';
import SrsFlashcard from '../components/SrsFlashcard';
import SrsSessionSummary from '../components/SrsSessionSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { buildStudyQueue } from '../utils/srsQueueBuilder';
import { scheduleReview, RATING } from '../utils/fsrsEngine';
import { updateCardState, addReviewLogEntry } from '../utils/srsStore';
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

      if (selectedLesson !== 'all' && item.lesson !== selectedLesson && item.lesson !== selectedLesson.replace(' ', '_')) {
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
    if (!currentCard) return;

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
          description="You've completed today's scheduled SRS review queue. You can adjust your daily card limits in Settings (⚙️) or study all available and upcoming words now."
          actionLabel="🔄 Re-check Due Queue"
          onAction={() => initQueue(false)}
        />
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="md" onClick={() => initQueue(true)} icon={<span>⚡</span>}>
            Study All Available Cards Now
          </Button>
          {onOpenSettings && (
            <Button variant="secondary" size="md" onClick={onOpenSettings} icon={<span>⚙️</span>}>
              Adjust Daily Limits
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
      {/* Session Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Queue: <strong>{sessionQueue.length - currentIndex} cards left</strong>
        </div>
        {onOpenSettings && (
          <Button variant="ghost" size="sm" onClick={onOpenSettings} icon={<span>⚙️</span>}>
            Settings
          </Button>
        )}
      </div>

      {/* SrsFlashcard Component */}
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
    </div>
  );
}
