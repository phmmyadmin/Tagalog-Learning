import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { playTagalogAudio } from '../utils/aiAudioService';
import { evaluateConversationalAnswer } from '../utils/aiConversationalEvaluator';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';

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

  const timerRef = useRef(null);
  const recognizerRef = useRef(null);
  const inputRef = useRef(null);

  // Direction: 'reverse' means prompt is English -> student responds in Tagalog
  const isReverse = card?.cardDirection === 'reverse';
  const promptText = isReverse ? card.meaning : card.word;
  const targetAnswer = isReverse ? card.word : card.meaning;
  const promptLabel = isReverse ? 'How do you say this in Tagalog?' : 'What is the meaning of this word?';

  // Initialize card timer & auto-play prompt audio if in forward mode
  useEffect(() => {
    setUserText('');
    setEvaluationResult(null);
    setIsEvaluating(false);
    setIsListening(false);
    const start = Date.now();
    setStartTime(start);
    setElapsedSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(parseFloat(((Date.now() - start) / 1000).toFixed(1)));
    }, 100);

    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {}
      }
    };
  }, [card?.id]);

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
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const lang = isReverse ? 'tl-PH' : 'en-US';
    const recognizer = createSpeechRecognizer({
      lang,
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: ({ transcript, final }) => {
        setUserText(transcript);
        if (final) {
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        console.warn('Could not start recognizer:', e);
        setIsListening(false);
      }
    } else {
      alert('Your browser does not support native speech recognition. Please type your answer in the text field.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isEvaluating || evaluationResult) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (isListening && recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const responseTimeMs = Date.now() - startTime;
    setIsEvaluating(true);

    try {
      const result = await evaluateConversationalAnswer({
        card,
        cardDirection: isReverse ? 'reverse' : 'forward',
        userAnswer: userText.trim(),
        responseTimeMs
      });
      setEvaluationResult(result);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (evaluationResult) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onRate(evaluationResult.suggestedRating);
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          onRate(parseInt(e.key, 10));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evaluationResult, onRate]);

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }} className="animate-fade-in">
      <Card
        variant="default"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minHeight: '400px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-default)',
          position: 'relative'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="primary">🎙️ AI Tutor</Badge>
            <Badge variant="neutral">{isReverse ? '🔄 English ➔ Tagalog' : '🇵🇭 Tagalog ➔ Meaning'}</Badge>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: elapsedSeconds > 8 ? 'var(--accent-danger)' : elapsedSeconds > 3.5 ? 'var(--accent-warning)' : 'var(--accent-success)',
                backgroundColor: 'var(--bg-surface-alt)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)'
              }}
            >
              ⏱️ {elapsedSeconds.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Prompt Section */}
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {promptLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
              {promptText}
            </h2>
            {!isReverse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPrompt}
                style={{ fontSize: '1.25rem', padding: '0.4rem' }}
                title="Listen to pronunciation with Gemini Neural Audio"
              >
                🔊
              </Button>
            )}
          </div>
          {card.partOfSpeech && (
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              ({card.partOfSpeech})
            </p>
          )}
        </div>

        {/* Interactive Answer Input or Evaluation Result */}
        {!evaluationResult ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Type or speak your answer here...'}
                disabled={isEvaluating}
                style={{
                  width: '100%',
                  padding: '1rem 3.5rem 1rem 1.25rem',
                  fontSize: '1.1rem',
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
                  right: '0.75rem',
                  background: isListening ? 'var(--accent-primary)' : 'none',
                  color: isListening ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={isListening ? 'Stop microphone' : 'Speak using microphone'}
              >
                {isListening ? '🛑' : '🎙️'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isEvaluating}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {isEvaluating ? '🤖 Evaluating answer with AI...' : 'Submit Answer 🚀 (Enter)'}
              </Button>
            </div>
          </form>
        ) : (
          /* Evaluation & Feedback Section */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: evaluationResult.isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${evaluationResult.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.05rem', color: evaluationResult.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {evaluationResult.isCorrect ? '✅ ' + evaluationResult.feedbackTagalog : '❌ ' + evaluationResult.feedbackTagalog}
                </strong>
                <Badge variant={evaluationResult.suggestedRating >= 3 ? 'success' : 'warning'}>
                  {evaluationResult.ratingLabel} ({evaluationResult.responseTimeSeconds}s)
                </Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {evaluationResult.feedbackEnglish || evaluationResult.feedbackSpanish}
              </p>
            </div>

            {/* Target Explanation Card */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Correct Answer:
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {card.word} <span style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text-secondary)' }}>— {card.meaning}</span>
                </div>
                {card.example && (
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{typeof card.example === 'string' ? card.example : card.example.tagalog}"
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAnswer}
                style={{ padding: '0.4rem 0.75rem', fontSize: '1.1rem' }}
                title="Listen to correct pronunciation"
              >
                🔊
              </Button>
            </div>

            {/* Rating Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => onRate(evaluationResult.suggestedRating)}
                style={{ padding: '0.9rem', fontWeight: 700, fontSize: '1.05rem' }}
              >
                Continue with {evaluationResult.ratingLabel} ➔ (Space)
              </Button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <Button
                  variant={evaluationResult.suggestedRating === 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onRate(1)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    fontSize: '0.8rem',
                    borderColor: 'var(--accent-danger)',
                    color: evaluationResult.suggestedRating === 1 ? '#ffffff' : 'var(--accent-danger)'
                  }}
                >
                  1. Again
                </Button>
                <Button
                  variant={evaluationResult.suggestedRating === 2 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onRate(2)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    fontSize: '0.8rem',
                    borderColor: 'var(--accent-warning)',
                    color: evaluationResult.suggestedRating === 2 ? '#ffffff' : 'var(--accent-warning)'
                  }}
                >
                  2. Hard
                </Button>
                <Button
                  variant={evaluationResult.suggestedRating === 3 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onRate(3)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    fontSize: '0.8rem',
                    borderColor: 'var(--accent-primary)',
                    color: evaluationResult.suggestedRating === 3 ? '#ffffff' : 'var(--accent-primary)'
                  }}
                >
                  3. Good
                </Button>
                <Button
                  variant={evaluationResult.suggestedRating === 4 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onRate(4)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    fontSize: '0.8rem',
                    borderColor: 'var(--accent-success)',
                    color: evaluationResult.suggestedRating === 4 ? '#ffffff' : 'var(--accent-success)'
                  }}
                >
                  4. Easy ⭐
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
