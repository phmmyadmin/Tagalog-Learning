/**
 * SRS Queue Builder Utility
 * Builds an intelligent study queue: Learning/Relearning -> Due Review -> New cards.
 */

import { getSrsCardStates, getSrsSettings } from './srsStore';

/**
 * Builds prioritized study queue from filtered vocabulary list.
 *
 * @param {Array} vocabularyList - Available vocabulary items
 * @param {Object} customSettings - Optional override settings
 * @param {Date} now - Current date
 */
export function buildStudyQueue(vocabularyList = [], customSettings = null, now = new Date()) {
  const settings = customSettings || getSrsSettings();
  const cardStates = getSrsCardStates();
  const nowTime = now.getTime();

  const learningQueue = [];
  const relearningQueue = [];
  const dueReviewQueue = [];
  const newQueue = [];
  const upcomingQueue = [];

  // Track daily new cards count
  let newSeenToday = 0;
  const todayStr = now.toISOString().split('T')[0];

  vocabularyList.forEach((item) => {
    const cardState = cardStates[item.id] || {
      id: item.id,
      state: 'new',
      due: null,
      lastReview: null,
    };

    const cardWithMeta = {
      ...item,
      srs: cardState,
    };

    if (cardState.state === 'learning') {
      learningQueue.push(cardWithMeta);
    } else if (cardState.state === 'relearning') {
      relearningQueue.push(cardWithMeta);
    } else if (cardState.state === 'review') {
      const dueTime = cardState.due ? new Date(cardState.due).getTime() : 0;
      if (dueTime <= nowTime) {
        dueReviewQueue.push(cardWithMeta);
      } else {
        upcomingQueue.push(cardWithMeta);
      }
    } else {
      // New cards
      const lastReviewStr = cardState.lastReview ? cardState.lastReview.split('T')[0] : null;
      if (lastReviewStr === todayStr) {
        newSeenToday++;
      }
      newQueue.push(cardWithMeta);
    }
  });

  // Sort due review cards by overdue duration (most overdue first)
  dueReviewQueue.sort((a, b) => {
    const timeA = a.srs.due ? new Date(a.srs.due).getTime() : 0;
    const timeB = b.srs.due ? new Date(b.srs.due).getTime() : 0;
    return timeA - timeB;
  });

  // Limit new cards per daily setting
  const allowedNewCount = Math.max(0, settings.newCardsPerDay - newSeenToday);
  const selectedNewCards = newQueue.slice(0, allowedNewCount);

  // Combine queues into final prioritized study queue
  // Priority: Learning/Relearning -> Due Reviews -> New Cards
  const fullQueue = [
    ...learningQueue,
    ...relearningQueue,
    ...dueReviewQueue,
    ...selectedNewCards,
  ];

  return {
    queue: fullQueue,
    counts: {
      learning: learningQueue.length + relearningQueue.length,
      review: dueReviewQueue.length,
      new: selectedNewCards.length,
      totalDue: fullQueue.length,
      totalNewAvailable: newQueue.length,
      upcoming: upcomingQueue.length,
    },
  };
}
