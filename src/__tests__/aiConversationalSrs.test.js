import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pcm16ToWav, getCachedAudio, saveCachedAudio, synthesizeGeminiAudio } from '../utils/aiAudioService';
import { evaluateConversationalAnswer, evaluateAnswerLocally } from '../utils/aiConversationalEvaluator';
import { isSpeechRecognitionSupported } from '../utils/speechRecognition';

describe('AI Conversational Flashcards & Neural Audio Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Neural Audio & PCM-to-WAV Processing', () => {
    it('converts raw 16-bit PCM bytes into a valid 44-byte RIFF WAV audio buffer', () => {
      // 100 samples of 16-bit PCM (200 bytes)
      const rawPcm = new Uint8Array(200);
      for (let i = 0; i < 200; i++) rawPcm[i] = i % 256;

      const wavBuffer = pcm16ToWav(rawPcm.buffer, 24000, 1);

      expect(wavBuffer.byteLength).toBe(244); // 44 header bytes + 200 data bytes

      const view = new DataView(wavBuffer);
      // Check RIFF header
      const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      expect(riff).toBe('RIFF');

      // Check WAVE identifier
      const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
      expect(wave).toBe('WAVE');

      // Check SampleRate (24000)
      expect(view.getUint32(24, true)).toBe(24000);
    });

    it('caches synthesized audio for instantaneous offline replay', async () => {
      await saveCachedAudio('salamat', 'UklGRiQAAABXQVZFZmt0', 'audio/wav');

      const cached = await getCachedAudio('salamat');
      expect(cached).toBeDefined();
      expect(cached.base64Audio).toBe('UklGRiQAAABXQVZFZmt0');
    });

    it('synthesizes audio from Gemini API audio modality when API key is provided', async () => {
      const mockApiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    mimeType: 'audio/wav',
                    data: 'UklGRiQAAABXQVZFZmt0'
                  }
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

      const audioUri = await synthesizeGeminiAudio('Magandang umaga', { apiKey: 'test-key-123' });
      expect(audioUri).toContain('data:audio/wav;base64,');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conversational Accuracy & Response Time Latency Scoring', () => {
    const card = {
      id: 'VOCAB-L02-001',
      word: 'Bahay',
      meaning: 'House',
      partOfSpeech: 'noun',
      lesson: 'Lesson_02'
    };

    it('rates response as Easy (4) for exact answer with sub-3.5s latency', () => {
      const result = evaluateAnswerLocally({
        card,
        cardDirection: 'forward',
        userAnswer: 'House',
        responseTimeMs: 2100
      });

      expect(result.isCorrect).toBe(true);
      expect(result.suggestedRating).toBe(4);
      expect(result.ratingLabel).toBe('Fácil ⭐');
      expect(result.responseTimeSeconds).toBe(2.1);
    });

    it('rates response as Good (3) for correct answer with normal 3.5s - 8.0s latency', () => {
      const result = evaluateAnswerLocally({
        card,
        cardDirection: 'forward',
        userAnswer: 'house',
        responseTimeMs: 5200
      });

      expect(result.isCorrect).toBe(true);
      expect(result.suggestedRating).toBe(3);
      expect(result.ratingLabel).toBe('Bien');
      expect(result.responseTimeSeconds).toBe(5.2);
    });

    it('rates response as Hard (2) for correct answer with slow >8.0s recall latency', () => {
      const result = evaluateAnswerLocally({
        card,
        cardDirection: 'forward',
        userAnswer: 'house',
        responseTimeMs: 11400
      });

      expect(result.isCorrect).toBe(true);
      expect(result.suggestedRating).toBe(2);
      expect(result.ratingLabel).toBe('Difícil');
      expect(result.responseTimeSeconds).toBe(11.4);
    });

    it('rates response as Again (1) for completely incorrect answers', () => {
      const result = evaluateAnswerLocally({
        card,
        cardDirection: 'forward',
        userAnswer: 'car',
        responseTimeMs: 2000
      });

      expect(result.isCorrect).toBe(false);
      expect(result.suggestedRating).toBe(1);
      expect(result.ratingLabel).toBe('De nuevo');
    });

    it('evaluates reverse cards (English -> Tagalog response)', () => {
      const result = evaluateAnswerLocally({
        card,
        cardDirection: 'reverse',
        userAnswer: 'Bahay',
        responseTimeMs: 1800
      });

      expect(result.isCorrect).toBe(true);
      expect(result.suggestedRating).toBe(4);
    });

    it('evaluates answers via Gemini 2.5 Flash API with detailed pedagogical feedback', async () => {
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    isCorrect: true,
                    suggestedRating: 4,
                    ratingLabel: 'Fácil ⭐',
                    feedbackTagalog: 'Napakagaling! Napakabilis ng sagot.',
                    feedbackSpanish: '¡Excelente! Respuesta exacta en 2.4s.',
                    explanation: 'Bahay is the general Tagalog term for house or home.'
                  })
                }
              ]
            }
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGeminiResponse
      });

      const result = await evaluateConversationalAnswer({
        card,
        cardDirection: 'forward',
        userAnswer: 'House',
        responseTimeMs: 2400,
        configOverrides: { apiKey: 'test-api-key' }
      });

      expect(result.isCorrect).toBe(true);
      expect(result.suggestedRating).toBe(4);
      expect(result.feedbackTagalog).toContain('Napakagaling');
      expect(result.explanation).toContain('Bahay');
    });
  });

  describe('Speech Recognition Detection', () => {
    it('detects browser SpeechRecognition support environment safely', () => {
      const isSupported = isSpeechRecognitionSupported();
      expect(typeof isSupported).toBe('boolean');
    });
  });
});
