/**
 * AI Lesson Structurer Engine
 * Takes raw slide presentation text and uses Google Gemini API to structure
 * theory topics, vocabulary entries, practice activities, and a mastery exam.
 */

import { getAiConfig } from './aiConfigStore';
import { callGeminiApiWithRetry } from './aiQuizGenerator';

/**
 * Structures raw slide text into Tagalog Master curriculum items.
 * 
 * @param {Object} options
 * @param {string} options.slideText - Extracted text across all slides
 * @param {string} options.lessonName - Normalized lesson identifier (e.g. "Lesson_09")
 * @param {string} [options.lessonTitle] - Optional human-friendly title
 * @param {string} [options.customInstructions] - User focus directives
 * @returns {Promise<{
 *   lessonKey: string,
 *   title: string,
 *   summary: string,
 *   theory: Array<Object>,
 *   vocabulary: Array<Object>,
 *   activities: Array<Object>,
 *   quiz: Object
 * }>}
 */
export async function structureLessonWithAi(options = {}) {
  const {
    slideText = '',
    lessonName = 'Lesson_Custom',
    lessonTitle = '',
    customInstructions = ''
  } = options;

  if (!slideText || slideText.trim().length === 0) {
    throw new Error('Slide content is empty. Cannot structure lesson without text.');
  }

  const config = getAiConfig();
  if (!config.apiKey && !config.proxyUrl) {
    throw new Error('MISSING_API_KEY: Please configure your Google Gemini API Key in Settings (⚙️) to ingest lessons.');
  }

  // Normalize lessonKey (e.g. "Lesson 09" -> "Lesson_09")
  const normLessonKey = lessonName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  const timestamp = Date.now();

  const prompt = `You are a master Tagalog language teacher and curriculum architect.
Your task is to analyze the following PowerPoint lesson content and extract a complete, production-ready interactive lesson module for Tagalog Master.

--- SLIDE PRESENTATION CONTENT ---
${slideText}
--- END PRESENTATION CONTENT ---

${customInstructions ? `USER DIRECTIVE:\n${customInstructions}\n` : ''}

INSTRUCTIONS & SCHEMAS:
Extract all content into a single JSON object with EXACTLY these four sections:

1. "lesson_info":
   - "lessonKey": "${normLessonKey}"
   - "title": "Clear English title describing the lesson (e.g. 'Lesson 9: Actor vs Object Focus Verbs')"
   - "summary": "2-3 sentence overview of this lesson's core concepts"

2. "theory": Array of grammar theory topics. For each topic include:
   - "id": "THEORY-${normLessonKey}-XX" (e.g. "THEORY-${normLessonKey}-01")
   - "topic": "Grammar topic name"
   - "lesson": "${normLessonKey}"
   - "summary": "Concise summary of rules"
   - "table": (Optional but MANDATORY for pronoun/demonstrative sets) Array of rows: [{"pronoun": "...", "meaning": "...", "type": "...", "contraction": "..."}]
   - "rules": Array of rule objects with keys like "name", "description", "example_tagalog", "example_english", or "pairs": [{"pre": "...", "post": "...", "meaning": "..."}]
   - "formula": (Optional) "e.g. [Subject] + ay + [Predicate]"
   - "examples": Array of objects [{"tagalog": "...", "english": "..."}] or strings

3. "vocabulary": Array of ALL key words and linguistic elements introduced in this lesson (MANDATORY - MUST NOT BE EMPTY, aim for 10-30 terms):
   - Include nouns, adjectives, verbs, question words (sino, ano, saan...), enclitic particles (ba, na, pa, din/rin...), pseudo-verbs (gusto, ayaw...), prefixes/suffixes (kasing-, napaka-, pinaka-).
   - "id": "VOCAB-${normLessonKey}-001"
   - "word": "Tagalog word"
   - "meaning": "English definition"
   - "partOfSpeech": "noun | verb | adjective | pronoun | particle | adverb | preposition | prefix"
   - "lesson": "${normLessonKey}"
   - "example": "Tagalog sentence - English translation"

4. "activities": Array of 4 to 8 practice exercises based on the slides:
   - "id": "EX-${normLessonKey}-001"
   - "lesson": "${normLessonKey}"
   - "type": "fill_in_blank"
   - "prompt": "Sentence with blank ____ to fill in (e.g. 'Pumunta ____ (I) sa palengke.')"
   - "correctAnswer": "correct word"
   - "acceptedAnswers": ["correct word", "Alternate casing"]
   - "explanation": "Grammatical rationale"

5. "quiz": An 8-question Lesson Mastery Exam:
   - "quiz_metadata": {
       "id": "LESSON_${normLessonKey.toUpperCase()}_QUIZ",
       "lesson": "${normLessonKey}",
       "title": "${normLessonKey.replace('_', ' ')} Mastery Exam",
       "topic": "Mastery exam on ${normLessonKey}",
       "total_questions": 8,
       "created_at": "${new Date().toISOString()}"
     }
   - "questions": Array of 8 questions, each:
     - "id": "${normLessonKey}-Q01"
     - "type": "multiple_choice"
     - "topic": "Topic covered"
     - "lesson": "${normLessonKey}"
     - "prompt": "Question prompt testing grammar or vocabulary"
     - "options": ["Option A", "Option B", "Option C", "Option D"] (4 choices)
     - "correct_answer": "Option A"
     - "explanation": "Clear pedagogical explanation"

Return ONLY a valid JSON object matching the schema. Do not wrap in extra markdown explanations.`;

  try {
    const rawText = await callGeminiApiWithRetry(prompt, config);
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedText);

    // Sanitize and validate
    const lessonInfo = result.lesson_info || {};
    const finalLessonKey = normLessonKey || lessonInfo.lessonKey || `Lesson_${timestamp}`;
    const finalTitle = lessonTitle || lessonInfo.title || finalLessonKey.replace('_', ' ');

    const theory = (Array.isArray(result.theory) ? result.theory : []).map((t, idx) => ({
      ...t,
      id: t.id || `THEORY-${finalLessonKey}-${String(idx + 1).padStart(2, '0')}`,
      lesson: finalLessonKey,
      topic: t.topic || `Grammar Topic ${idx + 1}`
    }));

    let rawVocab = Array.isArray(result.vocabulary) ? result.vocabulary : [];

    // Fallback: If vocabulary array is empty, extract terms from theory tables and rules
    if (rawVocab.length === 0 && theory.length > 0) {
      theory.forEach((t) => {
        if (Array.isArray(t.table)) {
          t.table.forEach((row) => {
            const word = row.tagalog || row.filipino || row.term || row.word || row.pronoun;
            if (word) {
              rawVocab.push({
                word,
                meaning: row.english || row.meaning || row.translation || 'Grammatical term',
                partOfSpeech: row.type || row.partOfSpeech || 'vocabulary',
                example: row.usage || row.example || ''
              });
            }
          });
        }
        if (Array.isArray(t.rules)) {
          t.rules.forEach((r) => {
            if (r.pattern && !rawVocab.some((v) => v.word === r.pattern)) {
              rawVocab.push({
                word: r.pattern,
                meaning: r.description || r.meaning || 'Rule pattern',
                partOfSpeech: 'grammar_pattern',
                example: ''
              });
            }
          });
        }
      });
    }

    const vocabulary = rawVocab.map((v, idx) => ({
      ...v,
      id: v.id || `VOCAB-${finalLessonKey}-${String(idx + 1).padStart(3, '0')}`,
      lesson: finalLessonKey,
      word: v.word || '',
      meaning: v.meaning || '',
      partOfSpeech: v.partOfSpeech || 'vocabulary',
      example: v.example || ''
    }));

    const activities = (Array.isArray(result.activities) ? result.activities : []).map((a, idx) => ({
      ...a,
      id: a.id || `EX-${finalLessonKey}-${String(idx + 1).padStart(3, '0')}`,
      lesson: finalLessonKey,
      type: a.type || 'fill_in_blank',
      prompt: a.prompt || '',
      correctAnswer: a.correctAnswer || a.correct_answer || '',
      acceptedAnswers: a.acceptedAnswers || [a.correctAnswer || ''],
      explanation: a.explanation || ''
    }));

    let quiz = result.quiz;
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      // Fallback quiz structure if omitted
      quiz = {
        quiz_metadata: {
          id: `LESSON_${finalLessonKey.toUpperCase()}_QUIZ`,
          lesson: finalLessonKey,
          title: `${finalLessonKey.replace('_', ' ')} Mastery Exam`,
          topic: finalTitle,
          total_questions: 0,
          created_at: new Date().toISOString()
        },
        questions: []
      };
    } else {
      quiz.quiz_metadata = {
        ...quiz.quiz_metadata,
        id: quiz.quiz_metadata?.id || `LESSON_${finalLessonKey.toUpperCase()}_QUIZ`,
        lesson: finalLessonKey,
        title: quiz.quiz_metadata?.title || `${finalLessonKey.replace('_', ' ')} Mastery Exam`,
        total_questions: quiz.questions.length,
        created_at: new Date().toISOString()
      };
      quiz.questions = quiz.questions.map((q, idx) => ({
        ...q,
        id: q.id || `${finalLessonKey}-Q${String(idx + 1).padStart(2, '0')}`,
        lesson: finalLessonKey,
        type: q.type || 'multiple_choice',
        correct_answer: q.correct_answer || q.options?.[0] || ''
      }));
    }

    return {
      id: `USER_LESSON_${finalLessonKey}_${timestamp}`,
      lessonKey: finalLessonKey,
      title: finalTitle,
      summary: lessonInfo.summary || `Imported ${finalLessonKey} materials`,
      createdAt: new Date().toISOString(),
      theory,
      vocabulary,
      activities,
      quiz
    };
  } catch (err) {
    console.error('Failed to structure lesson with AI:', err);
    throw err;
  }
}
