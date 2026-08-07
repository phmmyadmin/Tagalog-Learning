import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

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

    window.dispatchEvent(new Event('tagalog_cloud_sync_completed'));
  } catch (e) {
    console.error('Failed to apply cloud state to localStorage:', e);
  }
};

/**
 * Syncs local progress to Supabase PostgreSQL table.
 */
export const pushProgressToCloud = async (userId) => {
  if (!isSupabaseConfigured() || !supabase || !userId) return null;

  const localState = getLocalProgressState();

  const payload = {
    user_id: userId,
    mastered_items: localState.masteredItems,
    study_dates: localState.studyDates,
    activity_results: localState.activityResults,
    quiz_history: localState.quizHistory,
    mistakes_bank: localState.mistakesBank,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.error('Supabase cloud push error:', error);
    throw error;
  }

  return data;
};

/**
 * Merges and pulls cloud progress from Supabase PostgreSQL table down to localStorage.
 */
export const pullProgressFromCloud = async (userId) => {
  if (!isSupabaseConfigured() || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase cloud pull error:', error);
    throw error;
  }

  if (data) {
    const cloudState = {
      masteredItems: data.mastered_items || [],
      studyDates: data.study_dates || [],
      activityResults: data.activity_results || {},
      quizHistory: data.quiz_history || {},
      mistakesBank: data.mistakes_bank || [],
    };

    applyStateToLocal(cloudState);
    return cloudState;
  } else {
    // First time user on cloud -> push local state
    await pushProgressToCloud(userId);
    return getLocalProgressState();
  }
};
