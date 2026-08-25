import { describe, it, expect, vi, beforeEach } from 'vitest';
import { structureLessonWithAi } from '../utils/aiLessonStructurer';
import { generateAiQuiz } from '../utils/aiQuizGenerator';
import { saveAiConfig } from '../utils/aiConfigStore';

describe('AI Gemini API Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    saveAiConfig({ apiKey: 'fake-api-key-12345' });
  });

  it('successfully structures a lesson from Gemini API response with markdown fences', async () => {
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: '```json\n' + JSON.stringify({
                  title: 'Lesson 9 — Adverbs of Time & Frequency',
                  summary: 'Learn how to express when and how often actions occur in Tagalog.',
                  theory: [
                    {
                      id: 'THEORY-09-01',
                      topic: 'Adverbs of Time (Pang-abay na Pamanahon)',
                      summary: 'Adverbs like kahapon, ngayon, bukas placed at the beginning or end of sentences.',
                      rules: [
                        { pattern: 'Kahapon (Yesterday)', description: 'Used with past tense / perpektibo verbs.' },
                        { pattern: 'Bukas (Tomorrow)', description: 'Used with future tense / kontemplatibo verbs.' }
                      ],
                      table: [
                        { tagalog: 'Kahapon', english: 'Yesterday', notes: 'Past tense marker' },
                        { tagalog: 'Ngayon', english: 'Today / Now', notes: 'Present tense marker' },
                        { tagalog: 'Bukas', english: 'Tomorrow', notes: 'Future tense marker' }
                      ]
                    }
                  ],
                  vocabulary: [
                    { id: 'VOCAB-901', word: 'Kahapon', meaning: 'Yesterday', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Umalis siya kahapon.' },
                    { id: 'VOCAB-902', word: 'Ngayon', meaning: 'Today / Now', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Nagluluto ako ngayon.' },
                    { id: 'VOCAB-903', word: 'Bukas', meaning: 'Tomorrow', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Darating sila bukas.' },
                    { id: 'VOCAB-904', word: 'Araw-araw', meaning: 'Every day', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Nag-aaral ako araw-araw.' },
                    { id: 'VOCAB-905', word: 'Minsan', meaning: 'Sometimes', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Minsan ay umiinom siya ng kape.' },
                    { id: 'VOCAB-906', word: 'Lagi', meaning: 'Always', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Lagi siyang masaya.' },
                    { id: 'VOCAB-907', word: 'Kanina', meaning: 'Earlier today', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Kumain ako kanina.' },
                    { id: 'VOCAB-908', word: 'Mamaya', meaning: 'Later today', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Aalis kami mamaya.' },
                    { id: 'VOCAB-909', word: 'Noon', meaning: 'Back then / In the past', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Noon ay mahirap sila.' },
                    { id: 'VOCAB-910', word: 'Bihira', meaning: 'Rarely / Seldom', partOfSpeech: 'adverb', lesson: 'Lesson_09', example: 'Bihira siyang magalit.' }
                  ],
                  activities: [
                    { id: 'ACT-901', sentence: '___ ako nag-aral ng Tagalog.', target: 'Kahapon', options: ['Kahapon', 'Bukas', 'Ngayon'], lesson: 'Lesson_09' },
                    { id: 'ACT-902', sentence: 'Aalis kami papuntang Maynila ___.', target: 'bukas', options: ['bukas', 'kahapon', 'kanina'], lesson: 'Lesson_09' },
                    { id: 'ACT-903', sentence: '___ siyang kumakain ng gulay.', target: 'Lagi', options: ['Lagi', 'Bukas', 'Kahapon'], lesson: 'Lesson_09' },
                    { id: 'ACT-904', sentence: 'Naglalaro ang mga bata ___.', target: 'ngayon', options: ['ngayon', 'noon', 'kahapon'], lesson: 'Lesson_09' }
                  ],
                  quiz: {
                    quiz_metadata: {
                      title: 'Lesson 9 Mastery Exam',
                      lesson: 'Lesson_09',
                      total_questions: 8
                    },
                    questions: Array.from({ length: 8 }).map((_, i) => ({
                      id: `Q-90${i + 1}`,
                      question: `What is the meaning of adverb ${i + 1}?`,
                      options: ['Option A', 'Option B', 'Option C', 'Option D'],
                      correctIndex: 0,
                      explanation: `Explanation for question ${i + 1}`
                    }))
                  }
                }) + '\n```'
              }
            ]
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const structured = await structureLessonWithAi({
      slideText: 'Slide 1: Adverbs of Time\nKahapon, Ngayon, Bukas...',
      lessonName: 'Lesson_09'
    });

    expect(structured).toBeDefined();
    expect(structured.lessonKey).toBe('Lesson_09');
    expect(structured.theory.length).toBeGreaterThanOrEqual(1);
    expect(structured.vocabulary.length).toBeGreaterThanOrEqual(10);
    expect(structured.activities.length).toBeGreaterThanOrEqual(4);
    expect(structured.quiz.questions.length).toBe(8);
  });

  it('automatically falls back to extract vocabulary from theory tables if AI returns sparse vocab', async () => {
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  title: 'Lesson 10 — Weather Expressions',
                  summary: 'Learn weather vocabulary in Tagalog.',
                  theory: [
                    {
                      id: 'THEORY-10-01',
                      topic: 'Weather Adjectives',
                      table: [
                        { tagalog: 'Ulan', english: 'Rain' },
                        { tagalog: 'Araw', english: 'Sun' },
                        { tagalog: 'Hangin', english: 'Wind' },
                        { tagalog: 'Bagyo', english: 'Storm' },
                        { tagalog: 'Ulop', english: 'Fog' },
                        { tagalog: 'Malamig', english: 'Cold' },
                        { tagalog: 'Mainit', english: 'Hot' },
                        { tagalog: 'Maulap', english: 'Cloudy' },
                        { tagalog: 'Mahangin', english: 'Windy' },
                        { tagalog: 'Maulan', english: 'Rainy' }
                      ]
                    }
                  ],
                  vocabulary: [], // AI mistakenly returned 0 items
                  activities: [
                    { id: 'ACT-10-1', sentence: '___ ang panahon ngayon.', target: 'Maulan', options: ['Maulan', 'Kahapon'] },
                    { id: 'ACT-10-2', sentence: 'May malakas na ___.', target: 'hangin', options: ['hangin', 'araw'] },
                    { id: 'ACT-10-3', sentence: 'Mainit ang ___.', target: 'araw', options: ['araw', 'ulan'] },
                    { id: 'ACT-10-4', sentence: 'Magdala ka ng payong dahil may ___.', target: 'ulan', options: ['ulan', 'hangin'] }
                  ],
                  quiz: {
                    quiz_metadata: { title: 'Exam', lesson: 'Lesson_10' },
                    questions: Array.from({ length: 8 }).map((_, i) => ({
                      id: `Q-${i}`,
                      question: `Q ${i}`,
                      options: ['A', 'B', 'C', 'D'],
                      correctIndex: 0,
                      explanation: 'Expl'
                    }))
                  }
                })
              }
            ]
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const structured = await structureLessonWithAi({
      slideText: 'Weather slides text with rain and wind concepts',
      lessonName: 'Lesson_10'
    });

    // Verification: fallback extractor populated vocabulary from theory table
    expect(structured.vocabulary.length).toBeGreaterThanOrEqual(10);
    expect(structured.vocabulary.some(v => v.word === 'Ulan')).toBe(true);
    expect(structured.vocabulary.some(v => v.word === 'Maulan')).toBe(true);
  });

  it('generates dynamic AI quiz questions with correct schema and explanation', async () => {
    const mockQuizResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: '```json\n' + JSON.stringify({
                  title: 'Custom AI Interrogatives Quiz',
                  questions: [
                    {
                      id: 'AI-Q1',
                      question: 'What is the Tagalog word for "Who"?',
                      options: ['Sino', 'Ano', 'Saan', 'Kailan'],
                      correctIndex: 0,
                      explanation: 'Sino is the interrogative word for asking about a person (Who).'
                    },
                    {
                      id: 'AI-Q2',
                      question: 'What does "Bakit" mean in English?',
                      options: ['Why', 'How', 'Where', 'When'],
                      correctIndex: 0,
                      explanation: 'Bakit is used to ask for reasons or explanations (Why).'
                    }
                  ]
                }) + '\n```'
              }
            ]
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuizResponse
    });

    const quizResult = await generateAiQuiz({
      lessonFilter: 'Lesson_06',
      questionCount: 2,
      vocabularyList: [
        { word: 'Sino', meaning: 'Who' },
        { word: 'Bakit', meaning: 'Why' }
      ]
    });

    expect(quizResult).toBeDefined();
    expect(quizResult.questions).toHaveLength(2);
    expect(quizResult.questions[0].options).toHaveLength(4);
    expect(quizResult.questions[0].correctIndex).toBe(0);
    expect(quizResult.questions[0].explanation).toContain('Sino');
  });
});
