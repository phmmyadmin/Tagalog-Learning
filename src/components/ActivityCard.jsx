import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, HelpCircle, Sparkles, BookOpen, ArrowRight, Presentation } from 'lucide-react';
import { saveMistake, removeMistake } from '../utils/mistakesManager';
import slideMap from '../data/slideMap.json';

export default function ActivityCard({ activity, savedResult, onSaveResult, onOpenLesson }) {
  const [userInput, setUserInput] = useState(savedResult ? savedResult.userInput : '');
  const [status, setStatus] = useState(savedResult ? (savedResult.isCorrect ? 'correct' : 'incorrect') : 'idle'); // 'idle' | 'correct' | 'incorrect'
  const [showSolution, setShowSolution] = useState(false);

  const actSlide = activity
    ? (slideMap.activities?._keyword_overrides?.[activity.id]?.slide ||
       slideMap.activities?._default_slides?.[activity.lesson] || 1)
    : 1;

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && activity.lesson) {
        onOpenLesson(activity.lesson, actSlide, actSlide, activity.id);
      }
    }
  };

  // Normalize answers for flexible checking
  const normalize = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // strip punctuation
      .replace(/\s+/g, ' '); // normalize spaces
  };

  const handleCheckAnswer = () => {
    if (!userInput.trim()) return;

    const normalizedInput = normalize(userInput);
    const isCorrect = activity.acceptedAnswers.some((ans) => normalize(ans) === normalizedInput);

    if (isCorrect) {
      setStatus('correct');
      setShowSolution(true);
      onSaveResult(activity.id, { userInput, isCorrect: true });
      removeMistake(activity.id);
    } else {
      setStatus('incorrect');
      onSaveResult(activity.id, { userInput, isCorrect: false });
      saveMistake({
        id: activity.id,
        type: activity.type || 'fill_in_blank',
        topic: activity.lesson ? activity.lesson.replace('_', ' ') : 'Grammar Exercise',
        lesson: activity.lesson,
        prompt: activity.prompt,
        correct_answer: activity.correctAnswer,
        accepted_answers: activity.acceptedAnswers,
        explanation: activity.explanation
      });
    }
  };

  // Reset / Retake handler
  const handleReset = () => {
    setUserInput('');
    setStatus('idle');
    setShowSolution(false);
    onSaveResult(activity.id, null); // Clear saved result
  };

  const getBorderColor = () => {
    if (status === 'correct') return 'rgba(16, 185, 129, 0.4)';
    if (status === 'incorrect') return 'rgba(244, 63, 94, 0.4)';
    return 'var(--border-color)';
  };

  const getGlowShadow = () => {
    if (status === 'correct') return '0 0 20px rgba(16, 185, 129, 0.15)';
    if (status === 'incorrect') return '0 0 20px rgba(244, 63, 94, 0.15)';
    return 'var(--shadow-subtle)';
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: '1.5rem',
      marginBottom: '1.25rem',
      border: `1px solid ${getBorderColor()}`,
      boxShadow: getGlowShadow(),
      transition: 'all 0.25s ease'
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{activity.id}</span>
          {activity.lesson && (
            <a
              href={`#slides?lesson=${activity.lesson}&slide=${actSlide}`}
              onClick={handleLessonLinkClick}
              className="badge badge-indigo"
              style={{
                fontSize: '0.7rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer'
              }}
              title={`Open ${activity.lesson.replace('_', ' ')} Slide ${actSlide}`}
            >
              <Presentation size={11} aria-hidden="true" />
              {activity.lesson.replace('_', ' ')} (p. {actSlide})
            </a>
          )}
          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
            {activity.type === 'fill_in_blank' ? 'Fill-in-the-blank' : 'Sentence Translation'}
          </span>
        </div>

        {status === 'correct' && (
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            Completed ✓
          </span>
        )}
      </div>

      {/* Prompt */}
      <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        {activity.prompt}
      </div>

      {/* Interactive Input Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor={`activity-input-${activity.id}`} className="sr-only">
            Your Tagalog Answer for exercise {activity.id}
          </label>
          <input
            id={`activity-input-${activity.id}`}
            type="text"
            placeholder="Type your Tagalog answer here..."
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (status !== 'idle') setStatus('idle'); // Reset status on typing
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheckAnswer();
            }}
            disabled={status === 'correct'}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: status === 'correct'
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : status === 'incorrect'
                ? '1px solid rgba(244, 63, 94, 0.5)'
                : '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />

          {status !== 'correct' ? (
            <button
              onClick={handleCheckAnswer}
              className="btn-primary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              disabled={!userInput.trim()}
            >
              Check Answer <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              title="Reset and retake this exercise"
            >
              <RefreshCw size={16} aria-hidden="true" /> Retake Exercise
            </button>
          )}
        </div>

        {/* Feedback Alert Box */}
        {status === 'correct' && (
          <div 
            role="alert" 
            aria-live="polite"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong>Correct!</strong> Your answer matches the grammar rules for this lesson.
            </div>
          </div>
        )}

        {status === 'incorrect' && (
          <div 
            role="alert" 
            aria-live="polite"
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              color: '#f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.6rem',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <XCircle size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
              <div>
                <strong>Not quite right.</strong> Double check spelling or try again!
              </div>
            </div>

            <button
              onClick={() => setShowSolution(!showSolution)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              {showSolution ? 'Hide Solution' : 'Reveal Solution'}
            </button>
          </div>
        )}
      </div>

      {/* Grammar Explanation & Solution Box */}
      {(showSolution || status === 'correct') && (
        <div className="animate-fade-in" style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderLeft: '3px solid var(--accent-cyan)',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          padding: '0.85rem 1.1rem',
          marginTop: '0.75rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.4rem' }}>
            <BookOpen size={16} aria-hidden="true" /> Expected Answer & Grammar Notes
          </div>
          
          <div style={{ marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            <strong>Correct Answer:</strong> <code style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{activity.correctAnswer}</code>
          </div>

          {activity.explanation && (
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Grammar Note:</strong> {activity.explanation}
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls for Retaking / Solution Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: '0.75rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
        <span>Exercise ID: {activity.id}</span>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowSolution(!showSolution)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <HelpCircle size={14} aria-hidden="true" /> {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>

          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RefreshCw size={14} aria-hidden="true" /> Retake Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
