/**
 * User Lessons Manager
 * Handles local persistence, dynamic schema merging, and event notifications
 * for all Tagalog lessons (both seeded L02-L08 and user-ingested PPTX modules).
 */

import { defaultLessons } from '../data/defaultLessons.js';
import { autoPushIfLoggedIn } from './cloudSyncManager.js';

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
 * Gets all lessons from localStorage, auto-seeding with default lessons (L02-L08) if uninitialized.
 * @returns {Array<Object>}
 */
export function getUserLessons() {
  const saved = safeParseJSON(STORAGE_KEY, null);
  if (saved === null || (Array.isArray(saved) && saved.length === 0)) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLessons));
    } catch (e) {}
    return defaultLessons;
  }

  // Ensure default lessons are present and up to date with enriched vocabulary
  let hasUpdates = false;
  const updatedLessons = saved.map((les) => {
    const defaultMatch = defaultLessons.find((dl) => dl.lessonKey === les.lessonKey || dl.id === les.id);
    if (defaultMatch) {
      if (!les.vocabulary || les.vocabulary.length < defaultMatch.vocabulary.length) {
        hasUpdates = true;
        return {
          ...les,
          vocabulary: defaultMatch.vocabulary,
          theory: defaultMatch.theory,
          activities: defaultMatch.activities,
          quiz: defaultMatch.quiz || les.quiz,
        };
      }
    }
    return les;
  });

  const lessonKeys = new Set(updatedLessons.map((l) => l.lessonKey || l.id));
  const missingDefaults = defaultLessons.filter((dl) => !lessonKeys.has(dl.lessonKey) && !lessonKeys.has(dl.id));
  
  if (missingDefaults.length > 0 || hasUpdates) {
    const unified = [...updatedLessons, ...missingDefaults];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unified));
    } catch (e) {}
    return unified;
  }

  return updatedLessons;
}

/**
 * Saves or updates a lesson.
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
 * Deletes a lesson by its ID or lessonKey.
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
 * Returns merged data directly from the unified lesson collection with deduplication.
 */
export function getMergedLessonData() {
  const lessons = getUserLessons();

  const theoryMap = new Map();
  const vocabMap = new Map();
  const activitiesMap = new Map();
  const lessonKeys = [];

  lessons.forEach((les) => {
    if (les.lessonKey) lessonKeys.push(les.lessonKey);

    if (Array.isArray(les.theory)) {
      les.theory.forEach((t) => {
        const key = t.id || t.topic;
        if (!theoryMap.has(key)) {
          theoryMap.set(key, t);
        }
      });
    }

    if (Array.isArray(les.vocabulary)) {
      les.vocabulary.forEach((v) => {
        const key = v.id || v.word?.trim().toLowerCase();
        if (!vocabMap.has(key)) {
          vocabMap.set(key, { ...v });
        } else {
          // Merge lesson tags if this term spans multiple lessons
          const existing = vocabMap.get(key);
          const existingLessons = String(existing.lesson || '').split(',').map((s) => s.trim());
          const newLessons = String(v.lesson || les.lessonKey || '').split(',').map((s) => s.trim());
          const mergedLessons = Array.from(new Set([...existingLessons, ...newLessons])).filter(Boolean).join(', ');
          existing.lesson = mergedLessons;
        }
      });
    }

    if (Array.isArray(les.activities)) {
      les.activities.forEach((a) => {
        const key = a.id || `${a.sentence}_${a.target}`;
        if (!activitiesMap.has(key)) {
          activitiesMap.set(key, a);
        }
      });
    }
  });

  const theory = Array.from(theoryMap.values());
  const vocabulary = Array.from(vocabMap.values());
  const activities = Array.from(activitiesMap.values());
  const sortedLessons = Array.from(new Set(lessonKeys)).sort();

  return {
    metadata: {
      title: 'Tagalog Master Knowledge Base',
      lessons_covered: sortedLessons,
      total_grammar_topics: theory.length,
      total_vocab_terms: vocabulary.length,
      total_exercises: activities.length,
    },
    theory,
    vocabulary,
    activities,
    lessons: sortedLessons,
    userLessons: lessons,
  };
}

/**
 * Returns all lesson mastery exams directly from the unified lesson collection.
 */
export function getMergedLessonQuizzes() {
  const lessons = getUserLessons();
  const quizzes = lessons
    .map((les) => les.quiz)
    .filter((q) => q && Array.isArray(q.questions) && q.questions.length > 0);

  return quizzes;
}
