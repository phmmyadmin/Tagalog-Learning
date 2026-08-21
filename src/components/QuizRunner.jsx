import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ProgressBar } from './ui/ProgressBar';
import { saveMistake, removeMistake } from '../utils/mistakesManager';

/**
 * QuizRunner Component - Step-by-step quiz runner with immediate answer evaluation and score report.
 */
export default function QuizRunner({ quiz, onCompleteQuiz, onCancel }) {
  const quizTitle = quiz.quiz_metadata?.title || quiz.title || 'Tagalog Quiz';
  const quizId = quiz.quiz_metadata?.id || quiz.id || 'quiz_default';

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
        isCorrect,
      },
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
      // Quiz Finished! Calculate Score
      const totalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      onCompleteQuiz({
        quizId: quizId,
        score: totalCorrect,
        total: questions.length,
        userAnswers,
      });
    }
  };

  if (!currentQuestion) return null;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Navigation & Cancel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge variant="primary">{quizTitle}</Badge>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          ✕ Exit Quiz
        </Button>
      </div>

      <ProgressBar
        value={currentIndex + 1}
        max={questions.length}
        label={`Question ${currentIndex + 1} of ${questions.length}`}
        color="var(--accent-info)"
      />

      {/* Question Card */}
      <Card variant="default" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
          {currentQuestion.prompt || currentQuestion.question}
        </h3>

        {/* Multiple Choice Options */}
        {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(currentQuestion.options || ['True', 'False']).map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentQuestion.correct_answer;
              const isWrongSelection = isSelected && !isCorrectOpt;

              let bgColor = 'var(--bg-surface-alt)';
              let borderColor = 'var(--border-default)';
              let textColor = 'var(--text-primary)';
              let badgeBg = 'var(--bg-surface)';
              let badgeText = 'var(--text-secondary)';
              let statusIcon = null;

              if (isSubmitted) {
                if (isCorrectOpt) {
                  bgColor = 'var(--accent-success-light)';
                  borderColor = 'var(--accent-success)';
                  textColor = 'var(--accent-success)';
                  badgeBg = 'var(--accent-success)';
                  badgeText = 'var(--text-inverse)';
                  statusIcon = '✅';
                } else if (isWrongSelection) {
                  bgColor = 'var(--accent-danger-light)';
                  borderColor = 'var(--accent-danger)';
                  textColor = 'var(--accent-danger)';
                  badgeBg = 'var(--accent-danger)';
                  badgeText = 'var(--text-inverse)';
                  statusIcon = '❌';
                } else {
                  bgColor = 'var(--bg-surface-alt)';
                  borderColor = 'var(--border-default)';
                  textColor = 'var(--text-muted)';
                }
              } else if (isSelected) {
                bgColor = 'var(--accent-primary-light)';
                borderColor = 'var(--accent-primary)';
                textColor = 'var(--accent-primary)';
                badgeBg = 'var(--accent-primary)';
                badgeText = 'var(--text-inverse)';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(opt)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: isSelected || (isSubmitted && isCorrectOpt) ? 700 : 500,
                    cursor: isSubmitted ? 'default' : 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    textAlign: 'left',
                  }}
                  className="quiz-option-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badgeBg,
                        color: badgeText,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {statusIcon && <span style={{ fontSize: '1rem' }}>{statusIcon}</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Text Fill-in-Blank Input */}
        {currentQuestion.type === 'fill_in_blank' && (
          <Input
            placeholder="Type your Tagalog answer..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isSubmitted}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSubmitted) handleCheckAnswer();
            }}
          />
        )}

        {/* Check & Next Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          {!isSubmitted ? (
            <Button
              variant="primary"
              onClick={handleCheckAnswer}
              disabled={
                currentQuestion.type === 'fill_in_blank'
                  ? !textInput.trim()
                  : !selectedOption
              }
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNextQuestion}>
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🏆'}
            </Button>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: userAnswers[currentQuestion.id]?.isCorrect
                ? 'var(--accent-success-light)'
                : 'var(--accent-danger-light)',
              border: `1px solid ${
                userAnswers[currentQuestion.id]?.isCorrect
                  ? 'var(--accent-success)'
                  : 'var(--accent-danger)'
              }`,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}
            className="animate-fade-in"
          >
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              {userAnswers[currentQuestion.id]?.isCorrect
                ? '🎉 Correct!'
                : `❌ Incorrect. Correct Answer: "${currentQuestion.correct_answer}"`}
            </div>
            {currentQuestion.explanation && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
