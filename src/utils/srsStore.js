/**
 * SRS Storage & State Management Utility
 * Manages card states, review logs, settings, and legacy masteredIds migration.
 */

const STORAGE_KEYS = {
  SRS_CARDS: 'tagalog_srs_cards_v2',
  REVIEW_LOG: 'tagalog_srs_review_log_v2',
  SETTINGS: 'tagalog_srs_settings_v2',
};

export const DEFAULT_SETTINGS = {
  newCardsPerDay: 10,
  maxReviewsPerDay: 50,
  requestedRetention: 0.90,
  interleaveNew: true,
  enableTimer: true,
  cardDirection: 'random', // 'random' | 'forward' | 'reverse'
};

/**
 * Safe JSON parser with fallback.
 */
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * Gets all saved SRS card states Map (id -> cardState).
 */
export function getSrsCardStates() {
  return safeParse(STORAGE_KEYS.SRS_CARDS, {});
}

/**
 * Saves SRS card states object to localStorage.
 */
export function saveSrsCardStates(cardsMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.SRS_CARDS, JSON.stringify(cardsMap));
    window.dispatchEvent(new Event('tagalog_srs_updated'));
  } catch (e) {
    console.error('Failed to save SRS card states:', e);
  }
}

/**
 * Gets single card SRS state or constructs a default 'new' state.
 */
export function getCardState(cardId) {
  const cards = getSrsCardStates();
  if (cards[cardId]) {
    return cards[cardId];
  }
  return {
    id: cardId,
    stability: 0,
    difficulty: 0,
    due: null,
    lastReview: null,
    state: 'new',
    reps: 0,
    lapses: 0,
    learningStep: 0,
    totalReviews: 0,
    totalCorrect: 0,
    streak: 0,
    bestStreak: 0,
  };
}

/**
 * Updates a single card state in storage.
 */
export function updateCardState(cardId, newCardState) {
  const cards = getSrsCardStates();
  cards[cardId] = {
    ...cards[cardId],
    ...newCardState,
    id: cardId,
  };
  saveSrsCardStates(cards);
  return cards[cardId];
}

/**
 * Removes multiple cards from SRS storage.
 */
export function removeCardStatesByIds(cardIds = []) {
  if (!Array.isArray(cardIds) || cardIds.length === 0) return;
  const cards = getSrsCardStates();
  let modified = false;
  cardIds.forEach((id) => {
    if (cards[id]) {
      delete cards[id];
      modified = true;
    }
  });
  if (modified) {
    saveSrsCardStates(cards);
  }
}

/**
 * Gets all review log entries.
 */
export function getReviewLog() {
  return safeParse(STORAGE_KEYS.REVIEW_LOG, []);
}

/**
 * Adds a new review log entry.
 */
export function addReviewLogEntry(entry) {
  const log = getReviewLog();
  const newEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const updatedLog = [...log, newEntry];
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEW_LOG, JSON.stringify(updatedLog));
  } catch (e) {
    console.error('Failed to save review log:', e);
  }
  return newEntry;
}

/**
 * Gets SRS Settings.
 */
export function getSrsSettings() {
  return {
    ...DEFAULT_SETTINGS,
    ...safeParse(STORAGE_KEYS.SETTINGS, {}),
  };
}

/**
 * Saves SRS Settings.
 */
export function saveSrsSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save SRS settings:', e);
  }
}

/**
 * Migrates legacy `masteredIds` to SRS card states if not already done.
 */
export function migrateLegacyMasteredItems(vocabularyList = [], masteredIds = []) {
  const existingCards = getSrsCardStates();
  let modified = false;

  masteredIds.forEach((id) => {
    if (!existingCards[id]) {
      existingCards[id] = {
        id,
        stability: 30, // 30 days stability for legacy mastered items
        difficulty: 3.5,
        due: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        lastReview: new Date().toISOString(),
        state: 'review',
        reps: 5,
        lapses: 0,
        learningStep: 2,
        totalReviews: 5,
        totalCorrect: 5,
        streak: 5,
        bestStreak: 5,
      };
      modified = true;
    }
  });

  if (modified) {
    saveSrsCardStates(existingCards);
  }
}
