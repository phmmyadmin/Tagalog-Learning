/**
 * User Lessons Manager
 * Handles local persistence, dynamic schema merging, and event notifications
 * for all Tagalog lessons (both seeded L02-L08 and user-ingested PPTX modules).
 */

import { defaultLessons } from '../data/defaultLessons.js';
import { autoPushIfLoggedIn } from './cloudSyncManager.js';
import { removeCardStatesByIds } from './srsStore.js';

const STORAGE_KEY = 'tagalog_user_lessons_v1';
const DELETED_LESSONS_KEY = 'tagalog_deleted_lessons_v1';

const safeParseJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export function getDeletedLessonKeys() {
  return safeParseJSON(DELETED_LESSONS_KEY, []);
}

function saveDeletedLessonKeys(list) {
  try {
    localStorage.setItem(DELETED_LESSONS_KEY, JSON.stringify(list));
  } catch (e) {}
}

/**
 * Gets all lessons from localStorage, auto-seeding with default lessons (L02-L08) if uninitialized.
 * @returns {Array<Object>}
 */
export function getUserLessons() {
  const deletedKeysList = getDeletedLessonKeys();
  const deletedKeys = new Set(deletedKeysList.map((k) => String(k).trim().toLowerCase().replace(/\s+/g, '_')));

  const saved = safeParseJSON(STORAGE_KEY, null);
  if (saved === null || (Array.isArray(saved) && saved.length === 0)) {
    const initial = defaultLessons.filter(
      (dl) =>
        !deletedKeys.has(String(dl.lessonKey).toLowerCase().replace(/\s+/g, '_')) &&
        !deletedKeys.has(String(dl.id).toLowerCase().replace(/\s+/g, '_'))
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {}
    return initial;
  }

  // Filter out any lessons that were explicitly deleted
  const filteredSaved = saved.filter(
    (les) =>
      !deletedKeys.has(String(les.lessonKey).toLowerCase().replace(/\s+/g, '_')) &&
      !deletedKeys.has(String(les.id).toLowerCase().replace(/\s+/g, '_'))
  );

  // Ensure default lessons are present and up to date with enriched vocabulary (unless deleted)
  let hasUpdates = false;
  const updatedLessons = filteredSaved.map((les) => {
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
  const missingDefaults = defaultLessons.filter(
    (dl) =>
      !lessonKeys.has(dl.lessonKey) &&
      !lessonKeys.has(dl.id) &&
      !deletedKeys.has(String(dl.lessonKey).toLowerCase().replace(/\s+/g, '_')) &&
      !deletedKeys.has(String(dl.id).toLowerCase().replace(/\s+/g, '_'))
  );

  if (missingDefaults.length > 0 || hasUpdates || filteredSaved.length !== saved.length) {
    const unified = [...updatedLessons, ...missingDefaults];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unified));
    } catch (e) {}
    return unified;
  }

  return updatedLessons;
}

/**
 * Saves or updates a lesson with internal vocabulary deduplication.
 * @param {Object} lesson
 */
export function saveUserLesson(lesson) {
  if (!lesson || !lesson.lessonKey) return;

  // Unmark from deleted list if saving anew
  const deleted = getDeletedLessonKeys().filter((k) => {
    const kNorm = String(k).trim().toLowerCase().replace(/\s+/g, '_');
    return (
      kNorm !== String(lesson.lessonKey).toLowerCase().replace(/\s+/g, '_') &&
      kNorm !== String(lesson.id || '').toLowerCase().replace(/\s+/g, '_')
    );
  });
  saveDeletedLessonKeys(deleted);

  const current = getUserLessons();
  const index = current.findIndex(
    (l) => l.id === lesson.id || l.lessonKey === lesson.lessonKey
  );

  // Deduplicate vocabulary within this lesson
  let cleanedVocab = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
  const uniqueVocabMap = new Map();
  cleanedVocab.forEach((v) => {
    const w = (v.word || '').trim();
    if (w) {
      const k = w.toLowerCase();
      if (!uniqueVocabMap.has(k)) {
        uniqueVocabMap.set(k, { ...v, word: w });
      } else {
        const existing = uniqueVocabMap.get(k);
        if (!existing.example && v.example) existing.example = v.example;
        if ((!existing.meaning || existing.meaning.length < 5) && v.meaning) existing.meaning = v.meaning;
      }
    }
  });

  const processedLesson = {
    ...lesson,
    vocabulary: Array.from(uniqueVocabMap.values()).map((v, idx) => ({
      ...v,
      id: v.id || `VOCAB-${lesson.lessonKey}-${String(idx + 1).padStart(3, '0')}`,
      lesson: lesson.lessonKey
    }))
  };

  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...processedLesson, updatedAt: new Date().toISOString() };
  } else {
    updated = [processedLesson, ...current];
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
 * Deletes a lesson by its ID or lessonKey, removing associated cards and tracking deletion.
 * @param {string} idOrKey
 */
export function deleteUserLesson(idOrKey) {
  if (!idOrKey) return;
  const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '_');
  const targetNorm = norm(idOrKey);
  const current = getUserLessons();

  const targetLessons = current.filter(
    (l) =>
      l.id === idOrKey ||
      l.lessonKey === idOrKey ||
      norm(l.id) === targetNorm ||
      norm(l.lessonKey) === targetNorm
  );

  // Collect vocabulary IDs from target lessons for SRS cleanup
  const cardIdsToRemove = [];
  targetLessons.forEach((l) => {
    if (Array.isArray(l.vocabulary)) {
      l.vocabulary.forEach((v) => {
        if (v.id) cardIdsToRemove.push(v.id);
      });
    }
  });

  const filtered = current.filter(
    (l) =>
      l.id !== idOrKey &&
      l.lessonKey !== idOrKey &&
      norm(l.id) !== targetNorm &&
      norm(l.lessonKey) !== targetNorm
  );

  // Save to deleted lessons registry
  const deleted = Array.from(new Set([...getDeletedLessonKeys(), idOrKey, targetNorm]));
  saveDeletedLessonKeys(deleted);

  // Clean up SRS card states
  if (cardIdsToRemove.length > 0) {
    removeCardStatesByIds(cardIdsToRemove);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('tagalog_user_lessons_updated'));
    window.dispatchEvent(new Event('tagalog_srs_updated'));
    autoPushIfLoggedIn();
  } catch (e) {
    console.error('Failed to delete user lesson:', e);
  }
}

/**
 * Returns merged data directly from the unified lesson collection with strict word-level deduplication.
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
        const wordStr = (v.word || '').trim();
        if (!wordStr) return;
        const key = wordStr.toLowerCase();
        if (!vocabMap.has(key)) {
          vocabMap.set(key, { ...v, word: wordStr });
        } else {
          // Merge lesson tags without duplicates (e.g. "Lesson_02, Lesson_09")
          const existing = vocabMap.get(key);
          const existingLessons = String(existing.lesson || '').split(',').map((s) => s.trim()).filter(Boolean);
          const newLessons = String(v.lesson || les.lessonKey || '').split(',').map((s) => s.trim()).filter(Boolean);
          const mergedLessons = Array.from(new Set([...existingLessons, ...newLessons])).join(', ');
          existing.lesson = mergedLessons;

          if (!existing.example && v.example) {
            existing.example = v.example;
          }
          if ((!existing.meaning || existing.meaning.length < 5) && v.meaning) {
            existing.meaning = v.meaning;
          }
        }
      });
    }

    if (Array.isArray(les.activities)) {
      les.activities.forEach((a) => {
        const key = a.id || `${a.sentence || a.prompt}_${a.target || a.correctAnswer}`;
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
