/**
 * AI Neural Audio Service (Gemini TTS & Local Audio Cache)
 * Provides high-fidelity natural speech synthesis for Tagalog words & phrases
 * with offline IndexedDB/in-memory caching.
 */

import { getAiConfig } from './aiConfigStore';
import { isGeminiRateLimited, setGeminiRateLimited } from './aiQuizGenerator';

const CACHE_DB_NAME = 'tagalog_audio_cache_v1';
const CACHE_STORE_NAME = 'audio_blobs';

// In-memory fallback cache
const memoryAudioCache = new Map();

/**
 * Open IndexedDB for persistent audio caching
 */
function openAudioDb() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(CACHE_DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
        db.createObjectStore(CACHE_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

/**
 * Retrieves cached audio blob by text key
 */
export async function getCachedAudio(key) {
  const normKey = String(key || '').trim().toLowerCase();
  if (memoryAudioCache.has(normKey)) {
    return memoryAudioCache.get(normKey);
  }

  const db = await openAudioDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(CACHE_STORE_NAME, 'readonly');
      const store = tx.objectStore(CACHE_STORE_NAME);
      const req = store.get(normKey);
      req.onsuccess = () => {
        if (req.result) {
          memoryAudioCache.set(normKey, req.result);
          resolve(req.result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Saves audio blob into cache
 */
export async function saveCachedAudio(key, base64Audio, mimeType = 'audio/wav') {
  const normKey = String(key || '').trim().toLowerCase();
  const entry = { base64Audio, mimeType, timestamp: Date.now() };
  memoryAudioCache.set(normKey, entry);

  const db = await openAudioDb();
  if (!db) return;

  try {
    const tx = db.transaction(CACHE_STORE_NAME, 'readwrite');
    const store = tx.objectStore(CACHE_STORE_NAME);
    store.put(entry, normKey);
  } catch (e) {
    console.warn('Failed to save to IndexedDB audio cache:', e);
  }
}

/**
 * Converts raw 16-bit PCM buffer to a playable WAV ArrayBuffer
 */
export function pcm16ToWav(pcmData, sampleRate = 24000, numChannels = 1) {
  const byteLength = pcmData.byteLength;
  const buffer = new ArrayBuffer(44 + byteLength);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + byteLength, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16-bit)

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, byteLength, true);

  // Copy PCM data
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));

  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Synthesizes high-fidelity Tagalog speech using Gemini Neural TTS.
 * @param {string} text - Tagalog text to speak
 * @param {Object} options - Config overrides
 * @returns {Promise<string>} - Object URL or Base64 audio URI
 */
export async function synthesizeGeminiAudio(text, options = {}) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return null;

  // 1. Check cache first
  const cached = await getCachedAudio(cleanText);
  if (cached && cached.base64Audio) {
    return `data:${cached.mimeType || 'audio/wav'};base64,${cached.base64Audio}`;
  }

  // If currently rate-limited, skip network call to prevent 429 flood
  if (isGeminiRateLimited()) {
    return null;
  }

  const config = getAiConfig();
  const apiKey = options.apiKey || config.apiKey;

  if (!apiKey) {
    return null;
  }

  const model = options.model || config.model || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Pronounce the following Tagalog text with natural Filipino pronunciation, authentic syllable stress, and clear intonation:\n\n"${cleanText}"`
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: options.voiceName || 'Puck'
          }
        }
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    if (response.status === 429) {
      setGeminiRateLimited(20);
    }
    const errorText = await response.text();
    throw new Error(`Gemini Audio API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const audioPart = candidate?.content?.parts?.find((p) => p.inlineData && p.inlineData.data);

  if (!audioPart) {
    throw new Error('Gemini did not return an audio part in the response.');
  }

  const mimeType = audioPart.inlineData.mimeType || 'audio/wav';
  let base64Audio = audioPart.inlineData.data;

  // If Gemini returned raw PCM, convert to WAV container
  if (mimeType.includes('pcm') || mimeType.includes('raw')) {
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const wavBuffer = pcm16ToWav(bytes.buffer, 24000, 1);
    const wavBytes = new Uint8Array(wavBuffer);
    let binaryWav = '';
    for (let i = 0; i < wavBytes.length; i++) {
      binaryWav += String.fromCharCode(wavBytes[i]);
    }
    base64Audio = btoa(binaryWav);
  }

  // Cache for future instant playback
  await saveCachedAudio(cleanText, base64Audio, 'audio/wav');

  return `data:audio/wav;base64,${base64Audio}`;
}

/**
 * Plays Tagalog audio with seamless fallback.
 * Uses Gemini Neural Audio if configured, otherwise falls back to browser TTS.
 */
export async function playTagalogAudio(text, options = {}) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return;

  try {
    const audioUri = await synthesizeGeminiAudio(cleanText, options);
    if (audioUri) {
      const audio = new Audio(audioUri);
      await audio.play();
      return;
    }
  } catch (err) {
    console.warn('Gemini Audio synthesis failed, falling back to Web Speech API:', err.message);
  }

  // Fallback to browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tl-PH';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}
