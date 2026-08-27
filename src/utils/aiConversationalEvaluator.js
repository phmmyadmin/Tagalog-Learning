/**
 * AI Conversational Flashcard Evaluator
 * Evaluates student responses in Tagalog/English incorporating semantic accuracy,
 * phonetic tolerance, and response latency into FSRS-5 rating recommendations.
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
 * Calculates string similarity between 0.0 and 1.0 (Levenshtein based)
 */
function calculateSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;

  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longer.length - costs[shorter.length]) / parseFloat(longer.length);
}

/**
 * Local fallback evaluation when offline or API is unavailable
 */
export function evaluateAnswerLocally({
  card,
  cardDirection = 'forward',
  userAnswer = '',
  speechAlternatives = [],
  responseTimeMs = 3000
}) {
  const target = cardDirection === 'reverse' ? card.word : card.meaning;
  const targetNorm = normalizeText(target);
  const seconds = (responseTimeMs / 1000).toFixed(1);

  const candidates = [userAnswer, ...(Array.isArray(speechAlternatives) ? speechAlternatives : [])]
    .map(normalizeText)
    .filter(Boolean);

  if (candidates.length === 0) {
    return {
      isCorrect: false,
      suggestedRating: 1,
      ratingLabel: 'Again',
      feedbackTagalog: 'Subukan muli sa susunod.',
      feedbackEnglish: 'No response detected. The correct answer was: ' + target,
      explanation: `Target: ${target}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  }

  // Find best match among all candidates and alternatives
  let bestSimilarity = 0;
  let bestCandidate = candidates[0];
  let isExact = false;
  let isPartial = false;

  for (const cand of candidates) {
    if (cand === targetNorm) {
      isExact = true;
      bestSimilarity = 1.0;
      bestCandidate = cand;
      break;
    }
    if (cand.includes(targetNorm) || targetNorm.includes(cand)) {
      isPartial = true;
    }
    const sim = calculateSimilarity(cand, targetNorm);
    if (sim > bestSimilarity) {
      bestSimilarity = sim;
      bestCandidate = cand;
    }
  }

  // Exact or high phonetic similarity (>75% similarity or partial match)
  if (isExact || bestSimilarity >= 0.85) {
    if (responseTimeMs <= 3500) {
      return {
        isCorrect: true,
        suggestedRating: 4,
        ratingLabel: 'Easy ⭐',
        feedbackTagalog: 'Napakagaling! Mabilis at tumpak.',
        feedbackEnglish: `Excellent! Exact answer in ${seconds}s.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    } else if (responseTimeMs <= 8000) {
      return {
        isCorrect: true,
        suggestedRating: 3,
        ratingLabel: 'Good',
        feedbackTagalog: 'Magaling! Tama ang sagot.',
        feedbackEnglish: `Good! Correct answer in ${seconds}s.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    } else {
      return {
        isCorrect: true,
        suggestedRating: 2,
        ratingLabel: 'Hard',
        feedbackTagalog: 'Tama, ngunit medyo matagal bago maalala.',
        feedbackEnglish: `Correct, but it took ${seconds}s to recall.`,
        explanation: `${card.word} = ${card.meaning}`,
        responseTimeSeconds: parseFloat(seconds)
      };
    }
  }

  if (isPartial || bestSimilarity >= 0.70) {
    return {
      isCorrect: true,
      suggestedRating: 3,
      ratingLabel: 'Good',
      feedbackTagalog: 'Malapit na! Magaling ang pagbigkas.',
      feedbackEnglish: `Recognized ("${bestCandidate}"). Suggested answer: ${target}`,
      explanation: `${card.word} = ${card.meaning}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  }

  return {
    isCorrect: false,
    suggestedRating: 1,
    ratingLabel: 'Again',
    feedbackTagalog: `Mali. Ang tamang sagot ay "${target}".`,
    feedbackEnglish: `Incorrect. The correct answer was: "${target}". Let's review it soon.`,
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
  speechAlternatives = [],
  responseTimeMs = 3000,
  configOverrides = {}
}) {
  const config = { ...getAiConfig(), ...configOverrides };
  const seconds = (responseTimeMs / 1000).toFixed(1);

  // If no API key configured, use intelligent local evaluation
  if (!config.apiKey && !config.proxyUrl) {
    return evaluateAnswerLocally({ card, cardDirection, userAnswer, speechAlternatives, responseTimeMs });
  }

  const promptQuestion =
    cardDirection === 'reverse'
      ? `Translate from English to Tagalog: "${card.meaning}"`
      : `Give the English meaning of Tagalog word: "${card.word}"`;

  const targetAnswer = cardDirection === 'reverse' ? card.word : card.meaning;
  const candidateList = Array.from(new Set([userAnswer, ...(Array.isArray(speechAlternatives) ? speechAlternatives : [])])).filter(Boolean);

  const prompt = `You are a friendly, encouraging Tagalog language tutor evaluating a flashcard practice drill.

### Exercise Context:
- Target Concept: Tagalog: "${card.word}" | English: "${card.meaning}"
- Part of Speech: ${card.partOfSpeech || 'vocabulary'}
- Example Sentence: "${card.example || ''}"
- Prompt given to student: "${promptQuestion}"
- Target Ideal Answer: "${targetAnswer}"
- Speech Recognition Transcripts & Alternatives: ${JSON.stringify(candidateList.length ? candidateList : ['(no response)'])}
- Response Latency: ${seconds} seconds (${responseTimeMs} ms)

### Evaluation Guidelines (Phonetic & Accent Tolerance):
1. The student is speaking to a microphone. Voice-to-text engines commonly introduce minor phonetic variances (e.g., Tagalog 'bahay' heard as 'baha', 'bye', or 'bahai'; 'aso' heard as 'asso' or 'asul'; 'salamat' heard as 'salamat po').
2. If ANY candidate in the alternatives list matches the target answer semantically, phonetically, or as a valid synonym/inflection, mark "isCorrect": true!
3. "suggestedRating":
   - 4 (Easy): Exact answer AND fast response (under <= 3.5 seconds).
   - 3 (Good): Correct/synonymous answer within normal recall time (3.5s - 8.0s) or minor accent variance.
   - 2 (Hard): Correct but slow recall (> 8.0s), or answer required spelling correction.
   - 1 (Again): Completely incorrect word or no response.
4. "ratingLabel": "Easy ⭐" | "Good" | "Hard" | "Again"
5. "feedbackTagalog": Short 1-sentence supportive feedback in conversational Tagalog (e.g. "Napakagaling!", "Tama!", "Magandang pagbigkas!").
6. "feedbackEnglish": Short 1-2 sentence constructive feedback in English explaining why and noting recall speed.
7. "explanation": Grammatical or vocabulary note clarifying any nuance.

Return ONLY a valid JSON object matching this schema:
{
  "isCorrect": boolean,
  "suggestedRating": number,
  "ratingLabel": string,
  "feedbackTagalog": string,
  "feedbackEnglish": string,
  "explanation": string
}`;

  try {
    const rawResponse = await callGeminiApiWithRetry(prompt, config);
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);

    return {
      isCorrect: Boolean(result.isCorrect),
      suggestedRating: Math.min(4, Math.max(1, parseInt(result.suggestedRating, 10) || 3)),
      ratingLabel: result.ratingLabel || (result.suggestedRating === 4 ? 'Easy ⭐' : result.suggestedRating === 3 ? 'Good' : result.suggestedRating === 2 ? 'Hard' : 'Again'),
      feedbackTagalog: result.feedbackTagalog || 'Magaling!',
      feedbackEnglish: result.feedbackEnglish || (result.isCorrect ? 'Correct answer!' : 'Incorrect answer.'),
      explanation: result.explanation || `${card.word} = ${card.meaning}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  } catch (err) {
    console.warn('Gemini conversational evaluation failed, using local fallback:', err.message);
    return evaluateAnswerLocally({ card, cardDirection, userAnswer, speechAlternatives, responseTimeMs });
  }
}
