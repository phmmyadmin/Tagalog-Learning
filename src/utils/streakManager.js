/**
 * Utility to manage and persist real daily study activity and streaks in localStorage.
 */

const STORAGE_KEY = 'tagalog_study_dates_v1';

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getStudyDates = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const recordStudyActivity = () => {
  const today = getTodayDateString();
  const dates = getStudyDates();

  if (!dates.includes(today)) {
    const updated = [...dates, today];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('tagalog_streak_updated'));
    } catch (e) {
      console.error('Failed to save study activity:', e);
    }
  }
};

/**
 * Calculates current consecutive day streak.
 */
export const calculateStreak = () => {
  const dates = getStudyDates();
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Check if today was recorded
  const todayStr = checkDate.toISOString().split('T')[0];
  if (!dates.includes(todayStr)) {
    // Check if yesterday was recorded
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!dates.includes(yesterdayStr)) {
      return 0; // Streak broken
    }
  }

  // Count backwards
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Gets active day indices for the current week (0 = Monday, 6 = Sunday).
 */
export const getActiveDaysThisWeek = () => {
  const dates = getStudyDates();
  const today = new Date();
  
  // Calculate Monday of current week
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ...
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const activeIndices = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      activeIndices.push(i);
    }
  }

  return activeIndices;
};
