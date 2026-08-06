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
 * Generates 16-week matrix for GitHub contribution heatmap view.
 * Returns array of week columns: [ { weekStart, days: [ { date, dateStr, isActive, dayOfWeek } ] } ]
 */
export const getContributionMatrix = (numWeeks = 16) => {
  const dates = getStudyDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find Sunday ending current week
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon...
  const distanceToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + distanceToSunday);

  // Calculate start date (numWeeks ago from Monday)
  const totalDays = numWeeks * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);

  const weeks = [];
  let curr = new Date(startDate);

  for (let w = 0; w < numWeeks; w++) {
    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = curr.toISOString().split('T')[0];
      const isActive = dates.includes(dateStr);
      weekDays.push({
        dateStr,
        dateNum: curr.getDate(),
        monthName: curr.toLocaleString('en-US', { month: 'short' }),
        isActive,
        isFuture: curr > today,
      });
      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(weekDays);
  }

  return weeks;
};
