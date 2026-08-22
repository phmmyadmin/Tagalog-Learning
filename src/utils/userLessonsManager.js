/**
 * User Lessons Manager
 * Handles local persistence, dynamic schema merging, and event notifications
 * for user-ingested PowerPoint/custom lessons.
 */

import staticData from '../data/tagalogData.json';
import { lessonQuizzes as staticLessonQuizzes } from '../data/quizzes';
import { autoPushIfLoggedIn } from './cloudSyncManager';

const STORAGE_KEY = 'tagalog_user_lessons_v1';

const safeParseJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

/**
 * Gets all user-uploaded lessons from localStorage.
 * @returns {Array<Object>}
 */
export function getUserLessons() {
  return safeParseJSON(STORAGE_KEY, []);
}

/**
 * Saves or updates a user lesson.
 * @param {Object} lesson
 */
export function saveUserLesson(lesson) {
  if (!lesson || !lesson.lessonKey) return;
  const current = getUserLessons();
  const index = current.findIndex(
    (l) => l.id === lesson.id || l.lessonKey === lesson.lessonKey
  );

  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...lesson, updatedAt: new Date().toISOString() };
  } else {
    updated = [lesson, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_user_lessons_updated'));
    autoPushIfLoggedIn();
  } catch (e) {
    console.error('Failed to save user lesson to localStorage:', e);
  }
}

/**
 * Deletes a user lesson by its ID or lessonKey.
 * @param {string} idOrKey
 */
export function deleteUserLesson(idOrKey) {
  if (!idOrKey) return;
  const current = getUserLessons();
  const filtered = current.filter(
    (l) => l.id !== idOrKey && l.lessonKey !== idOrKey
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('tagalog_user_lessons_updated'));
    autoPushIfLoggedIn();
  } catch (e) {
    console.error('Failed to delete user lesson:', e);
  }
}

/**
 * Returns merged data combining built-in static data with all user-uploaded lessons.
 * Deduplicates by unique IDs.
 */
export function getMergedLessonData() {
  const userLessons = getUserLessons();

  const extraTheory = [];
  const extraVocab = [];
  const extraActivities = [];
  const extraLessons = [];

  userLessons.forEach((ul) => {
    if (ul.lessonKey) extraLessons.push(ul.lessonKey);
    if (Array.isArray(ul.theory)) extraTheory.push(...ul.theory);
    if (Array.isArray(ul.vocabulary)) extraVocab.push(...ul.vocabulary);
    if (Array.isArray(ul.activities)) extraActivities.push(...ul.activities);
  });

  // Merge Theory
  const theoryMap = new Map();
  (staticData.theory || []).forEach((t) => theoryMap.set(t.id, t));
  extraTheory.forEach((t) => theoryMap.set(t.id, t));
  const mergedTheory = Array.from(theoryMap.values());

  // Merge Vocabulary
  const vocabMap = new Map();
  (staticData.vocabulary || []).forEach((v) => vocabMap.set(v.id, v));
  extraVocab.forEach((v) => vocabMap.set(v.id, v));
  const mergedVocab = Array.from(vocabMap.values());

  // Merge Activities
  const actMap = new Map();
  (staticData.activities || []).forEach((a) => actMap.set(a.id, a));
  extraActivities.forEach((a) => actMap.set(a.id, a));
  const mergedActivities = Array.from(actMap.values());

  // Merge Lessons list
  const builtInLessons = staticData.metadata?.lessons_covered || [
    ...new Set(staticData.theory.map((t) => t.lesson).filter(Boolean)),
  ];
  const allLessons = Array.from(new Set([...builtInLessons, ...extraLessons])).sort();

  return {
    metadata: {
      ...staticData.metadata,
      lessons_covered: allLessons,
      total_grammar_topics: mergedTheory.length,
      total_vocab_terms: mergedVocab.length,
      total_exercises: mergedActivities.length,
    },
    theory: mergedTheory,
    vocabulary: mergedVocab,
    activities: mergedActivities,
    lessons: allLessons,
    userLessons,
  };
}

/**
 * Returns merged lesson mastery exams combining static built-in quizzes and user-uploaded quizzes.
 */
export function getMergedLessonQuizzes() {
  const userLessons = getUserLessons();
  const userQuizzes = userLessons
    .map((ul) => ul.quiz)
    .filter((q) => q && q.questions && q.questions.length > 0);

  const quizMap = new Map();
  staticLessonQuizzes.forEach((q) => {
    const qId = q.quiz_metadata?.id || q.id;
    if (qId) quizMap.set(qId, q);
  });
  userQuizzes.forEach((q) => {
    const qId = q.quiz_metadata?.id || q.id;
    if (qId) quizMap.set(qId, q);
  });

  return Array.from(quizMap.values());
}
