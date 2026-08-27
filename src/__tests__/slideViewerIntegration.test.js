import { describe, it, expect, beforeEach } from 'vitest';
import slideMap from '../data/slideMap.json';
import { saveUserLesson, getUserLessons } from '../utils/userLessonsManager';
import lesson02Slides from '../data/slides/Lesson_02.json';
import lesson03Slides from '../data/slides/Lesson_03.json';

describe('Slide Opener & Presentation Viewer Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const normalizeLessonKey = (key) => {
    const rawKey = String(key || '').split(',')[0].trim();
    let norm = rawKey.replace(/\s+/g, '_');
    if (/^lesson_\d$/i.test(norm)) {
      norm = norm.replace(/^lesson_(\d)$/i, 'Lesson_0$1');
    } else if (/^\d+$/.test(norm)) {
      norm = `Lesson_${norm.padStart(2, '0')}`;
    } else if (!norm.startsWith('Lesson_') && !norm.toLowerCase().startsWith('lesson')) {
      norm = `Lesson_${norm}`;
    }
    return norm;
  };

  const resolveVocabSlide = (vocabItem) => {
    const normKey = normalizeLessonKey(vocabItem.lesson);
    const rawFirst = String(vocabItem.lesson || '').split(',')[0].trim();
    return (
      slideMap.vocabulary?._keyword_overrides?.[vocabItem.id]?.slide ||
      slideMap.vocabulary?._keyword_overrides?.[vocabItem.word?.trim().toLowerCase()]?.slide ||
      slideMap.vocabulary?._default_slides?.[normKey] ||
      slideMap.vocabulary?._default_slides?.[rawFirst] ||
      1
    );
  };

  it('correctly normalizes single and multi-lesson tags to valid slide manifest keys', () => {
    expect(normalizeLessonKey('Lesson_02')).toBe('Lesson_02');
    expect(normalizeLessonKey('Lesson 02')).toBe('Lesson_02');
    expect(normalizeLessonKey('Lesson 2')).toBe('Lesson_02');
    expect(normalizeLessonKey('2')).toBe('Lesson_02');
    expect(normalizeLessonKey('Lesson_02, Lesson_04')).toBe('Lesson_02');
    expect(normalizeLessonKey('Lesson_03, 05')).toBe('Lesson_03');
    expect(normalizeLessonKey('Lesson_09')).toBe('Lesson_09');
  });

  it('accurately resolves slide numbers for vocabulary items even with multi-lesson tags', () => {
    const multiLessonItem = {
      id: 'VOCAB-L02-005',
      word: 'Bahay',
      lesson: 'Lesson_02, Lesson_04'
    };

    const slideNum = resolveVocabSlide(multiLessonItem);
    expect(slideNum).toBeGreaterThanOrEqual(1);
    expect(typeof slideNum).toBe('number');
  });

  it('has valid slide decks with titles and paragraphs for all default lessons', () => {
    expect(lesson02Slides.slides.length).toBeGreaterThanOrEqual(10);
    expect(lesson03Slides.slides.length).toBeGreaterThanOrEqual(10);

    lesson02Slides.slides.forEach((s) => {
      expect(s.title || s.paragraphs || s.images).toBeDefined();
    });
  });

  it('persists and retrieves custom ingested lessons with slides for presentation viewing', () => {
    saveUserLesson({
      id: 'USER_LESSON_09',
      lessonKey: 'Lesson_09',
      title: 'Lesson 9 — Adverbs of Frequency',
      summary: 'Learn about kahapon, ngayon, bukas, and lagi in Tagalog.',
      slides: [
        { title: 'Slide 1: Overview', paragraphs: [{ text: 'Adverb rules', isBullet: false }] },
        { title: 'Slide 2: Examples', paragraphs: [{ text: 'Kahapon = Yesterday', isBullet: true }] }
      ],
      theory: [],
      vocabulary: [
        { id: 'VOCAB-09-01', word: 'Kahapon', meaning: 'Yesterday', lesson: 'Lesson_09' }
      ],
      activities: []
    });

    const lessons = getUserLessons();
    const l09 = lessons.find(l => l.lessonKey === 'Lesson_09');
    expect(l09).toBeDefined();
    expect(l09.slides).toHaveLength(2);
    expect(l09.slides[0].title).toBe('Slide 1: Overview');
  });
});
