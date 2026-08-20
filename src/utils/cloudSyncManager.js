import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

let isInitialPullComplete = false;

const safeParseJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

/**
 * Reads local progress from localStorage.
 */
export const getLocalProgressState = () => {
  return {
    masteredItems: safeParseJSON('tagalog_mastered_items', []),
    studyDates: safeParseJSON('tagalog_study_dates_v1', []),
    activityResults: safeParseJSON('tagalog_activity_results_v1', {}),
    quizHistory: safeParseJSON('tagalog_quiz_history_v1', {}),
    mistakesBank: safeParseJSON('tagalog_mistakes_bank_v1', []),
    srsCards: safeParseJSON('tagalog_srs_cards_v2', {}),
    srsReviewLog: safeParseJSON('tagalog_srs_review_log_v2', []),
    srsGamification: safeParseJSON('tagalog_srs_gamification_v2', {}),
    srsSettings: safeParseJSON('tagalog_srs_settings_v2', {}),
  };
};

/**
 * Saves state into localStorage and triggers UI refresh event.
 */
export const applyStateToLocal = (state) => {
  if (!state) return;
  try {
    if (state.masteredItems) localStorage.setItem('tagalog_mastered_items', JSON.stringify(state.masteredItems));
    if (state.studyDates) localStorage.setItem('tagalog_study_dates_v1', JSON.stringify(state.studyDates));
    if (state.activityResults) localStorage.setItem('tagalog_activity_results_v1', JSON.stringify(state.activityResults));
    if (state.quizHistory) localStorage.setItem('tagalog_quiz_history_v1', JSON.stringify(state.quizHistory));
    if (state.mistakesBank) localStorage.setItem('tagalog_mistakes_bank_v1', JSON.stringify(state.mistakesBank));
    if (state.srsCards) localStorage.setItem('tagalog_srs_cards_v2', JSON.stringify(state.srsCards));
    if (state.srsReviewLog) localStorage.setItem('tagalog_srs_review_log_v2', JSON.stringify(state.srsReviewLog));
    if (state.srsGamification) localStorage.setItem('tagalog_srs_gamification_v2', JSON.stringify(state.srsGamification));
    if (state.srsSettings) localStorage.setItem('tagalog_srs_settings_v2', JSON.stringify(state.srsSettings));

    window.dispatchEvent(new Event('tagalog_cloud_sync_completed'));
    window.dispatchEvent(new Event('tagalog_srs_updated'));
    window.dispatchEvent(new Event('tagalog_gamification_updated'));
  } catch (e) {
    console.error('Failed to apply cloud state to localStorage:', e);
  }
};

/**
 * Syncs local progress to Supabase PostgreSQL table.
 */
export const pushProgressToCloud = async (userId) => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  let targetUserId = userId;
  if (!targetUserId) {
    const { data: authData } = await supabase.auth.getUser();
    targetUserId = authData?.user?.id;
  }

  if (!targetUserId) {
    throw new Error('No active user logged in.');
  }

  const localState = getLocalProgressState();

  const payload = {
    user_id: targetUserId,
    mastered_items: localState.masteredItems,
    study_dates: localState.studyDates,
    activity_results: localState.activityResults,
    quiz_history: localState.quizHistory,
    mistakes_bank: localState.mistakesBank,
    srs_cards_v2: localState.srsCards,
    srs_review_log_v2: localState.srsReviewLog,
    srs_gamification_v2: localState.srsGamification,
    srs_settings_v2: localState.srsSettings,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.error('Supabase cloud push error:', error);
    if (error.code === '42501') {
      throw new Error('RLS Permission denied. Ensure you ran supabase_schema.sql script in Supabase SQL Editor.');
    }
    throw error;
  }

  return data;
};

/**
 * Auto-push helper triggered whenever progress changes, ONLY AFTER initial pull completes.
 */
export const autoPushIfLoggedIn = async () => {
  if (!isInitialPullComplete) return; // Prevent overwriting cloud with empty mount state
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.id) {
      await pushProgressToCloud(authData.user.id);
    }
  } catch (e) {
    console.warn('Auto cloud push skipped:', e.message);
  }
};

/**
 * Performs a Smart Union Merge between Cloud data and Local device data.
 */
export const pullProgressFromCloud = async (userId) => {
  if (!isSupabaseConfigured() || !supabase) {
    isInitialPullComplete = true;
    return null;
  }

  let targetUserId = userId;
  if (!targetUserId) {
    const { data: authData } = await supabase.auth.getUser();
    targetUserId = authData?.user?.id;
  }

  if (!targetUserId) {
    isInitialPullComplete = true;
    return null;
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase cloud pull error:', error);
    isInitialPullComplete = true;
    throw error;
  }

  const localState = getLocalProgressState();

  if (data) {
    const cloudMastered = data.mastered_items || [];
    const cloudDates = data.study_dates || [];
    const cloudActivities = data.activity_results || {};
    const cloudQuizzes = data.quiz_history || {};
    const cloudMistakes = data.mistakes_bank || [];
    const cloudSrsCards = data.srs_cards_v2 || {};
    const cloudSrsLog = data.srs_review_log_v2 || [];
    const cloudSrsGamification = data.srs_gamification_v2 || {};
    const cloudSrsSettings = data.srs_settings_v2 || {};

    const mergedMastered = Array.from(new Set([...cloudMastered, ...localState.masteredItems]));
    const mergedDates = Array.from(new Set([...cloudDates, ...localState.studyDates]));
    const mergedActivities = { ...cloudActivities, ...localState.activityResults };
    const mergedQuizzes = { ...cloudQuizzes, ...localState.quizHistory };
    
    const mistakeMap = new Map();
    [...cloudMistakes, ...localState.mistakesBank].forEach((item) => {
      const key = item.id || item.question || JSON.stringify(item);
      mistakeMap.set(key, item);
    });
    const mergedMistakes = Array.from(mistakeMap.values());

    // Merge SRS Cards (newer lastReview wins)
    const mergedSrsCards = { ...cloudSrsCards, ...localState.srsCards };
    Object.keys(cloudSrsCards).forEach((cardId) => {
      const c1 = cloudSrsCards[cardId];
      const c2 = localState.srsCards[cardId];
      if (c1 && c2 && c1.lastReview && c2.lastReview) {
        if (new Date(c1.lastReview) > new Date(c2.lastReview)) {
          mergedSrsCards[cardId] = c1;
        }
      }
    });

    // Merge Review Logs (deduplicate by id/timestamp)
    const logMap = new Map();
    [...cloudSrsLog, ...localState.srsReviewLog].forEach((entry) => {
      const key = entry.id || `${entry.timestamp}_${entry.cardId}`;
      logMap.set(key, entry);
    });
    const mergedSrsLog = Array.from(logMap.values());

    // Merge Gamification (max XP)
    const maxXp = Math.max(cloudSrsGamification.xp || 0, localState.srsGamification.xp || 0);
    const unlockedSet = new Set([
      ...(cloudSrsGamification.unlockedAchievements || []),
      ...(localState.srsGamification.unlockedAchievements || []),
    ]);
    const mergedGamification = {
      ...localState.srsGamification,
      ...cloudSrsGamification,
      xp: maxXp,
      unlockedAchievements: Array.from(unlockedSet),
    };

    const mergedSrsSettings = { ...cloudSrsSettings, ...localState.srsSettings };

    const mergedState = {
      masteredItems: mergedMastered,
      studyDates: mergedDates,
      activityResults: mergedActivities,
      quizHistory: mergedQuizzes,
      mistakesBank: mergedMistakes,
      srsCards: mergedSrsCards,
      srsReviewLog: mergedSrsLog,
      srsGamification: mergedGamification,
      srsSettings: mergedSrsSettings,
    };

    applyStateToLocal(mergedState);
    isInitialPullComplete = true;
    await pushProgressToCloud(targetUserId);

    return mergedState;
  } else {
    isInitialPullComplete = true;
    await pushProgressToCloud(targetUserId);
    return localState;
  }
};
