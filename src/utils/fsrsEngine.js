/**
 * FSRS-5 (Free Spaced Repetition Scheduler) Algorithm Engine
 * Implementation based on the 19-parameter DSR (Difficulty, Stability, Retrievability) cognitive memory model.
 */

export const FSRS_DEFAULT_WEIGHTS = [
  0.40255,  // w0: S0(Again)
  1.18385,  // w1: S0(Hard)
  3.17300,  // w2: S0(Good)
  15.69105, // w3: S0(Easy)
  7.19490,  // w4: D0 base
  0.53450,  // w5: D0 exponent
  1.46040,  // w6: Difficulty step scale
  0.00460,  // w7: Mean reversion weight
  1.54575,  // w8: Recall stability scale
  0.11920,  // w9: Stability negative power
  1.01925,  // w10: Retrievability boost factor
  1.93950,  // w11: Forget stability scale
  0.11000,  // w12: Forget difficulty power
  0.29605,  // w13: Forget stability power
  2.26980,  // w14: Forget retrievability factor
  0.23150,  // w15: Hard penalty multiplier
  2.98980,  // w16: Easy bonus multiplier
  0.51655,  // w17: Same-day review weight
  0.66210   // w18: Same-day review offset
];

export const RATING = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
};

export const FSRS_CONFIG = {
  requestedRetention: 0.90, // Target retention rate (90%)
  maximumInterval: 365,     // Maximum allowed interval in days
  factor: 19 / 81,          // Constant for 90% retention at t = S
  decay: 0.5,               // Power law decay exponent
};

/**
 * Calculates current Retrievability R(t, S) - probability of recall.
 * Formula: R(t, S) = (1 + (19/81) * (t / S))^(-0.5)
 */
export function getRetrievability(elapsedDays, stability) {
  if (!stability || stability <= 0) return 0;
  if (elapsedDays <= 0) return 1.0;
  return Math.pow(1 + (FSRS_CONFIG.factor * elapsedDays) / stability, -FSRS_CONFIG.decay);
}

/**
 * Calculates interval (in days) required to reach target retention rate.
 */
export function calculateInterval(stability, requestedRetention = FSRS_CONFIG.requestedRetention) {
  if (!stability || stability <= 0) return 1;
  const rawInterval = (stability / FSRS_CONFIG.factor) * (Math.pow(requestedRetention, -1 / FSRS_CONFIG.decay) - 1);
  const rounded = Math.round(rawInterval);
  return Math.min(FSRS_CONFIG.maximumInterval, Math.max(1, rounded));
}

/**
 * Calculates initial difficulty D0 for a brand new card given grade G in {1, 2, 3, 4}.
 */
function initDifficulty(grade, w = FSRS_DEFAULT_WEIGHTS) {
  const d0 = w[4] - Math.exp(w[5] * (grade - 1)) + 1;
  return Math.min(10, Math.max(1, d0));
}

/**
 * Updates difficulty D'(D, G) with mean reversion toward Easy initial difficulty.
 */
function nextDifficulty(d, grade, w = FSRS_DEFAULT_WEIGHTS) {
  const deltaD = -w[6] * (grade - 3);
  const dRaw = d + deltaD;
  const d0Easy = initDifficulty(RATING.EASY, w);
  const nextD = w[7] * d0Easy + (1 - w[7]) * dRaw;
  return Math.min(10, Math.max(1, nextD));
}

/**
 * Calculates updated stability on successful recall (grade >= 2).
 */
function nextRecallStability(d, s, r, grade, w = FSRS_DEFAULT_WEIGHTS) {
  const hardPenalty = grade === RATING.HARD ? w[15] : 1.0;
  const easyBonus = grade === RATING.EASY ? w[16] : 1.0;
  const sInc =
    Math.exp(w[8]) *
    (11 - d) *
    Math.pow(s, -w[9]) *
    (Math.exp((1 - r) * w[10]) - 1) *
    hardPenalty *
    easyBonus;
  return s * (1 + sInc);
}

/**
 * Calculates updated stability on lapse / forget (grade == 1).
 */
function nextForgetStability(d, s, r, w = FSRS_DEFAULT_WEIGHTS) {
  const sForget =
    w[11] *
    Math.pow(d, -w[12]) *
    (Math.pow(s + 1, w[13]) - 1) *
    Math.exp((1 - r) * w[14]);
  return Math.min(sForget, s);
}

/**
 * Processes a card review and returns new card state + next due date + review log payload.
 *
 * @param {Object} cardState - Existing card state or null for new card
 * @param {number} rating - Grade: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
 * @param {Date} now - Current date
 * @param {number} requestedRetention - Target retention
 * @param {Array} customWeights - Custom FSRS weights
 */
export function scheduleReview(cardState, rating, now = new Date(), requestedRetention = FSRS_CONFIG.requestedRetention, customWeights = FSRS_DEFAULT_WEIGHTS) {
  const w = customWeights;
  const nowIso = now.toISOString();

  // If card is brand new
  if (!cardState || cardState.state === 'new' || !cardState.lastReview) {
    const s0 = w[rating - 1];
    const d0 = initDifficulty(rating, w);
    const intervalDays = rating === RATING.AGAIN ? 0 : calculateInterval(s0, requestedRetention);

    const due = new Date(now.getTime() + (rating === RATING.AGAIN ? 60 * 1000 : intervalDays * 86400 * 1000)).toISOString();

    return {
      updatedCard: {
        stability: s0,
        difficulty: d0,
        due,
        lastReview: nowIso,
        state: rating === RATING.AGAIN ? 'learning' : 'review',
        reps: rating === RATING.AGAIN ? 0 : 1,
        lapses: rating === RATING.AGAIN ? 1 : 0,
        learningStep: rating === RATING.AGAIN ? 0 : 1,
        totalReviews: (cardState?.totalReviews || 0) + 1,
        totalCorrect: rating >= RATING.HARD ? (cardState?.totalCorrect || 0) + 1 : (cardState?.totalCorrect || 0),
        streak: rating >= RATING.HARD ? (cardState?.streak || 0) + 1 : 0,
        bestStreak: Math.max(cardState?.bestStreak || 0, rating >= RATING.HARD ? (cardState?.streak || 0) + 1 : 0),
      },
      intervalDays,
      due,
    };
  }

  // Existing card review
  const lastReviewDate = new Date(cardState.lastReview);
  const elapsedDays = Math.max(0, (now.getTime() - lastReviewDate.getTime()) / (86400 * 1000));
  const s = cardState.stability || 1.0;
  const d = cardState.difficulty || 5.0;
  const r = getRetrievability(elapsedDays, s);

  const nextD = nextDifficulty(d, rating, w);
  let nextS;

  if (elapsedDays < 1) {
    // Same-day review heuristic
    nextS = s * Math.exp(w[17] * (rating - 3 + w[18]));
  } else if (rating === RATING.AGAIN) {
    nextS = nextForgetStability(nextD, s, r, w);
  } else {
    nextS = nextRecallStability(nextD, s, r, rating, w);
  }

  // Determine next card state & interval
  let newState = cardState.state;
  let intervalDays = 0;
  let due;

  if (rating === RATING.AGAIN) {
    newState = 'relearning';
    intervalDays = 0;
    due = new Date(now.getTime() + 10 * 60 * 1000).toISOString(); // 10 minutes
  } else {
    newState = 'review';
    intervalDays = calculateInterval(nextS, requestedRetention);
    due = new Date(now.getTime() + intervalDays * 86400 * 1000).toISOString();
  }

  const newLapses = rating === RATING.AGAIN ? (cardState.lapses || 0) + 1 : (cardState.lapses || 0);
  const newReps = rating === RATING.AGAIN ? 0 : (cardState.reps || 0) + 1;
  const newStreak = rating >= RATING.HARD ? (cardState.streak || 0) + 1 : 0;

  return {
    updatedCard: {
      ...cardState,
      stability: nextS,
      difficulty: nextD,
      due,
      lastReview: nowIso,
      state: newState,
      reps: newReps,
      lapses: newLapses,
      totalReviews: (cardState.totalReviews || 0) + 1,
      totalCorrect: rating >= RATING.HARD ? (cardState.totalCorrect || 0) + 1 : (cardState.totalCorrect || 0),
      streak: newStreak,
      bestStreak: Math.max(cardState.bestStreak || 0, newStreak),
    },
    intervalDays,
    due,
  };
}

/**
 * Previews human-readable interval text for each of the 4 rating buttons.
 * Example: "< 1m", "< 10m", "1d", "4d"
 */
export function previewNextIntervals(cardState, now = new Date(), requestedRetention = FSRS_CONFIG.requestedRetention) {
  const result = {};
  [RATING.AGAIN, RATING.HARD, RATING.GOOD, RATING.EASY].forEach((rating) => {
    const outcome = scheduleReview(cardState, rating, now, requestedRetention);
    const intervalDays = outcome.intervalDays;

    if (rating === RATING.AGAIN) {
      result[rating] = '< 1m';
    } else if (intervalDays === 0) {
      result[rating] = '< 10m';
    } else if (intervalDays === 1) {
      result[rating] = '1d';
    } else {
      result[rating] = `${intervalDays}d`;
    }
  });
  return result;
}
