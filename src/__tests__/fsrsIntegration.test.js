import { describe, it, expect, beforeEach } from 'vitest';
import { scheduleReview, RATING, getRetrievability } from '../utils/fsrsEngine';
import { buildStudyQueue } from '../utils/srsQueueBuilder';
import {
  getSrsCardStates,
  updateCardState,
  addReviewLogEntry,
  getReviewLog,
  saveSrsSettings,
  DEFAULT_SETTINGS
} from '../utils/srsStore';

describe('FSRS-5 Spaced Repetition Lifecycle Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('progresses a brand new card to review/young status upon Good rating', () => {
    const newCard = { id: 'VOCAB-001', state: 'new' };

    const { updatedCard } = scheduleReview(newCard, RATING.GOOD);

    expect(updatedCard.state).toBe('review');
    expect(updatedCard.reps).toBe(1);
    expect(updatedCard.stability).toBeGreaterThan(0);
    expect(updatedCard.due).toBeDefined();

    // Verify retrievability computation (elapsedDays = 0)
    const retrievability = getRetrievability(0, updatedCard.stability);
    expect(retrievability).toBeGreaterThanOrEqual(0.9);
  });

  it('resets a card to learning/relearning upon Again rating', () => {
    const matureCard = {
      id: 'VOCAB-002',
      state: 'review',
      reps: 5,
      stability: 30,
      difficulty: 4.5,
      lapses: 0,
      lastReview: new Date(Date.now() - 5 * 86400000).toISOString()
    };

    const { updatedCard } = scheduleReview(matureCard, RATING.AGAIN);

    expect(updatedCard.state).toBe('relearning');
    expect(updatedCard.lapses).toBe(1);
    expect(updatedCard.stability).toBeLessThan(30);
  });

  it('respects daily new card limits in default study queue mode', () => {
    saveSrsSettings({ ...DEFAULT_SETTINGS, newCardsPerDay: 5 });

    const mockVocabulary = Array.from({ length: 20 }).map((_, i) => ({
      id: `VOCAB-${i + 1}`,
      word: `Word ${i + 1}`,
      meaning: `Meaning ${i + 1}`,
      lesson: 'Lesson_02'
    }));

    const result = buildStudyQueue(mockVocabulary, { newCardsPerDay: 5 }, new Date(), { includeUpcoming: false });

    // Should only schedule 5 new cards for today
    expect(result.counts.new).toBe(5);
    expect(result.queue).toHaveLength(5);
    expect(result.counts.totalNewAvailable).toBe(20);
  });

  it('bypasses daily limits in Cram mode to load all available unreviewed new cards', () => {
    const mockVocabulary = Array.from({ length: 25 }).map((_, i) => ({
      id: `VOCAB-${i + 1}`,
      word: `Word ${i + 1}`,
      meaning: `Meaning ${i + 1}`,
      lesson: 'Lesson_02'
    }));

    // In Cram mode, all 25 new cards are scheduled
    const result = buildStudyQueue(mockVocabulary, { newCardsPerDay: 5 }, new Date(), { includeUpcoming: true });

    expect(result.queue).toHaveLength(25);
  });

  it('correctly persists review logs and card states in srsStore', () => {
    const cardId = 'VOCAB-TEST-100';
    const cardState = { id: cardId, state: 'review', stability: 12.5, reps: 2 };

    updateCardState(cardId, cardState);
    const savedStates = getSrsCardStates();
    expect(savedStates[cardId]).toEqual(cardState);

    addReviewLogEntry({
      cardId,
      rating: RATING.GOOD,
      ratingName: 'good',
      timeMs: 2500,
      stateBefore: 'new',
      stateAfter: 'review'
    });

    const logs = getReviewLog();
    expect(logs).toHaveLength(1);
    expect(logs[0].cardId).toBe(cardId);
    expect(logs[0].ratingName).toBe('good');
  });
});
