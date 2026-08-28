/**
 * AI Conversational Flashcard Evaluator
 * Evaluates student responses in Tagalog/English incorporating semantic accuracy,
 * phonetic tolerance, short-word homophone resolution, and response latency into FSRS-5 rating recommendations.
 */

import { getAiConfig } from './aiConfigStore';
import { callGeminiApiWithRetry, isGeminiRateLimited } from './aiQuizGenerator';

/**
 * Normalizes text for offline exact/partial matching
 */
export function normalizeText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Common short-word homophones, phonetic variants, and common speech recognition mis-transcriptions
 * for English and Tagalog vocabulary.
 */
export const HOMOPHONES = {
  // English short words & pronouns & markers
  'i': ['i', 'eye', 'aye', 'ai', 'hi', 'me', 'im', 'ay', 'ah', 'one', 'a'],
  'me': ['me', 'i', 'mi'],
  'the': ['the', 'da', 'de', 'dee', 'duh', 'th', 'd', 'di', 'thee'],
  'a': ['a', 'an', 'uh', 'ay', 'one', 'ah', 'er'],
  'an': ['an', 'a', 'un'],
  'he': ['he', 'hi', 'hee', 'him'],
  'she': ['she', 'shi', 'her'],
  'it': ['it', 'eat', 'its', 'et'],
  'we': ['we', 'wi', 'wee', 'us'],
  'you': ['you', 'u', 'yu', 'yoo', 'yo', 'ya'],
  'they': ['they', 'dey', 'them'],
  'my': ['my', 'mai', 'mine', 'mi'],
  'your': ['your', 'ur', 'yore', 'yours'],
  'is': ['is', 'iz', 'es'],
  'to': ['to', 'too', 'two', 'tu'],
  'in': ['in', 'inn', 'en'],
  'on': ['on', 'ahn', 'un'],
  'at': ['at', 'att', 'et'],
  'no': ['no', 'know', 'noh', 'nope'],
  'yes': ['yes', 'yeah', 'yep', 'yass', 'oo', 'opo'],
  'and': ['and', 'und', 'nd'],
  'or': ['or', 'o', 'ore'],
  'not': ['not', 'knot', 'nah'],

  // Tagalog short words, enclitics, pronouns, and markers
  'ang': ['ang', 'ung', 'ong', 'an', 'hang'],
  'ng': ['ng', 'nang', 'ung', 'eng', 'ng.', 'nang.'],
  'mga': ['mga', 'manga', 'mangga', 'ma', 'mga.'],
  'si': ['si', 'see', 'sea', 'c', 'she'],
  'sa': ['sa', 'sah', 'suh', 'tha'],
  'kay': ['kay', 'kai', 'ki'],
  'ko': ['ko', 'co', 'koh', 'go'],
  'mo': ['mo', 'moh', 'mu'],
  'ka': ['ka', 'kah', 'ca', 'k'],
  'ba': ['ba', 'bah', 'va'],
  'na': ['na', 'nah'],
  'pa': ['pa', 'pah'],
  'po': ['po', 'poh'],
  'opo': ['opo', 'o po', 'oo po'],
  'din': ['din', 'rin', 'deen', 'reen'],
  'rin': ['rin', 'din', 'reen'],
  'daw': ['daw', 'raw', 'dow'],
  'raw': ['raw', 'daw', 'row'],
  'nga': ['nga', 'ngah', 'na'],
  'man': ['man', 'mahn'],
  'ako': ['ako', 'aco', 'akó', 'akoo', 'aku'],
  'ikaw': ['ikaw', 'ikao', 'ecao', 'ikaw.'],
  'siya': ['siya', 'sya', 'sha', 'shiya'],
  'kami': ['kami', 'camee', 'kame'],
  'tayo': ['tayo', 'taio'],
  'sila': ['sila', 'sheela', 'sela'],
  'kita': ['kita', 'quetta'],
  'ito': ['ito', 'eto', 'eeto'],
  'iyan': ['iyan', 'eyan', 'yan'],
  'iyon': ['iyon', 'eyon', 'yon'],
  'ano': ['ano', 'anu', 'anno'],
  'sino': ['sino', 'seeno', 'ceno'],
  'saan': ['saan', 'san', 'sahn'],
  'kailan': ['kailan', 'kelan', 'kaylan'],
  'bakit': ['bakit', 'bat', 'ba\'t', 'baket'],
  'paano': ['paano', 'pano', 'pahno'],
  'ilan': ['ilan', 'elahn'],
  'alin': ['alin', 'aleen'],
  'gusto': ['gusto', 'gusto ko', 'gosto'],
  'ayaw': ['ayaw', 'ayao', 'ayo'],
  'buhay': ['buhay', 'boohay', 'buhai'],
  'bahay': ['bahay', 'baha', 'bahai', 'bye']
};

/**
 * Extracts multiple valid sub-target variations from a vocabulary definition
 * (e.g. "I / me" -> ["i me", "i", "me"], "the (marker)" -> ["the marker", "the"])
 */
export function extractTargetVariants(targetStr) {
  if (!targetStr) return [];
  const raw = String(targetStr).toLowerCase().trim();
  const variants = new Set();

  // 1. Normalized full string
  variants.add(normalizeText(raw));

  // 2. Remove parenthesized text (e.g. "the (marker)" -> "the")
  const withoutParens = raw.replace(/\([^)]*\)/g, '').trim();
  if (withoutParens) {
    variants.add(normalizeText(withoutParens));
  }

  // 3. Extract parenthesized text content as separate variants
  const parenMatches = raw.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    for (const m of parenMatches) {
      const clean = normalizeText(m.replace(/[()]/g, '').trim());
      if (clean) variants.add(clean);
    }
  }

  // 4. Split by delimiters: '/', ',', ';', ' or '
  const delimiters = ['/', ',', ';', ' or '];
  const allBases = [raw, withoutParens];
  for (const base of allBases) {
    if (!base) continue;
    for (const delim of delimiters) {
      if (base.includes(delim)) {
        base.split(delim).forEach(part => {
          const clean = normalizeText(part);
          if (clean) variants.add(clean);
        });
      }
    }
  }

  return Array.from(variants).filter(Boolean);
}

/**
 * Calculates string similarity between 0.0 and 1.0 (Levenshtein based)
 */
export function calculateSimilarity(s1, s2) {
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
 * Checks if a candidate is phonetically or homophonically equivalent to target variant
 */
export function isPhoneticallyEquivalent(candidate, targetVariant) {
  if (!candidate || !targetVariant) return false;
  if (candidate === targetVariant) return true;

  // Direct homophone check for target
  const targetHomophones = HOMOPHONES[targetVariant] || [];
  if (targetHomophones.includes(candidate)) return true;

  // Direct homophone check for candidate
  const candidateHomophones = HOMOPHONES[candidate] || [];
  if (candidateHomophones.includes(targetVariant)) return true;

  // For short words (<= 3 chars), allow 1 character variance (e.g. "da" vs "the", "hi" vs "he")
  if (targetVariant.length <= 3 && candidate.length <= 3) {
    const sim = calculateSimilarity(candidate, targetVariant);
    if (sim >= 0.50) return true;
  }

  return false;
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
  const targetVariants = extractTargetVariants(target);
  const seconds = (responseTimeMs / 1000).toFixed(1);

  // Generate candidate list from user answer and all alternatives, including individual words
  const rawCandidates = [userAnswer, ...(Array.isArray(speechAlternatives) ? speechAlternatives : [])];
  const candidatesSet = new Set();

  for (const raw of rawCandidates) {
    const norm = normalizeText(raw);
    if (norm) {
      candidatesSet.add(norm);
      // Also add individual words if user spoke a multi-word phrase
      const words = norm.split(' ').filter(Boolean);
      if (words.length > 1) {
        words.forEach(w => candidatesSet.add(w));
      }
    }
  }

  const candidates = Array.from(candidatesSet);

  if (candidates.length === 0) {
    return {
      isCorrect: false,
      userAnswer: '',
      suggestedRating: 1,
      ratingLabel: 'Again',
      feedbackTagalog: 'Subukan muli sa susunod.',
      feedbackEnglish: 'No response detected. The correct answer was: ' + target,
      explanation: `Target: ${target}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  }

  let bestSimilarity = 0;
  let bestCandidate = candidates[0];
  let isExact = false;
  let isPartial = false;

  for (const cand of candidates) {
    for (const variant of targetVariants) {
      if (cand === variant || isPhoneticallyEquivalent(cand, variant)) {
        isExact = true;
        bestSimilarity = 1.0;
        bestCandidate = cand;
        break;
      }
      if (cand.includes(variant) || variant.includes(cand)) {
        isPartial = true;
      }
      const sim = calculateSimilarity(cand, variant);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestCandidate = cand;
      }
    }
    if (isExact) break;
  }

  // Exact match, homophone equivalent, or high phonetic similarity (>85% or short word match)
  if (isExact || bestSimilarity >= 0.85) {
    if (responseTimeMs <= 3500) {
      return {
        isCorrect: true,
        userAnswer: userAnswer || bestCandidate,
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
        userAnswer: userAnswer || bestCandidate,
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
        userAnswer: userAnswer || bestCandidate,
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
      userAnswer: userAnswer || bestCandidate,
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
    userAnswer: userAnswer || bestCandidate,
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
  const localEval = evaluateAnswerLocally({ card, cardDirection, userAnswer, speechAlternatives, responseTimeMs });

  // If no API key configured, currently rate limited, or local evaluator has high confidence match, return instantly
  if ((!config.apiKey && !config.proxyUrl) || isGeminiRateLimited() || localEval.isCorrect) {
    return localEval;
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
1. The student is speaking to a microphone. Voice-to-text engines commonly introduce minor phonetic variances (e.g., Tagalog 'bahay' heard as 'baha', 'bye', or 'bahai'; 'aso' heard as 'asso' or 'asul'; 'salamat' heard as 'salamat po'; English 'I' heard as 'eye' or 'aye'; 'the' heard as 'da' or 'de').
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
      userAnswer: String(userAnswer || '').trim(),
      suggestedRating: Math.min(4, Math.max(1, parseInt(result.suggestedRating, 10) || 3)),
      ratingLabel: result.ratingLabel || (result.suggestedRating === 4 ? 'Easy ⭐' : result.suggestedRating === 3 ? 'Good' : result.suggestedRating === 2 ? 'Hard' : 'Again'),
      feedbackTagalog: result.feedbackTagalog || 'Magaling!',
      feedbackEnglish: result.feedbackEnglish || (result.isCorrect ? 'Correct answer!' : 'Incorrect answer.'),
      explanation: result.explanation || `${card.word} = ${card.meaning}`,
      responseTimeSeconds: parseFloat(seconds)
    };
  } catch (err) {
    console.warn('Gemini conversational evaluation failed, using local fallback:', err.message);
    return localEval;
  }
}
