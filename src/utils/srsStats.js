/**
 * SRS Analytics & Statistics Engine
 * Calculates retention rates, maturity stages, forecast curves, review histograms, and difficulty distribution.
 */

import { getSrsCardStates, getReviewLog } from './srsStore';
import { getRetrievability } from './fsrsEngine';

/**
 * Maturity classifications:
 * - New: Never studied
 * - Learning: In learning/relearning steps
 * - Young: Stability < 21 days
 * - Mature: Stability >= 21 days
 */
export function getCardMaturityDistribution(vocabularyList = []) {
  const cards = getSrsCardStates();
  let countNew = 0;
  let countLearning = 0;
  let countYoung = 0;
  let countMature = 0;

  vocabularyList.forEach((item) => {
    const c = cards[item.id];
    if (!c || c.state === 'new') {
      countNew++;
    } else if (c.state === 'learning' || c.state === 'relearning') {
      countLearning++;
    } else if ((c.stability || 0) >= 21) {
      countMature++;
    } else {
      countYoung++;
    }
  });

  const total = vocabularyList.length || 1;
  return {
    new: countNew,
    learning: countLearning,
    young: countYoung,
    mature: countMature,
    percentages: {
      new: Math.round((countNew / total) * 100),
      learning: Math.round((countLearning / total) * 100),
      young: Math.round((countYoung / total) * 100),
      mature: Math.round((countMature / total) * 100),
    },
  };
}

/**
 * Calculates True Retention Rate from review logs (default: last 30 days).
 */
export function calculateRetentionStats(daysWindow = 30) {
  const log = getReviewLog();
  const now = Date.now();
  const windowStart = now - daysWindow * 86400 * 1000;

  const filteredLog = log.filter((entry) => new Date(entry.timestamp).getTime() >= windowStart);
  if (filteredLog.length === 0) {
    return {
      totalReviews: 0,
      retentionRate: 100,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      averageTimeMs: 0,
    };
  }

  let correctCount = 0;
  let againCount = 0;
  let hardCount = 0;
  let goodCount = 0;
  let easyCount = 0;
  let totalTimeMs = 0;

  filteredLog.forEach((entry) => {
    if (entry.rating === 1) againCount++;
    if (entry.rating === 2) { hardCount++; correctCount++; }
    if (entry.rating === 3) { goodCount++; correctCount++; }
    if (entry.rating === 4) { easyCount++; correctCount++; }
    if (entry.timeMs) totalTimeMs += entry.timeMs;
  });

  const retentionRate = Math.round((correctCount / filteredLog.length) * 100);
  const averageTimeMs = Math.round(totalTimeMs / filteredLog.length);

  return {
    totalReviews: filteredLog.length,
    retentionRate,
    againCount,
    hardCount,
    goodCount,
    easyCount,
    averageTimeMs,
  };
}

/**
 * Generates 30-day daily review count histogram data with attached item review logs.
 */
export function getDailyReviewHistory(numDays = 30, vocabularyList = []) {
  const log = getReviewLog();
  const historyMap = {};

  const vocabMap = new Map();
  vocabularyList.forEach((item) => {
    if (item.id) vocabMap.set(item.id, item);
  });

  const today = new Date();
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    historyMap[dateStr] = {
      date: dateStr,
      count: 0,
      correct: 0,
      timeSec: 0,
      items: [],
    };
  }

  log.forEach((entry) => {
    const dateStr = entry.timestamp.split('T')[0];
    if (historyMap[dateStr]) {
      historyMap[dateStr].count += 1;
      if (entry.rating >= 2) historyMap[dateStr].correct += 1;
      if (entry.timeMs) historyMap[dateStr].timeSec += Math.round(entry.timeMs / 1000);

      const vocabItem = vocabMap.get(entry.cardId) || { id: entry.cardId, word: entry.cardId, meaning: '' };

      historyMap[dateStr].items.push({
        ...vocabItem,
        logEntry: entry,
        rating: entry.rating,
        ratingName: entry.ratingName || (entry.rating === 1 ? 'again' : entry.rating === 2 ? 'hard' : entry.rating === 3 ? 'good' : 'easy'),
        timeMs: entry.timeMs || 0,
      });
    }
  });

  return Object.values(historyMap);
}

/**
 * Generates 30-day future workload forecast (cards due per day) with attached card details.
 */
export function getWorkloadForecast(vocabularyList = [], daysAhead = 30) {
  const cards = getSrsCardStates();
  const forecastMap = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    forecastMap[dateStr] = {
      date: dateStr,
      count: 0,
      items: [],
    };
  }

  const todayStr = today.toISOString().split('T')[0];

  vocabularyList.forEach((item) => {
    const c = cards[item.id];
    if (c && c.due && c.state !== 'new') {
      const dueDate = new Date(c.due);
      dueDate.setHours(0, 0, 0, 0);
      const dateStr = dueDate.toISOString().split('T')[0];

      const itemWithSrs = { ...item, srs: c };

      if (dateStr in forecastMap) {
        forecastMap[dateStr].count += 1;
        forecastMap[dateStr].items.push(itemWithSrs);
      } else if (dueDate < today) {
        // Overdue cards count toward today's forecast
        if (forecastMap[todayStr]) {
          forecastMap[todayStr].count += 1;
          forecastMap[todayStr].items.push(itemWithSrs);
        }
      }
    }
  });

  return Object.values(forecastMap);
}

/**
 * Generates difficulty distribution histogram (1 to 10 scale).
 */
export function getDifficultyDistribution(vocabularyList = []) {
  const cards = getSrsCardStates();
  const bins = Array(10).fill(0);

  vocabularyList.forEach((item) => {
    const c = cards[item.id];
    if (c && c.difficulty) {
      const binIdx = Math.min(9, Math.max(0, Math.floor(c.difficulty) - 1));
      bins[binIdx] += 1;
    }
  });

  return bins.map((count, idx) => ({ difficulty: idx + 1, count }));
}
