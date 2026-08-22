/**
 * Default Tagalog Master Lessons (Lessons 02 to 08)
 * Structured in the unified UserLesson format.
 */

import tagalogData from './tagalogData.json';
import { lessonQuizzes } from './quizzes';

const LESSON_TITLES = {
  Lesson_02: 'Lesson 2 — Articles, Word Order, Pluralization & Basic Tenses',
  Lesson_03: 'Lesson 3 — Nominative Personal Pronouns',
  Lesson_04: 'Lesson 4 — Demonstrative Pronouns & Ligatures',
  Lesson_05: 'Lesson 5 — Possessive Markers & Pronouns',
  Lesson_06: 'Lesson 6 — Question Words & Interrogatives',
  Lesson_07: 'Lesson 7 — Question Marker BA & Enclitic Particles',
  Lesson_08: 'Lesson 8 — Comparisons, Intensives & Superlatives',
};

const LESSON_SUMMARIES = {
  Lesson_02: 'Proper and common noun articles (si/sina, ang/ang mga), direct vs inverted word order, pluralization, and basic verb tenses introduction.',
  Lesson_03: 'Nominative personal pronouns (ako, ikaw/ka, siya, kami, tayo, kayo, sila), inclusivity/exclusivity, and politeness rules.',
  Lesson_04: 'Demonstrative pronouns (ito, iyan, iyon) across 3 distance perspectives and ligature connectors (-ng, -g, na).',
  Lesson_05: 'Possessive markers (ni, nina, ng, ng mga) and possessive pronouns in pre-noun (akin, iyo, kaniya) and post-noun (ko, mo, niya) forms.',
  Lesson_06: 'Core interrogative question words (Sino, Ano, Saan/Nasaan, Kailan, Bakit, Paano, Ilan/Magkano), pluralization, and contractions.',
  Lesson_07: 'Yes/No question marker BA positioning, second-position enclitic particle hierarchy (na, pa, man, din/rin, daw/raw, nga, naman, lamang/lang).',
  Lesson_08: 'Adjective degrees: equality comparisons (kasing-), inequality (mas... kaysa), intensives (napaka-), and superlatives (pinaka-).',
};

export const defaultLessons = [
  'Lesson_02',
  'Lesson_03',
  'Lesson_04',
  'Lesson_05',
  'Lesson_06',
  'Lesson_07',
  'Lesson_08',
].map((lessonKey) => {
  const normKey = lessonKey.includes('Lesson_') ? lessonKey : lessonKey.replace('Lesson ', 'Lesson_');
  const theory = (tagalogData.theory || []).filter((t) => {
    if (!t.lesson) return false;
    const cleanLessons = String(t.lesson)
      .split(',')
      .map((s) => s.trim().replace('Lesson ', 'Lesson_'));
    return cleanLessons.some((l) => l === normKey || l === normKey.replace('Lesson_', ''));
  });

  const vocabulary = (tagalogData.vocabulary || []).filter((v) => {
    if (!v.lesson) return false;
    const cleanLessons = String(v.lesson)
      .split(',')
      .map((s) => s.trim().replace('Lesson ', 'Lesson_'));
    return cleanLessons.some((l) => l === normKey || l === normKey.replace('Lesson_', ''));
  });

  const activities = (tagalogData.activities || []).filter((a) => {
    if (!a.lesson) return false;
    const cleanLessons = String(a.lesson)
      .split(',')
      .map((s) => s.trim().replace('Lesson ', 'Lesson_'));
    return cleanLessons.some((l) => l === normKey || l === normKey.replace('Lesson_', ''));
  });
  const quiz =
    lessonQuizzes.find(
      (q) =>
        q.quiz_metadata?.lesson === normKey ||
        (q.quiz_metadata?.id || '').includes(normKey.toUpperCase())
    ) || null;

  return {
    id: `LESSON_${normKey}`,
    lessonKey: normKey,
    title: LESSON_TITLES[normKey] || normKey.replace('_', ' '),
    summary:
      LESSON_SUMMARIES[normKey] ||
      `Grammar rules, vocabulary, exercises, and mastery exam for ${normKey.replace('_', ' ')}.`,
    createdAt: '2026-08-21T00:00:00.000Z',
    isDefault: true,
    theory,
    vocabulary,
    activities,
    quiz,
  };
});
