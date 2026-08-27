import { describe, it, expect, beforeEach } from 'vitest';
import { getMergedLessonData, getMergedLessonQuizzes, saveUserLesson, deleteUserLesson } from '../utils/userLessonsManager';
import { recordStudyActivity, calculateStreak, getLocalDateString } from '../utils/streakManager';
import { saveMistake, getMistakes, clearAllMistakes } from '../utils/mistakesManager';

describe('Data Layer, Deduplication & Cloud Sync Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('auto-seeds default lessons (L02-L08) and produces exactly 204 unique vocabulary terms', () => {
    const data = getMergedLessonData();

    expect(data.lessons).toHaveLength(7);
    expect(data.lessons).toEqual([
      'Lesson_02',
      'Lesson_03',
      'Lesson_04',
      'Lesson_05',
      'Lesson_06',
      'Lesson_07',
      'Lesson_08'
    ]);

    // Exactly 204 unique deduplicated vocabulary terms
    expect(data.vocabulary).toHaveLength(204);

    // Theory topics and activities are populated
    expect(data.theory.length).toBeGreaterThanOrEqual(16);
    expect(data.activities.length).toBeGreaterThanOrEqual(40);
  });

  it('merges multi-lesson tags when a term appears in multiple modules', () => {
    const data = getMergedLessonData();
    const arawItem = data.vocabulary.find(v => v.word.toLowerCase() === 'araw');

    expect(arawItem).toBeDefined();
    // Araw is in Lesson 2 and Lesson 4
    expect(arawItem.lesson).toContain('Lesson_02');
    expect(arawItem.lesson).toContain('04');
  });

  it('returns all 7 lesson mastery exam quizzes', () => {
    const quizzes = getMergedLessonQuizzes();

    expect(quizzes).toHaveLength(7);
    quizzes.forEach(q => {
      expect(q.questions).toHaveLength(8);
      expect(q.quiz_metadata).toBeDefined();
    });
  });

  it('tracks study streaks correctly across consecutive days', () => {
    // Record today
    recordStudyActivity();
    expect(calculateStreak()).toBe(1);

    // Simulate 3 consecutive days ending today
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    const activeDates = [
      getLocalDateString(dayBefore),
      getLocalDateString(yesterday),
      getLocalDateString(today)
    ];

    localStorage.setItem('tagalog_study_dates_v1', JSON.stringify(activeDates));
    expect(calculateStreak()).toBe(3);
  });

  it('records, queries, and clears mistake remediation items', () => {
    saveMistake({
      question: 'What is the meaning of "Sino"?',
      userAnswer: 'What',
      correctAnswer: 'Who',
      source: 'Lesson 6 Quiz',
      lesson: 'Lesson_06'
    });

    const mistakes = getMistakes();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0].correctAnswer).toBe('Who');

    clearAllMistakes();
    expect(getMistakes()).toHaveLength(0);
  });

  it('deduplicates overlapping vocabulary when saving a new user lesson', () => {
    const initialData = getMergedLessonData();
    const initialCount = initialData.vocabulary.length; // 204

    // Save a custom user lesson containing:
    // - 1 existing word ('Bahay', already in L02) with a new ID
    // - 1 duplicated word within this lesson ('Salamat', 'salamat')
    // - 2 completely new words ('BagongSalitaA', 'BagongSalitaB')
    saveUserLesson({
      id: 'USER_LESSON_09',
      lessonKey: 'Lesson_09',
      title: 'Lesson 9: Advanced Concepts',
      vocabulary: [
        { id: 'VOCAB-L09-01', word: 'Bahay', meaning: 'House / Home', partOfSpeech: 'noun', lesson: 'Lesson_09' },
        { id: 'VOCAB-L09-02', word: 'Salamat', meaning: 'Thank you', partOfSpeech: 'expression', lesson: 'Lesson_09' },
        { id: 'VOCAB-L09-03', word: 'salamat', meaning: 'Thanks (duplicate)', partOfSpeech: 'expression', lesson: 'Lesson_09' },
        { id: 'VOCAB-L09-04', word: 'BagongSalitaA', meaning: 'New Word A', partOfSpeech: 'noun', lesson: 'Lesson_09' },
        { id: 'VOCAB-L09-05', word: 'BagongSalitaB', meaning: 'New Word B', partOfSpeech: 'verb', lesson: 'Lesson_09' }
      ],
      theory: [],
      activities: []
    });

    const updatedData = getMergedLessonData();

    // Verify 'Bahay' has merged lesson tags
    const bahay = updatedData.vocabulary.find(v => v.word.toLowerCase() === 'bahay');
    expect(bahay).toBeDefined();
    expect(bahay.lesson).toContain('Lesson_02');
    expect(bahay.lesson).toContain('Lesson_09');

    // Verify 'Bahay' appears only once in the entire dictionary
    const allBahay = updatedData.vocabulary.filter(v => v.word.toLowerCase() === 'bahay');
    expect(allBahay).toHaveLength(1);

    // Verify 'Salamat' appears only once in the entire dictionary
    const allSalamat = updatedData.vocabulary.filter(v => v.word.toLowerCase() === 'salamat');
    expect(allSalamat).toHaveLength(1);

    // Total count should increase by exactly 3 (Salamat + BagongSalitaA + BagongSalitaB)
    expect(updatedData.vocabulary.length).toBe(initialCount + 3);

    // NOW DELETE THE LESSON AND VERIFY ITS VOCABULARY IS COMPLETELY REMOVED
    deleteUserLesson('Lesson_09');
    const afterDeleteData = getMergedLessonData();

    expect(afterDeleteData.lessons).not.toContain('Lesson_09');
    expect(afterDeleteData.vocabulary.some(v => v.word.toLowerCase() === 'bagongsalitaa')).toBe(false);
    expect(afterDeleteData.vocabulary.some(v => v.word.toLowerCase() === 'bagongsalitab')).toBe(false);
    expect(afterDeleteData.vocabulary.some(v => v.word.toLowerCase() === 'salamat')).toBe(false);

    // Verify 'Bahay' is still present (from Lesson 2), but no longer has 'Lesson_09' tag
    const bahayAfter = afterDeleteData.vocabulary.find(v => v.word.toLowerCase() === 'bahay');
    expect(bahayAfter).toBeDefined();
    expect(bahayAfter.lesson).not.toContain('Lesson_09');

    // Total vocabulary count is exactly restored
    expect(afterDeleteData.vocabulary.length).toBe(initialCount);
  });

  it('permanently deletes a default lesson without auto-resurrecting it', () => {
    const initial = getMergedLessonData();
    expect(initial.lessons).toContain('Lesson_08');

    // Delete Lesson 8
    deleteUserLesson('Lesson_08');

    // Re-query data multiple times to ensure no auto-resurrection
    const afterDelete1 = getMergedLessonData();
    expect(afterDelete1.lessons).not.toContain('Lesson_08');
    expect(afterDelete1.lessons).toHaveLength(6);

    const afterDelete2 = getMergedLessonData();
    expect(afterDelete2.lessons).not.toContain('Lesson_08');
    expect(afterDelete2.lessons).toHaveLength(6);
  });
});
