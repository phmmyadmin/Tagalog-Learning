/**
 * Storage manager for AI Generated & Saved Quizzes.
 * Persists all quizzes in LocalStorage & Supabase Cloud so they can be re-taken anytime across devices.
 */

import defaultQuiz from '../data/quizzes/generated_quiz.json';
import pronounsQuiz from '../data/quizzes/pronouns_quiz.json';
import verbsQuiz from '../data/quizzes/verbs_quiz.json';
import { autoPushIfLoggedIn } from './cloudSyncManager';

const STORAGE_KEY = 'tagalog_saved_quizzes_v1';
const INITIAL_PRESETS = [defaultQuiz, pronounsQuiz, verbsQuiz];

export function getSavedQuizzes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
    // Seed initial presets into storage if no saved quizzes exist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRESETS));
    return INITIAL_PRESETS;
  } catch (e) {
    console.error('Failed to parse saved quizzes:', e);
    return INITIAL_PRESETS;
  }
}

export function saveQuizToStorage(quiz) {
  if (!quiz || !quiz.quiz_metadata?.id) return;

  try {
    const existing = getSavedQuizzes();
    const quizId = quiz.quiz_metadata?.id || quiz.id;
    const idx = existing.findIndex((q) => (q.quiz_metadata?.id || q.id) === quizId);
    let updated;

    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = quiz;
    } else {
      updated = [quiz, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_saved_quizzes_updated'));
    autoPushIfLoggedIn().catch(() => {});
    return updated;
  } catch (e) {
    console.error('Failed to save quiz to storage:', e);
    return getSavedQuizzes();
  }
}

export function deleteSavedQuiz(quizId) {
  try {
    const existing = getSavedQuizzes();
    const updated = existing.filter((q) => (q.quiz_metadata?.id || q.id) !== quizId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_saved_quizzes_updated'));
    autoPushIfLoggedIn().catch(() => {});
    return updated;
  } catch (e) {
    console.error('Failed to delete saved quiz:', e);
    return getSavedQuizzes();
  }
}
