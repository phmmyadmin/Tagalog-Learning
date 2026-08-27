import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { playTagalogAudio } from '../utils/aiAudioService';
import { evaluateConversationalAnswer } from '../utils/aiConversationalEvaluator';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { previewNextIntervals, RATING } from '../utils/fsrsEngine';

export default function SrsAiConversationCard({
  card,
  cardDirection = 'forward',
  onRate,
  onOpenSettings,
}) {
  const [userText, setUserText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(2.2);
  const [isAutoAdvancePaused, setIsAutoAdvancePaused] = useState(false);

  const timerRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const restartListeningTimeoutRef = useRef(null);
  const recognizerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastUserTextRef = useRef('');
  const lastUserTextTimeRef = useRef(Date.now());

  // Direction: 'reverse' means prompt is English -> student responds in Tagalog
  const isReverse = card?.cardDirection === 'reverse';
  const promptText = isReverse ? card.meaning : card.word;
  const targetAnswer = isReverse ? card.word : card.meaning;
  const promptLabel = isReverse ? 'How do you say this in Tagalog?' : 'What is the meaning of this word?';

  const intervals = previewNextIntervals(card?.srs);

  // Start continuous speech recognition helper
  const startListening = () => {
    if (!isSpeechRecognitionSupported()) return;
    if (isSubmittingRef.current || evaluationResult) return;

    try {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    } catch {}

    const lang = isReverse ? 'fil-PH' : 'en-US';
    const recognizer = createSpeechRecognizer({
      lang,
      silenceTimeoutMs: 450,
      onStart: () => setIsListening(true),
      onEnd: () => {
        setIsListening(false);
        // Persistently restart listening while waiting for student's voice response
        if (!isSubmittingRef.current && !evaluationResult) {
          if (restartListeningTimeoutRef.current) clearTimeout(restartListeningTimeoutRef.current);
          restartListeningTimeoutRef.current = setTimeout(() => {
            if (!isSubmittingRef.current && !evaluationResult) {
              startListening();
            }
          }, 200);
        }
      },
      onResult: ({ transcript }) => {
        setUserText(transcript);
        lastUserTextRef.current = transcript;
        lastUserTextTimeRef.current = Date.now();
      },
      onFinal: (finalText, alternatives) => {
        if (finalText && !isSubmittingRef.current && !evaluationResult) {
          triggerSubmit(finalText, alternatives);
        }
      },
      onSilence: (finalText, alternatives) => {
        if (finalText && !isSubmittingRef.current && !evaluationResult) {
          triggerSubmit(finalText, alternatives);
        }
      },
      onError: (err) => {
        setIsListening(false);
        if (!isSubmittingRef.current && !evaluationResult) {
          if (restartListeningTimeoutRef.current) clearTimeout(restartListeningTimeoutRef.current);
          restartListeningTimeoutRef.current = setTimeout(() => {
            if (!isSubmittingRef.current && !evaluationResult) {
              startListening();
            }
          }, 300);
        }
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserText(val);
    lastUserTextRef.current = val;
    lastUserTextTimeRef.current = Date.now();

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (val.trim().length > 0 && !isSubmittingRef.current && !evaluationResult) {
      // Auto-submit 600ms after user pauses typing (Zero Enter needed)
      typingDebounceRef.current = setTimeout(() => {
        triggerSubmit(val.trim());
      }, 600);
    }
  };

  // Card Mount / Reset Lifecycle
  useEffect(() => {
    setUserText('');
    lastUserTextRef.current = '';
    lastUserTextTimeRef.current = Date.now();
    setEvaluationResult(null);
    setIsEvaluating(false);
    setIsListening(false);
    setIsAutoAdvancePaused(false);
    setAutoAdvanceSeconds(2.2);
    isSubmittingRef.current = false;
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (restartListeningTimeoutRef.current) clearTimeout(restartListeningTimeoutRef.current);

    const start = Date.now();
    setStartTime(start);
    setElapsedSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(parseFloat(((Date.now() - start) / 1000).toFixed(1)));
    }, 100);

    // Auto-start microphone for hands-free voice answering (Do not auto-focus keyboard!)
    const micTimer = setTimeout(() => {
      startListening();
    }, 200);

    return () => {
      clearTimeout(micTimer);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      if (restartListeningTimeoutRef.current) clearTimeout(restartListeningTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {}
      }
    };
  }, [card?.id]);

  // Watchdog: If recognized text hasn't changed for 500ms, auto-submit immediately
  useEffect(() => {
    const watchdogInterval = setInterval(() => {
      if (
        userText &&
        userText.trim().length > 0 &&
        !isSubmittingRef.current &&
        !evaluationResult &&
        !isEvaluating &&
        Date.now() - lastUserTextTimeRef.current > 500
      ) {
        triggerSubmit(userText);
      }
    }, 150);
    return () => clearInterval(watchdogInterval);
  }, [userText, evaluationResult, isEvaluating]);

  const handlePlayPrompt = () => {
    if (!isReverse) {
      playTagalogAudio(card.word);
    }
  };

  const handlePlayAnswer = () => {
    playTagalogAudio(card.word);
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognizerRef.current) {
        try { recognizerRef.current.stop(); } catch {}
      }
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const triggerSubmit = async (textToSubmit, speechAlternatives = []) => {
    const answer = String(textToSubmit || userText || '').trim();
    if (isSubmittingRef.current || isEvaluating || evaluationResult) return;
    isSubmittingRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);
    if (recognizerRef.current) {
      try { recognizerRef.current.stop(); } catch {}
      setIsListening(false);
    }

    const responseTimeMs = Date.now() - startTime;
    setIsEvaluating(true);

    try {
      const result = await evaluateConversationalAnswer({
        card,
        cardDirection: isReverse ? 'reverse' : 'forward',
        userAnswer: answer,
        speechAlternatives,
        responseTimeMs
      });
      setEvaluationResult(result);

      // Play correct audio pronunciation immediately by voice
      if (card.word) {
        playTagalogAudio(card.word);
      }

      // Hands-free auto-advance countdown: 3.5s for incorrect (more reading time), 2.2s for correct
      let countdown = result.isCorrect ? 2.2 : 3.5;
      setAutoAdvanceSeconds(countdown);
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);

      autoAdvanceTimerRef.current = setInterval(() => {
        countdown -= 0.1;
        if (countdown <= 0) {
          clearInterval(autoAdvanceTimerRef.current);
          onRate(result.suggestedRating, responseTimeMs);
        } else {
          setAutoAdvanceSeconds(parseFloat(countdown.toFixed(1)));
        }
      }, 100);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    triggerSubmit(userText);
  };

  const handleManualRate = (ratingNum) => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    const timeMs = Date.now() - startTime;
    onRate(ratingNum, timeMs);
  };

  const togglePauseAutoAdvance = () => {
    if (isAutoAdvancePaused) {
      setIsAutoAdvancePaused(false);
      let remaining = autoAdvanceSeconds;
      autoAdvanceTimerRef.current = setInterval(() => {
        remaining -= 0.1;
        if (remaining <= 0) {
          clearInterval(autoAdvanceTimerRef.current);
          onRate(evaluationResult?.suggestedRating || 3, Date.now() - startTime);
        } else {
          setAutoAdvanceSeconds(parseFloat(remaining.toFixed(1)));
        }
      }, 100);
    } else {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
      setIsAutoAdvancePaused(true);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (evaluationResult) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleManualRate(evaluationResult.suggestedRating);
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          handleManualRate(parseInt(e.key, 10));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evaluationResult]);

  return (
    <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      <Card
        variant="default"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '350px',
          boxShadow: 'var(--shadow-md)',
          border: isReverse ? '2px solid var(--accent-secondary, #D97706)' : '2px solid var(--accent-primary)',
          backgroundColor: evaluationResult ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
          position: 'relative'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="primary">🎙️ AI Tutor</Badge>
            <Badge variant={isReverse ? 'warning' : 'neutral'}>
              {isReverse ? '🔄 English ➔ Tagalog' : '🇵🇭 Tagalog ➔ Meaning'}
            </Badge>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: elapsedSeconds > 8 ? 'var(--accent-danger)' : elapsedSeconds > 3.5 ? 'var(--accent-warning)' : 'var(--accent-success)',
                backgroundColor: 'var(--bg-surface)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)'
              }}
            >
              ⏱️ {elapsedSeconds.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Prompt Section (When not yet evaluated) */}
        {!evaluationResult ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {promptLabel}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
              <h2 style={{ fontSize: '2.3rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
                {promptText}
              </h2>
              {!isReverse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPrompt}
                  style={{ fontSize: '1.3rem', padding: '0.3rem' }}
                  title="Listen to pronunciation"
                >
                  🔊
                </Button>
              )}
            </div>
            {card.partOfSpeech && (
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                ({card.partOfSpeech})
              </p>
            )}
          </div>
        ) : null}

        {/* Interactive Answer Input or Prominent Evaluation Feedback */}
        {!evaluationResult ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={userText}
                onChange={handleInputChange}
                placeholder={isListening ? '🎙️ Listening... speak your answer now' : 'Type or speak your answer...'}
                disabled={isEvaluating}
                style={{
                  width: '100%',
                  padding: '0.85rem 3.5rem 0.85rem 1.15rem',
                  fontSize: '1.05rem',
                  borderRadius: 'var(--radius-md)',
                  border: isListening ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  backgroundColor: isListening ? 'rgba(234, 88, 12, 0.05)' : 'var(--bg-surface-alt)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxShadow: isListening ? '0 0 0 4px rgba(234, 88, 12, 0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />

              <button
                type="button"
                onClick={toggleMic}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  background: isListening ? 'var(--accent-primary)' : 'none',
                  color: isListening ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none'
                }}
                title={isListening ? 'Listening automatically...' : 'Start microphone'}
              >
                {isListening ? '🎙️' : '🎤'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isListening ? '⚡ Auto-submits instantly when you speak' : '⚡ Auto-submits on pause (No Enter needed)'}
              </span>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isEvaluating}
                style={{ fontWeight: 700, padding: '0.4rem 0.85rem' }}
              >
                {isEvaluating ? 'Evaluating...' : 'Submit ➔'}
              </Button>
            </div>
          </form>
        ) : (
          /* Prominent, Large Visual Feedback Section */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }} className="animate-fade-in">
            {/* Main Result Card */}
            <div
              style={{
                textAlign: 'center',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: evaluationResult.isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `2px solid ${evaluationResult.isCorrect ? 'var(--accent-success, #16A34A)' : 'var(--accent-danger, #DC2626)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: evaluationResult.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {evaluationResult.isCorrect ? '✅ Correct!' : '❌ Incorrect — Correct Answer:'}
                </span>
                <Badge variant={evaluationResult.suggestedRating >= 3 ? 'success' : 'warning'}>
                  {evaluationResult.ratingLabel} ({evaluationResult.responseTimeSeconds}s)
                </Badge>
              </div>

              {/* Large Central Tagalog Word Display */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '0.2rem 0' }}>
                <h1
                  style={{
                    fontSize: evaluationResult.isCorrect ? '2.2rem' : '2.6rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: 1.1
                  }}
                >
                  {card.word}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAnswer}
                  style={{ fontSize: '1.4rem', padding: '0.35rem' }}
                  title="Listen to pronunciation (auto-played)"
                >
                  🔊
                </Button>
              </div>

              {/* Meaning & Details */}
              <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {card.meaning}
              </div>

              {/* Feedback Sentence */}
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {evaluationResult.feedbackEnglish || evaluationResult.feedbackSpanish}
              </p>

              {card.example && (
                <div style={{ marginTop: '0.35rem', padding: '0.35rem 0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{typeof card.example === 'string' ? card.example : card.example.tagalog}"
                  </span>
                </div>
              )}
            </div>

            {/* Hands-Free Auto-Advance Status Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(234, 88, 12, 0.08)',
                border: '1px solid rgba(234, 88, 12, 0.2)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}
            >
              <span>
                {isAutoAdvancePaused ? '⏸️ Auto-advance paused' : `⚡ Next card in ${autoAdvanceSeconds}s...`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePauseAutoAdvance}
                style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem', fontWeight: 600 }}
              >
                {isAutoAdvancePaused ? 'Resume ➔' : 'Pause ⏸️'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Identical FSRS Rating Buttons as SrsFlashcard.jsx (Always active on feedback) */}
      {evaluationResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
          {/* AGAIN */}
          <button
            type="button"
            onClick={() => handleManualRate(1)}
            className="srs-rate-btn srs-rate-again"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-danger-light)',
              color: 'var(--accent-danger)',
              border: evaluationResult.suggestedRating === 1 ? '2.5px solid var(--accent-danger)' : '1.5px solid rgba(220, 38, 38, 0.3)',
              boxShadow: evaluationResult.suggestedRating === 1 ? '0 0 0 3px rgba(220, 38, 38, 0.25)' : 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: evaluationResult.suggestedRating === 1 ? 800 : 600 }}>
              1. Again {evaluationResult.suggestedRating === 1 ? '⭐' : ''}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.AGAIN]}
            </span>
          </button>

          {/* HARD */}
          <button
            type="button"
            onClick={() => handleManualRate(2)}
            className="srs-rate-btn srs-rate-hard"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-warning-light)',
              color: 'var(--accent-warning)',
              border: evaluationResult.suggestedRating === 2 ? '2.5px solid var(--accent-warning)' : '1.5px solid rgba(217, 119, 6, 0.3)',
              boxShadow: evaluationResult.suggestedRating === 2 ? '0 0 0 3px rgba(217, 119, 6, 0.25)' : 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: evaluationResult.suggestedRating === 2 ? 800 : 600 }}>
              2. Hard {evaluationResult.suggestedRating === 2 ? '⭐' : ''}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.HARD]}
            </span>
          </button>

          {/* GOOD */}
          <button
            type="button"
            onClick={() => handleManualRate(3)}
            className="srs-rate-btn srs-rate-good"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              border: evaluationResult.suggestedRating === 3 ? '2.5px solid var(--accent-primary)' : '1.5px solid rgba(37, 99, 235, 0.3)',
              boxShadow: evaluationResult.suggestedRating === 3 ? '0 0 0 3px rgba(37, 99, 235, 0.25)' : 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: evaluationResult.suggestedRating === 3 ? 800 : 600 }}>
              3. Good {evaluationResult.suggestedRating === 3 ? '⭐' : ''}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.GOOD]}
            </span>
          </button>

          {/* EASY */}
          <button
            type="button"
            onClick={() => handleManualRate(4)}
            className="srs-rate-btn srs-rate-easy"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.65rem 0.4rem',
              backgroundColor: 'var(--accent-success-light)',
              color: 'var(--accent-success)',
              border: evaluationResult.suggestedRating === 4 ? '2.5px solid var(--accent-success)' : '1.5px solid rgba(22, 163, 74, 0.3)',
              boxShadow: evaluationResult.suggestedRating === 4 ? '0 0 0 3px rgba(22, 163, 74, 0.25)' : 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: evaluationResult.suggestedRating === 4 ? 800 : 600 }}>
              4. Easy {evaluationResult.suggestedRating === 4 ? '⭐' : ''}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {intervals[RATING.EASY]}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
