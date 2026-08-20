/**
 * Gamification & Motivation Engine
 * Handles XP calculation, Tagalog level titles, achievements, and daily study goals.
 */

const STORAGE_KEY = 'tagalog_srs_gamification_v2';

export const LEVELS = [
  { level: 1,  name: 'Baguhan',       title: 'Beginner',       xpRequired: 0,     icon: '🌱' },
  { level: 2,  name: 'Nag-aaral',      title: 'Learner',        xpRequired: 200,   icon: '🌿' },
  { level: 3,  name: 'Estudyante',     title: 'Student',        xpRequired: 500,   icon: '📖' },
  { level: 4,  name: 'Masipag',        title: 'Diligent',       xpRequired: 1000,  icon: '⚡' },
  { level: 5,  name: 'Magaling',       title: 'Skilled',        xpRequired: 2000,  icon: '🔥' },
  { level: 6,  name: 'Dalubhasa',      title: 'Expert',         xpRequired: 4000,  icon: '🎯' },
  { level: 7,  name: 'Guro',           title: 'Master',         xpRequired: 7000,  icon: '🎓' },
  { level: 8,  name: 'Pantas',         title: 'Sage',           xpRequired: 12000, icon: '👑' },
  { level: 9,  name: 'Bathala',        title: 'Legend',         xpRequired: 20000, icon: '🌟' },
];

export const ACHIEVEMENTS = [
  { id: 'first_step',       title: 'Unang Hakbang (First Steps)',  desc: 'Complete your first SRS review session',   icon: '👣', xp: 50 },
  { id: 'word_collector_1', title: 'Palatandaan (Word Collector)', desc: 'Learn 25 new Tagalog vocabulary words',  icon: '📚', xp: 100 },
  { id: 'word_collector_2', title: 'Bokabularyo (Vocab Master)', desc: 'Learn 75 new Tagalog vocabulary words',  icon: '🎴', xp: 250 },
  { id: 'century',          title: 'Daan-daan (Century)',         desc: 'Complete 100 total card reviews',        icon: '💯', xp: 150 },
  { id: 'streak_7',         title: 'Masigasig (Week Warrior)',    desc: 'Maintain a 7-day study streak',          icon: '🔥', xp: 200 },
  { id: 'streak_30',        title: 'Matatag (Iron Will)',         desc: 'Maintain a 30-day study streak',         icon: '💎', xp: 500 },
  { id: 'perfect_session',  title: 'Perpekto (Perfect Session)',  desc: 'Complete a session without a single Again', icon: '⭐', xp: 150 },
  { id: 'speed_demon',      title: 'Mabilis (Speed Demon)',        desc: 'Average response time under 5 seconds',   icon: '⚡', xp: 150 },
  { id: 'memory_palace',    title: 'Istruktura (Memory Palace)',  desc: 'Reach 30 Mature (high-stability) cards',  icon: '🏰', xp: 300 },
];

export function getGamificationState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
      xp: 0,
      unlockedAchievements: [],
      dailyGoalTarget: 20, // 20 reviews daily
      dailyGoalProgress: 0,
      lastGoalDate: new Date().toISOString().split('T')[0],
    };
  } catch (e) {
    return {
      xp: 0,
      unlockedAchievements: [],
      dailyGoalTarget: 20,
      dailyGoalProgress: 0,
      lastGoalDate: new Date().toISOString().split('T')[0],
    };
  }
}

export function saveGamificationState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('tagalog_gamification_updated'));
  } catch (e) {
    console.error('Failed to save gamification state:', e);
  }
}

/**
 * Calculates Level & progress info from XP.
 */
export function getLevelInfo(xp) {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
    } else {
      break;
    }
  }

  const currentLevelBase = currentLevel.xpRequired;
  const nextLevelBase = nextLevel.xpRequired;
  const range = Math.max(1, nextLevelBase - currentLevelBase);
  const progressInLevel = Math.max(0, xp - currentLevelBase);
  const percent = nextLevel === currentLevel ? 100 : Math.min(100, Math.round((progressInLevel / range) * 100));

  return {
    currentLevel,
    nextLevel,
    percent,
    xpToNext: nextLevel === currentLevel ? 0 : nextLevelBase - xp,
  };
}

/**
 * Adds XP for a review action and checks for daily goal + achievements.
 */
export function addXpForReview(rating, isNewCard = false, timeMs = 0) {
  const state = getGamificationState();
  const today = new Date().toISOString().split('T')[0];

  // Reset daily goal progress if new day
  if (state.lastGoalDate !== today) {
    state.dailyGoalProgress = 0;
    state.lastGoalDate = today;
  }

  let xpEarned = 0;
  if (rating === 1) xpEarned = 2;       // Again
  else if (rating === 2) xpEarned = 5;  // Hard
  else if (rating === 3) xpEarned = 10; // Good
  else if (rating === 4) xpEarned = 15; // Easy

  if (isNewCard) xpEarned += 10; // Bonus for new cards

  state.xp += xpEarned;
  state.dailyGoalProgress += 1;

  saveGamificationState(state);

  return {
    xpEarned,
    newState: state,
    levelInfo: getLevelInfo(state.xp),
  };
}

/**
 * Evaluates unlockable achievements.
 */
export function checkAchievements(stats = {}) {
  const state = getGamificationState();
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach((ach) => {
    if (!state.unlockedAchievements.includes(ach.id)) {
      let isUnlocked = false;

      if (ach.id === 'first_step' && (stats.totalReviews || 0) >= 1) isUnlocked = true;
      if (ach.id === 'word_collector_1' && (stats.totalLearned || 0) >= 25) isUnlocked = true;
      if (ach.id === 'word_collector_2' && (stats.totalLearned || 0) >= 75) isUnlocked = true;
      if (ach.id === 'century' && (stats.totalReviews || 0) >= 100) isUnlocked = true;
      if (ach.id === 'streak_7' && (stats.streak || 0) >= 7) isUnlocked = true;
      if (ach.id === 'streak_30' && (stats.streak || 0) >= 30) isUnlocked = true;
      if (ach.id === 'perfect_session' && stats.isPerfectSession) isUnlocked = true;
      if (ach.id === 'speed_demon' && stats.avgTimeMs && stats.avgTimeMs < 5000 && (stats.sessionReviews || 0) >= 5) isUnlocked = true;
      if (ach.id === 'memory_palace' && (stats.matureCards || 0) >= 30) isUnlocked = true;

      if (isUnlocked) {
        state.unlockedAchievements.push(ach.id);
        state.xp += ach.xp;
        newlyUnlocked.push(ach);
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    saveGamificationState(state);
  }

  return newlyUnlocked;
}
