import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, ArrowRight, HelpCircle, BookOpen, RotateCw, Layers } from 'lucide-react';
import { saveMistake, removeMistake } from '../utils/mistakesManager';

export default function QuizRunner({ quiz, onCompleteQuiz, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];

  const normalize = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+/g, ' ');
  };

  const handleCheckAnswer = () => {
    if (isSubmitted) return;

    let isCorrect = false;
    let answerGiven = '';

    if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') {
      answerGiven = selectedOption;
      isCorrect = selectedOption === currentQuestion.correct_answer;
    } else {
      answerGiven = textInput;
      const normInput = normalize(textInput);
      const accepted = currentQuestion.accepted_answers || [currentQuestion.correct_answer];
      isCorrect = accepted.some((ans) => normalize(ans) === normInput);
    }

    if (isCorrect) {
      removeMistake(currentQuestion.id);
    } else {
      saveMistake(currentQuestion);
    }

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.id]: {
        answerGiven,
        isCorrect
      }
    };

    setUserAnswers(updatedAnswers);
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setTextInput('');
      setIsSubmitted(false);
      setShowExplanation(false);
    } else {
      // Quiz finished! Calculate score
      const finalAnswers = userAnswers;
      const correctCount = Object.values(finalAnswers).filter((a) => a.isCorrect).length;
      const scorePercent = Math.round((correctCount / questions.length) * 100);

      onCompleteQuiz({
        timestamp: Date.now(),
        score: correctCount,
        total: questions.length,
        percent: scorePercent,
        answers: finalAnswers
      });
    }
  };

  if (!currentQuestion) return null;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      {/* Quiz Top Header */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
            {quiz.quiz_metadata.topic}
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{quiz.quiz_metadata.title}</h3>
        </div>

        <button
          onClick={onCancel}
          className="btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem' }}
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
          {currentQuestion.topic || currentQuestion.lesson}
        </span>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{
          width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question Card Container */}
      <div className="glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {currentQuestion.prompt}
        </div>

        {/* Options for Multiple Choice */}
        {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }} role="radiogroup">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let borderStyle = isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)';
              let bgStyle = isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)';

              if (isSubmitted) {
                if (option === currentQuestion.correct_answer) {
                  borderStyle = '1px solid rgba(16, 185, 129, 0.6)';
                  bgStyle = 'rgba(16, 185, 129, 0.15)';
                } else if (isSelected && option !== currentQuestion.correct_answer) {
                  borderStyle = '1px solid rgba(244, 63, 94, 0.6)';
                  bgStyle = 'rgba(244, 63, 94, 0.15)';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOption(option)}
                  disabled={isSubmitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: borderStyle,
                    background: bgStyle,
                    color: 'var(--text-primary)',
                    fontSize: '0.925rem',
                    fontWeight: isSelected ? '600' : '400',
                    textAlign: 'left',
                    cursor: isSubmitted ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{option}</span>
                  {isSubmitted && option === currentQuestion.correct_answer && (
                    <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
                  )}
                  {isSubmitted && isSelected && option !== currentQuestion.correct_answer && (
                    <XCircle size={18} style={{ color: 'var(--accent-rose)' }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Text Input for Fill in Blank */}
        {(currentQuestion.type === 'fill_in_blank' || currentQuestion.type === 'translation') && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor={`quiz-input-${currentQuestion.id}`} className="sr-only">Type answer</label>
            <input
              id={`quiz-input-${currentQuestion.id}`}
              type="text"
              placeholder="Type your Tagalog answer..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isSubmitted && textInput.trim()) handleCheckAnswer(); }}
              disabled={isSubmitted}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(15, 23, 42, 0.7)',
                border: isSubmitted
                  ? userAnswers[currentQuestion.id]?.isCorrect
                    ? '1px solid rgba(16, 185, 129, 0.6)'
                    : '1px solid rgba(244, 63, 94, 0.6)'
                  : '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* Action Controls */}
        {!isSubmitted ? (
          <button
            onClick={handleCheckAnswer}
            className="btn-primary"
            disabled={
              (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false')
                ? !selectedOption
                : !textInput.trim()
            }
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            Submit Answer <ArrowRight size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Feedback Alert */}
            {userAnswers[currentQuestion.id]?.isCorrect ? (
              <div role="alert" aria-live="polite" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={20} />
                <div><strong>Correct!</strong> Great job.</div>
              </div>
            ) : (
              <div role="alert" aria-live="polite" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <XCircle size={20} />
                <div><strong>Incorrect.</strong> See correct answer and note below.</div>
              </div>
            )}

            {/* Explanation Box */}
            <div className="animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.6)', borderLeft: '3px solid var(--accent-cyan)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '0.85rem 1.1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.4rem' }}>
                <BookOpen size={16} /> Grammar Explanation
              </div>
              <div style={{ marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                <strong>Correct Answer:</strong> <code style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{currentQuestion.correct_answer}</code>
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {currentQuestion.explanation}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Results'} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
