/**
 * AI Conversational Flashcard Evaluator
 * Evaluates student responses in Tagalog/English incorporating semantic accuracy,
 * grammatical correctness, and response latency into FSRS-5 rating recommendations.
 */

import { getAiConfig } from './aiConfigStore';
import { callGeminiApiWithRetry } from './aiQuizGenerator';

/**
 * Normalizes text for offline exact/partial matching
 */
function normalizeText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Local fallback evaluation when offline or API is unavailable
 */
export function evaluateAnswerLocally({ card, cardDirection = 'forward', userAnswer = '', responseTimeMs = 3000 }) {
  const normInput = normalizeText(userAnswer);
  const target = cardDirection === 'reverse' ? card.word : card.meaning;
  const targetNorm = normalizeText(target);
  const seconds = (responseTimeMs / 1000).toFixed(1);

  if (!normInput) {
    return {
      isCorrect: false,
      suggestedRating: 1,
      ratingLabel: 'De nuevo',
      feedbackTagalog: 'Subukan muli sa susunod.',
      feedbackSpanish: 'No se detectó respuesta. La respuesta correcta era: ' + target,
      explanation: `Target: ${target}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  }

  // Exact or contains match
  const isExact = normInput === targetNorm;
  const isPartial = normInput.includes(targetNorm) || targetNorm.includes(normInput);

  if (isExact) {
    if (responseTimeMs <= 3500) {
      return {
        isCorrect: true,
        suggestedRating: 4,
        ratingLabel: 'Fácil ⭐',
        feedbackTagalog: 'Napakagaling! Mabilis at tumpak.',
        feedbackSpanish: `¡Excelente! Respuesta exacta en ${seconds}s.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    } else if (responseTimeMs <= 8000) {
      return {
        isCorrect: true,
        suggestedRating: 3,
        ratingLabel: 'Bien',
        feedbackTagalog: 'Magaling! Tama ang sagot.',
        feedbackSpanish: `¡Bien! Respuesta correcta en ${seconds}s.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    } else {
      return {
        isCorrect: true,
        suggestedRating: 2,
        ratingLabel: 'Difícil',
        feedbackTagalog: 'Tama, ngunit medyo matagal bago maalala.',
        feedbackSpanish: `Correcto, pero te tomó ${seconds}s recordarlo.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    }
  }

  if (isPartial) {
    return {
      isCorrect: true,
      suggestedRating: 2,
      ratingLabel: 'Difícil',
      feedbackTagalog: 'Malapit na! May kaunting pagkakaiba.',
      feedbackSpanish: `Casi exacto (${normInput}). Respuesta sugerida: ${target}`,
      explanation: `${card.word} = ${card.meaning}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  }

  return {
    isCorrect: false,
    suggestedRating: 1,
    ratingLabel: 'De nuevo',
    feedbackTagalog: `Mali. Ang tamang sagot ay "${target}".`,
    feedbackSpanish: `Incorrecto. La respuesta era: "${target}". Repasémosla pronto.`,
    explanation: `${card.word} = ${card.meaning}`,
    responseTimeSeconds: parseFloat(seconds)
  };
}

/**
 * Evaluates student answer using Gemini 2.5 Flash with response time & context.
 */
export async function evaluateConversationalAnswer({
  card,
  cardDirection = 'forward',
  userAnswer = '',
  responseTimeMs = 3000,
  configOverrides = {}
}) {
  const config = { ...getAiConfig(), ...configOverrides };
  const seconds = (responseTimeMs / 1000).toFixed(1);

  // If no API key configured, use intelligent local evaluation
  if (!config.apiKey && !config.proxyUrl) {
    return evaluateAnswerLocally({ card, cardDirection, userAnswer, responseTimeMs });
  }

  const promptQuestion =
    cardDirection === 'reverse'
      ? `Translate from English to Tagalog: "${card.meaning}"`
      : `Give the English meaning of Tagalog word: "${card.word}"`;

  const targetAnswer = cardDirection === 'reverse' ? card.word : card.meaning;

  const prompt = `You are a friendly, encouraging Tagalog language tutor evaluating a flashcard practice drill.

### Exercise Context:
- Target Concept: Tagalog: "${card.word}" | English: "${card.meaning}"
- Part of Speech: ${card.partOfSpeech || 'vocabulary'}
- Example Sentence: "${card.example || ''}"
- Prompt given to student: "${promptQuestion}"
- Target Ideal Answer: "${targetAnswer}"
- Student's Response: "${userAnswer || '(no response)'}"
- Response Latency: ${seconds} seconds (${responseTimeMs} ms)

### Evaluation Criteria:
1. "isCorrect": true if student's answer accurately captures the meaning or is a valid synonym/inflection, false otherwise.
2. "suggestedRating":
   - 4 (Easy): Perfect accuracy AND fast response (under <= 3.5 seconds).
   - 3 (Good): Accurate answer within normal recall time (3.5s - 8.0s) or minor synonym.
   - 2 (Hard): Correct but slow recall (> 8.0s), or answer has minor typo/spelling hesitation.
   - 1 (Again): Incorrect answer, completely wrong word, or no answer.
3. "ratingLabel": "Fácil ⭐" | "Bien" | "Difícil" | "De nuevo"
4. "feedbackTagalog": Short 1-sentence supportive feedback in conversational Tagalog (e.g. "Napakagaling!", "Tama!", "Medyo malapit na...").
5. "feedbackSpanish": Short 1-2 sentence constructive feedback in Spanish explaining why and noting recall speed.
6. "explanation": Grammatical or vocabulary note clarifying any nuance.

Return ONLY a valid JSON object matching this schema:
{
  "isCorrect": boolean,
  "suggestedRating": number,
  "ratingLabel": string,
  "feedbackTagalog": string,
  "feedbackSpanish": string,
  "explanation": string
}`;

  try {
    const rawResponse = await callGeminiApiWithRetry(prompt, config);
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);

    return {
      isCorrect: Boolean(result.isCorrect),
      suggestedRating: Math.min(4, Math.max(1, parseInt(result.suggestedRating, 10) || 3)),
      ratingLabel: result.ratingLabel || (result.suggestedRating === 4 ? 'Fácil ⭐' : result.suggestedRating === 3 ? 'Bien' : result.suggestedRating === 2 ? 'Difícil' : 'De nuevo'),
      feedbackTagalog: result.feedbackTagalog || 'Magaling!',
      feedbackSpanish: result.feedbackSpanish || (result.isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'),
      explanation: result.explanation || `${card.word} = ${card.meaning}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  } catch (err) {
    console.warn('Gemini conversational evaluation failed, using local fallback:', err.message);
    return evaluateAnswerLocally({ card, cardDirection, userAnswer, responseTimeMs });
  }
}
