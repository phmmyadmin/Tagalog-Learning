/**
 * AI Quiz Generator Engine
 * Generates custom, adaptive, and topic-focused Tagalog quizzes using Google Gemini API.
 */

import { getAiConfig } from './aiConfigStore';
import { getSrsCardStates } from './srsStore';
import { getMistakes } from './mistakesManager';

/**
 * Builds the AI prompt and calls Gemini API to produce a structured quiz.
 *
 * @param {Object} options
 * @param {string} options.mode - 'adaptive_srs' | 'lesson' | 'custom_prompt' | 'grammar'
 * @param {string} [options.customPrompt] - User defined prompt
 * @param {string} [options.selectedLesson] - Selected lesson ID (e.g. 'Lesson_02')
 * @param {number} [options.questionCount=10] - Number of questions to generate
 * @param {string} [options.difficulty='beginner'] - Difficulty level
 * @param {Array} [options.vocabularyList=[]] - Full vocabulary list
 * @param {Array} [options.theoryList=[]] - Theory topics
 */
export async function generateAiQuiz(options = {}) {
  const {
    mode = 'adaptive_srs',
    customPrompt = '',
    selectedLesson = 'all',
    questionCount = 10,
    difficulty = 'beginner',
    vocabularyList = [],
    theoryList = [],
  } = options;

  const config = getAiConfig();

  if (!config.apiKey && !config.proxyUrl) {
    throw new Error('MISSING_API_KEY: Please configure your Google Gemini API Key in Settings (⚙️).');
  }

  // 1. Gather Context
  let contextVocab = [];
  let contextTheory = [];
  let contextMistakes = [];

  if (mode === 'adaptive_srs') {
    const cardStates = getSrsCardStates();
    const mistakes = getMistakes();

    // Pick cards with high difficulty, lapses, or in learning/relearning
    const weakVocab = vocabularyList.filter((item) => {
      const state = cardStates[item.id];
      if (!state) return false;
      return state.state === 'relearning' || state.state === 'learning' || (state.difficulty || 0) >= 6 || (state.lapses || 0) > 0;
    });

    contextVocab = weakVocab.length >= 5 ? weakVocab.slice(0, 20) : vocabularyList.slice(0, 25);
    contextMistakes = mistakes.slice(0, 10);
    contextTheory = theoryList.slice(0, 5);
  } else if (mode === 'lesson' && selectedLesson !== 'all') {
    contextVocab = vocabularyList.filter(
      (item) => item.lesson === selectedLesson || item.lesson === selectedLesson.replace(' ', '_')
    );
    contextTheory = theoryList.filter(
      (item) => item.lesson === selectedLesson || item.lesson === selectedLesson.replace(' ', '_')
    );
  } else {
    // General / Custom prompt
    contextVocab = vocabularyList.slice(0, 30);
    contextTheory = theoryList.slice(0, 8);
  }

  // 2. Format Context Strings
  const vocabSampleStr = contextVocab.map((v) => `${v.word} (${v.partOfSpeech || 'vocab'}): ${v.meaning}`).join('\n');
  const theorySampleStr = contextTheory.map((t) => `Topic: ${t.topic} - ${t.summary}`).join('\n');
  const mistakesSampleStr = contextMistakes.map((m) => `Prompt: ${m.prompt} | Correct: ${m.correct_answer}`).join('\n');

  // 3. Construct System Prompt
  const systemPrompt = `You are an expert Tagalog language teacher. Generate a ${questionCount}-question Tagalog quiz for a ${difficulty} student.

CONTEXT DATA:
Vocabulary Available:
${vocabSampleStr || 'None provided'}

Grammar Topics:
${theorySampleStr || 'None provided'}

${contextMistakes.length > 0 ? `Student Weak Areas / Past Mistakes:\n${mistakesSampleStr}` : ''}

${customPrompt ? `USER SPECIAL DIRECTIVE:\n${customPrompt}` : ''}

INSTRUCTIONS:
1. Generate exactly ${questionCount} questions.
2. Mix question types:
   - "multiple_choice" (4 options)
   - "fill_in_blank" (single word or short phrase answer)
3. Ensure all Tagalog words and grammar rules strictly follow standard modern Tagalog.
4. Include clear explanations for every question.
5. Return ONLY a valid JSON object matching the JSON schema below. Do not wrap in markdown or add extra conversational text.

REQUIRED JSON SCHEMA:
{
  "quiz_metadata": {
    "id": "AI_QUIZ_${Date.now()}",
    "title": "String (descriptive title)",
    "topic": "String (e.g. Adaptive SRS Review, Lesson 2 Grammar, Custom Focus)",
    "total_questions": ${questionCount}
  },
  "questions": [
    {
      "id": "Q_1",
      "type": "multiple_choice",
      "prompt": "String question prompt in English or Tagalog",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "String explanation why this answer is correct"
    },
    {
      "id": "Q_2",
      "type": "fill_in_blank",
      "prompt": "String sentence with blank ____",
      "correct_answer": "word",
      "accepted_answers": ["word", "Word"],
      "explanation": "String explanation"
    }
  ]
}`;

  // 4. API Request Construction
  const modelName = config.model || 'gemini-3.6-flash';
  let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`;

  if (config.proxyUrl && config.proxyUrl.trim().length > 0) {
    endpoint = config.proxyUrl.trim();
  }

  const payload = {
    contents: [
      {
        parts: [{ text: systemPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (!config.proxyUrl && config.apiKey) {
      // standard google API key header
      headers['x-goog-api-key'] = config.apiKey;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response received from Gemini AI.');
    }

    // Clean JSON output (remove ```json wrappers if present)
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizJson = JSON.parse(cleanedText);

    // Validate quiz JSON structure
    if (!quizJson.questions || !Array.isArray(quizJson.questions) || quizJson.questions.length === 0) {
      throw new Error('AI generated quiz has no valid questions.');
    }

    // Ensure all questions have required fields & unique IDs
    quizJson.questions = quizJson.questions.map((q, idx) => ({
      ...q,
      id: q.id || `AI_Q_${idx + 1}_${Date.now()}`,
      type: q.type || (q.options ? 'multiple_choice' : 'fill_in_blank'),
      correct_answer: q.correct_answer || q.options?.[0] || '',
    }));

    quizJson.quiz_metadata = {
      id: quizJson.quiz_metadata?.id || `AI_QUIZ_${Date.now()}`,
      title: quizJson.quiz_metadata?.title || `AI Generated Quiz (${mode})`,
      topic: quizJson.quiz_metadata?.topic || 'AI Generated',
      total_questions: quizJson.questions.length,
      created_at: new Date().toISOString(),
    };

    return quizJson;
  } catch (err) {
    console.error('AI Quiz Generation failed:', err);
    throw err;
  }
}
