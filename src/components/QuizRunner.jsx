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
              let btnVariant = 'secondary';
              if (isSubmitted) {
                if (opt === currentQuestion.correct_answer) btnVariant = 'success';
                else if (isSelected && !userAnswers[currentQuestion.id]?.isCorrect) btnVariant = 'danger';
              } else if (isSelected) {
                btnVariant = 'primary';
              }

              return (
                <Button
                  key={idx}
                  variant={btnVariant}
                  fullWidth
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(opt)}
                  style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '0.75rem 1rem' }}
                >
                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </Button>
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
              backgroundColor: 'var(--bg-surface-alt)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `4px solid ${
                userAnswers[currentQuestion.id]?.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'
              }`,
              fontSize: '0.9rem',
              marginTop: '0.5rem',
            }}
          >
            <div>
              <strong>Correct Answer:</strong>{' '}
              <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>
                {currentQuestion.correct_answer}
              </span>
            </div>
            {currentQuestion.explanation && (
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
