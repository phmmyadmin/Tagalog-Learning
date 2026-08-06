import React, { useState, useRef } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { saveMistake, removeMistake } from '../utils/mistakesManager';
import slideMap from '../data/slideMap.json';

/**
 * ActivityCard Component - Accessible practice card with immediate validation, solution toggle, and mistake tracking.
 */
export default function ActivityCard({ activity, savedResult, onSaveResult, onOpenLesson }) {
  const [userInput, setUserInput] = useState(savedResult ? savedResult.userInput : '');
  const [status, setStatus] = useState(savedResult ? (savedResult.isCorrect ? 'correct' : 'incorrect') : 'idle');
  const [showSolution, setShowSolution] = useState(false);
  const inputRef = useRef(null);

  const actSlide = activity
    ? slideMap.activities?._keyword_overrides?.[activity.id]?.slide ||
      slideMap.activities?._default_slides?.[activity.lesson] ||
      1
    : 1;

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && activity.lesson) {
        onOpenLesson(activity.lesson, actSlide, actSlide, activity.id);
      }
    }
  };

  const normalize = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+/g, ' ');
  };

  const handleCheckAnswer = () => {
    if (!userInput.trim()) return;

    const normalizedInput = normalize(userInput);
    const isCorrect = activity.acceptedAnswers.some((ans) => normalize(ans) === normalizedInput);

    if (isCorrect) {
      setStatus('correct');
      setShowSolution(true);
      if (onSaveResult) onSaveResult(activity.id, { userInput, isCorrect: true });
      removeMistake(activity.id);
    } else {
      setStatus('incorrect');
      if (onSaveResult) onSaveResult(activity.id, { userInput, isCorrect: false });
      saveMistake({
        id: activity.id,
        type: activity.type || 'fill_in_blank',
        topic: activity.lesson ? activity.lesson.replace('_', ' ') : 'Grammar Exercise',
        lesson: activity.lesson,
        prompt: activity.prompt,
        correct_answer: activity.correctAnswer,
        accepted_answers: activity.acceptedAnswers,
        explanation: activity.explanation,
      });
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setShowSolution(false);
    if (onSaveResult) onSaveResult(activity.id, null);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleReset = () => {
    setUserInput('');
    setStatus('idle');
    setShowSolution(false);
    if (onSaveResult) onSaveResult(activity.id, null);
  };

  return (
    <Card
      variant="default"
      style={{
        marginBottom: '1.25rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: `2px solid ${
          status === 'correct'
            ? 'var(--accent-success)'
            : status === 'incorrect'
            ? 'var(--accent-danger)'
            : 'var(--border-default)'
        }`,
        backgroundColor:
          status === 'correct'
            ? 'var(--accent-success-light)'
            : status === 'incorrect'
            ? 'var(--accent-danger-light)'
            : 'var(--bg-surface)',
      }}
      className="animate-fade-in"
    >
      {/* Header Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="primary">{activity.id}</Badge>
          {activity.lesson && (
            <Badge variant="default">{activity.lesson.replace('_', ' ')}</Badge>
          )}
        </div>

        {activity.lesson && (
          <a
            href={`#slides-${activity.lesson}-slide-${actSlide}`}
            onClick={handleLessonLinkClick}
            style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            🖼️ Lesson Slides (p. {actSlide})
          </a>
        )}
      </div>

      {/* Prompt */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
          {activity.prompt}
        </h3>
        {activity.englishHint && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            <em>Hint: {activity.englishHint}</em>
          </p>
        )}
      </div>

      {/* Input & Check Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            ref={inputRef}
            placeholder="Type your Tagalog response..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={status === 'correct'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && status === 'idle') handleCheckAnswer();
            }}
          />
        </div>

        {status === 'idle' ? (
          <Button variant="primary" onClick={handleCheckAnswer} disabled={!userInput.trim()}>
            Check Answer
          </Button>
        ) : status === 'incorrect' ? (
          <Button
            variant="secondary"
            onClick={handleRetry}
            icon={<RotateCcw size={16} aria-hidden="true" />}
          >
            Retry / Edit
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleReset}
            icon={<RotateCcw size={16} aria-hidden="true" />}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Live ARIA Feedback Region */}
      <div aria-live="polite">
        {status === 'correct' && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--accent-success-light)',
              color: 'var(--accent-success)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-success)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>✅</span> Correct! Ang galing! (Great job!)
          </div>
        )}

        {status === 'incorrect' && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--accent-danger-light)',
              color: 'var(--accent-danger)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-danger)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>❌</span> Incorrect. Added to your Mistakes Bank for review.
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
              aria-expanded={showSolution}
              style={{
                alignSelf: 'flex-start',
                padding: '0.3rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
              }}
            >
              {showSolution ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              <span>{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Solution & Explanation */}
      {showSolution && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            fontSize: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          <div>
            <strong>Correct Answer:</strong>{' '}
            <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>
              {activity.correctAnswer || (activity.acceptedAnswers && activity.acceptedAnswers[0])}
            </span>
          </div>
          {activity.explanation && (
            <div style={{ color: 'var(--text-secondary)' }}>
              <strong>Explanation:</strong> {activity.explanation}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
