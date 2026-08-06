import React, { useState, useEffect } from 'react';
import QuizRunner from '../components/QuizRunner';
import { availableQuizzes } from '../data/quizzes';
import { getMistakes, clearAllMistakes } from '../utils/mistakesManager';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function QuizzesView() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [mistakes, setMistakes] = useState(getMistakes());

  useEffect(() => {
    const handleMistakesUpdate = () => {
      setMistakes(getMistakes());
    };
    window.addEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
    return () => window.removeEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
  }, []);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_quiz_history_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleCompleteQuiz = ({ quizId, score, total }) => {
    const record = {
      timestamp: new Date().toISOString(),
      score,
      total,
      percent: Math.round((score / total) * 100),
    };

    setHistory((prev) => {
      const existing = prev[quizId] || [];
      const updated = { ...prev, [quizId]: [record, ...existing] };
      try {
        localStorage.setItem('tagalog_quiz_history_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save quiz history', e);
      }
      return updated;
    });

    setActiveQuiz(null);
  };

  const handleStartMistakesQuiz = () => {
    if (mistakes.length === 0) return;
    setActiveQuiz({
      id: 'mistakes_review',
      title: 'Mistakes Bank Review',
      description: 'Review questions you missed in past activities and quizzes.',
      questions: mistakes,
    });
  };

  if (activeQuiz) {
    return (
      <QuizRunner
        quiz={activeQuiz}
        onCompleteQuiz={handleCompleteQuiz}
        onCancel={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
          🏆 Quizzes & Exam Preparation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Evaluate your comprehensive Tagalog proficiency and review mistake history.
        </p>
      </div>

      {/* Mistakes Bank Banner */}
      {mistakes.length > 0 && (
        <Card variant="alt" style={{ border: '1px solid var(--accent-danger)', backgroundColor: 'var(--accent-danger-light)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span> Mistakes Bank ({mistakes.length} items to review)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                You have {mistakes.length} missed questions waiting for review. Practice until you reach 100%!
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="danger" onClick={handleStartMistakesQuiz}>
                Start Mistakes Review
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllMistakes}>
                Clear Bank
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quiz Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {availableQuizzes.map((quiz) => {
          const quizHistory = history[quiz.id] || [];
          const lastAttempt = quizHistory[0];

          return (
            <Card key={quiz.id} variant="interactive" onClick={() => setActiveQuiz(quiz)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <Badge variant="primary">{quiz.category || 'Quiz'}</Badge>
                  {lastAttempt && (
                    <Badge variant={lastAttempt.percent >= 80 ? 'success' : 'warning'}>
                      Best: {lastAttempt.percent}%
                    </Badge>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                  {quiz.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {quiz.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {quiz.questions?.length || 0} Questions
                </span>
                <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); setActiveQuiz(quiz); }}>
                  Start Quiz →
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
