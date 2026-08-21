/**
 * Storage manager for AI Generated Quizzes.
 * Persists user-generated quizzes in LocalStorage so they can be re-taken anytime.
 */

const STORAGE_KEY = 'tagalog_saved_quizzes_v1';

export function getSavedQuizzes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse saved quizzes:', e);
    return [];
  }
}

export function saveQuizToStorage(quiz) {
  if (!quiz || !quiz.quiz_metadata?.id) return;

  try {
    const existing = getSavedQuizzes();
    // Check if already exists
    const idx = existing.findIndex((q) => (q.quiz_metadata?.id || q.id) === (quiz.quiz_metadata?.id || quiz.id));
    let updated;

    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = quiz;
    } else {
      updated = [quiz, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_saved_quizzes_updated'));
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
    return updated;
  } catch (e) {
    console.error('Failed to delete saved quiz:', e);
    return getSavedQuizzes();
  }
}
