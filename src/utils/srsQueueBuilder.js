/**
 * SRS Queue Builder Utility
 * Builds an intelligent study queue: Learning/Relearning -> Due Review -> New cards.
 */

import { getSrsCardStates, getSrsSettings, getReviewLog } from './srsStore';

/**
 * Builds prioritized study queue from filtered vocabulary list.
 *
 * @param {Array} vocabularyList - Available vocabulary items
 * @param {Object} customSettings - Optional override settings
 * @param {Date} now - Current date
 * @param {Object} options - { includeUpcoming: boolean } for cram mode
 */
export function buildStudyQueue(vocabularyList = [], customSettings = null, now = new Date(), options = {}) {
  const settings = customSettings || getSrsSettings();
  const cardStates = getSrsCardStates();
  const log = getReviewLog();

  const todayStr = now.toISOString().split('T')[0];

  // Count new cards introduced today from review log
  const newSeenToday = log.filter(
    (e) => e.timestamp && e.timestamp.startsWith(todayStr) && e.stateBefore === 'new'
  ).length;

  const learningQueue = [];
  const relearningQueue = [];
  const dueReviewQueue = [];
  const newQueue = [];
  const upcomingQueue = [];

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
      const cardDueDateStr = cardState.due ? cardState.due.split('T')[0] : null;
      // Date-based comparison: due if date is today or earlier
      if (!cardDueDateStr || cardDueDateStr <= todayStr) {
        dueReviewQueue.push(cardWithMeta);
      } else {
        upcomingQueue.push(cardWithMeta);
      }
    } else {
      // New cards
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

  let finalQueue = [
    ...learningQueue,
    ...relearningQueue,
    ...dueReviewQueue,
    ...selectedNewCards,
  ];

  // Cram Mode / Include All Available & Upcoming cards if requested
  if (options.includeUpcoming) {
    upcomingQueue.sort((a, b) => {
      const timeA = a.srs.due ? new Date(a.srs.due).getTime() : 0;
      const timeB = b.srs.due ? new Date(b.srs.due).getTime() : 0;
      return timeA - timeB;
    });
    // In Cram mode, bypass daily limit to allow studying all unreviewed new cards + upcoming reviews
    finalQueue = [
      ...learningQueue,
      ...relearningQueue,
      ...dueReviewQueue,
      ...newQueue,
      ...upcomingQueue,
    ];
  }

  return {
    queue: finalQueue,
    counts: {
      learning: learningQueue.length + relearningQueue.length,
      review: dueReviewQueue.length,
      new: selectedNewCards.length,
      totalDue: finalQueue.length,
      totalNewAvailable: newQueue.length,
      upcoming: upcomingQueue.length,
    },
  };
}
