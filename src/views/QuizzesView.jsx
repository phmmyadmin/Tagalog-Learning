import React, { useState, useEffect } from 'react';
import QuizRunner from '../components/QuizRunner';
import { availableQuizzes } from '../data/quizzes';
import { getMistakes, clearAllMistakes } from '../utils/mistakesManager';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { pushProgressToCloud } from '../utils/cloudSyncManager';

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
      pushProgressToCloud().catch(() => {});
      return updated;
    });

    setActiveQuiz(null);
  };

  const handleStartMistakesQuiz = () => {
    if (mistakes.length === 0) return;
    setActiveQuiz({
      quiz_metadata: {
        id: 'mistakes_review',
        title: 'Mistakes Bank Review',
        topic: 'Mistakes Review',
      },
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

  // Flatten all history attempts into a chronological list
  const allHistoryAttempts = [];
  Object.keys(history).forEach((quizId) => {
    const attempts = history[quizId] || [];
    const matchedQuiz = availableQuizzes.find((q) => (q.quiz_metadata?.id || q.id) === quizId);
    const quizTitle = matchedQuiz?.quiz_metadata?.title || matchedQuiz?.title || quizId;

    attempts.forEach((att) => {
      allHistoryAttempts.push({
        ...att,
        quizId,
        quizTitle,
      });
    });
  });

  allHistoryAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
          const meta = quiz.quiz_metadata || {};
          const quizId = meta.id || quiz.id;
          const quizTitle = meta.title || quiz.title || 'Tagalog Quiz';
          const quizTopic = meta.topic || quiz.category || 'General';
          const numQuestions = quiz.questions?.length || meta.total_questions || 0;

          const quizHistory = history[quizId] || [];
          const lastAttempt = quizHistory[0];

          return (
            <Card
              key={quizId}
              variant="interactive"
              onClick={() => setActiveQuiz(quiz)}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <Badge variant="primary">{quizTopic}</Badge>
                  {lastAttempt && (
                    <Badge variant={lastAttempt.percent >= 80 ? 'success' : 'amber'}>
                      Best: {lastAttempt.percent}%
                    </Badge>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                  {quizTitle}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Comprehensive exam covering {quizTopic.toLowerCase()} syntax and vocabulary.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {numQuestions} Questions
                </span>
                <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); setActiveQuiz(quiz); }}>
                  Start Quiz →
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quiz Attempt History Section */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📜</span> Attempt History
        </h2>

        {allHistoryAttempts.length > 0 ? (
          <Card style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Date & Time</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quiz Title</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Score</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {allHistoryAttempts.map((att, idx) => {
                    const dateFormatted = new Date(att.timestamp).toLocaleString();
                    const isPassed = att.percent >= 70;

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{dateFormatted}</td>
                        <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{att.quizTitle}</td>
                        <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-primary)' }}>{att.score} / {att.total}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <Badge variant={isPassed ? 'success' : 'amber'}>
                            {att.percent}% {isPassed ? 'Passed' : 'Needs Practice'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card variant="alt" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ margin: 0 }}>No quiz attempts recorded yet. Select a quiz above to start testing!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
