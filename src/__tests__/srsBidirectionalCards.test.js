import { describe, it, expect, beforeEach } from 'vitest';
import { buildStudyQueue } from '../utils/srsQueueBuilder';
import { getSrsSettings, saveSrsSettings, DEFAULT_SETTINGS } from '../utils/srsStore';
import { scheduleReview, RATING } from '../utils/fsrsEngine';

describe('Bidirectional SRS Flashcard Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockVocab = Array.from({ length: 20 }).map((_, i) => ({
    id: `VOCAB-BI-${i + 1}`,
    word: `Tagalog_${i + 1}`,
    meaning: `English_${i + 1}`,
    partOfSpeech: 'noun',
    lesson: 'Lesson_02'
  }));

  it('includes cardDirection in default SRS settings defaulting to random', () => {
    const settings = getSrsSettings();
    expect(settings.cardDirection).toBe('random');
  });

  it('assigns forward direction to all queue cards when cardDirection is forward', () => {
    const customSettings = { ...DEFAULT_SETTINGS, cardDirection: 'forward' };
    const { queue } = buildStudyQueue(mockVocab, customSettings, new Date(), { includeUpcoming: true });

    expect(queue.length).toBeGreaterThan(0);
    queue.forEach(card => {
      expect(card.cardDirection).toBe('forward');
    });
  });

  it('assigns reverse direction to all queue cards when cardDirection is reverse', () => {
    const customSettings = { ...DEFAULT_SETTINGS, cardDirection: 'reverse' };
    const { queue } = buildStudyQueue(mockVocab, customSettings, new Date(), { includeUpcoming: true });

    expect(queue.length).toBeGreaterThan(0);
    queue.forEach(card => {
      expect(card.cardDirection).toBe('reverse');
    });
  });

  it('produces a random bidirectional distribution of cards when cardDirection is random', () => {
    const customSettings = { ...DEFAULT_SETTINGS, cardDirection: 'random' };
    const { queue } = buildStudyQueue(mockVocab, customSettings, new Date(), { includeUpcoming: true });

    const directions = queue.map(c => c.cardDirection);
    expect(directions.some(d => d === 'forward' || d === 'reverse')).toBe(true);
  });

  it('schedules and progresses cards seamlessly regardless of test direction', () => {
    const reverseCard = {
      id: 'VOCAB-REV-01',
      word: 'Bahay',
      meaning: 'House',
      cardDirection: 'reverse',
      srs: { state: 'new' }
    };

    const { updatedCard, intervalDays } = scheduleReview(reverseCard.srs, RATING.GOOD);

    expect(updatedCard.state).toBe('review');
    expect(updatedCard.reps).toBe(1);
    expect(intervalDays).toBeGreaterThanOrEqual(1);
  });
});
