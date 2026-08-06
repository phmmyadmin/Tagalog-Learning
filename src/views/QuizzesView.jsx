import React, { useState, useEffect } from 'react';
import QuizRunner from '../components/QuizRunner';
import { availableQuizzes } from '../data/quizzes';
import { getMistakes, clearAllMistakes } from '../utils/mistakesManager';
import { 
  Trophy, 
  HelpCircle, 
  RotateCw, 
  History, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  BarChart2,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function QuizzesView({ searchQuery }) {
  const [activeQuiz, setActiveQuiz] = useState(null); // null = quiz browser, quiz object = running quiz
  const [selectedQuizHistory, setSelectedQuizHistory] = useState(null); // quiz id for modal history view
  const [mistakes, setMistakes] = useState(getMistakes());

  // Listen for mistake updates across activities and quizzes
  useEffect(() => {
    const handleMistakesUpdate = () => {
      setMistakes(getMistakes());
    };
    window.addEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
    return () => window.removeEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
  }, []);
  
  // History persistence in localStorage
  // Schema: { [quizId]: [ { timestamp, score, total, percent, answers }, ... ] }
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_quiz_history_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to parse quiz history', e);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tagalog_quiz_history_v1', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save quiz history', e);
    }
  }, [history]);

  const handleCompleteQuiz = (attemptData) => {
    if (!activeQuiz) return;
    const quizId = activeQuiz.quiz_metadata.id;

    setHistory((prev) => {
      const existing = prev[quizId] || [];
      return {
        ...prev,
        [quizId]: [attemptData, ...existing] // Prepend newest attempt
      };
    });

    // Close running quiz to show completion summary
    setActiveQuiz(null);
    setSelectedQuizHistory(quizId); // Open history modal/view for this quiz
  };

  const handleClearHistory = (quizId) => {
    if (window.confirm("Are you sure you want to clear attempt history for this quiz?")) {
      setHistory((prev) => {
        const copy = { ...prev };
        delete copy[quizId];
        return copy;
      });
    }
  };

  const handleStartMistakesQuiz = () => {
    if (mistakes.length === 0) return;
    const mistakesQuizObj = {
      quiz_metadata: {
        id: 'QUIZ-MISTAKES-BANK',
        title: 'Incorrect Questions Review Quiz',
        topic: 'Mistakes Bank',
        total_questions: mistakes.length,
        created_at: new Date().toISOString()
      },
      questions: mistakes
    };
    setActiveQuiz(mistakesQuizObj);
  };

  // Filter quizzes by search
  const filteredQuizzes = availableQuizzes.filter((quiz) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = quiz.quiz_metadata.title.toLowerCase().includes(q);
    const matchTopic = quiz.quiz_metadata.topic.toLowerCase().includes(q);
    return matchTitle || matchTopic;
  });

  // Calculate overall stats
  const allAttempts = Object.values(history).flat();
  const totalCompleted = allAttempts.length;
  const avgPercent = totalCompleted > 0
    ? Math.round(allAttempts.reduce((acc, curr) => acc + curr.percent, 0) / totalCompleted)
    : 0;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* ------------------------------------------------------------- */}
      {/* MODE 1: ACTIVE QUIZ RUNNER                                     */}
      {/* ------------------------------------------------------------- */}
      {activeQuiz ? (
        <QuizRunner
          quiz={activeQuiz}
          onCompleteQuiz={handleCompleteQuiz}
          onCancel={() => setActiveQuiz(null)}
        />
      ) : (
        /* ------------------------------------------------------------- */
        /* MODE 2: QUIZZES BROWSER & MISTAKES BANK HUB                   */
        /* ------------------------------------------------------------- */
        <div>
          {/* Top Banner */}
          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <HelpCircle size={22} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>Generated Theory Quizzes</h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Take custom theory quizzes generated from the knowledge base, review your incorrect questions bank, and track accuracy history.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-cyan" style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem' }}>
                  {availableQuizzes.length} Quizzes Available
                </span>
              </div>
            </div>

            {/* Overall Statistics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quizzes Available</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{availableQuizzes.length} Quizzes</div>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>Incorrect Questions Saved</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f43f5e' }}>{mistakes.length} Questions</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Total Quiz Attempts</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#34d399' }}>{totalCompleted} Attempts</div>
              </div>
            </div>
          </div>

          {/* Featured Mistakes Bank Review Quiz Card */}
          <div className="glass-card animate-fade-in" style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            background: mistakes.length > 0
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(18, 24, 38, 0.95) 100%)'
              : 'rgba(18, 24, 38, 0.85)',
            border: mistakes.length > 0 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)',
            boxShadow: mistakes.length > 0 ? '0 0 25px rgba(244, 63, 94, 0.15)' : 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span className={mistakes.length > 0 ? 'badge badge-rose' : 'badge badge-emerald'} style={{
                    background: mistakes.length > 0 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: mistakes.length > 0 ? '#f43f5e' : '#34d399',
                    fontSize: '0.7rem'
                  }}>
                    {mistakes.length > 0 ? 'Needs Practice' : 'All Clear ✓'}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {mistakes.length} Incorrect Questions Saved
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  🔴 Review Incorrect Answers Quiz
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0', maxWidth: '650px' }}>
                  {mistakes.length > 0 
                    ? `You currently have ${mistakes.length} question(s) answered incorrectly in activities or quizzes. Practice them now; as soon as you answer a question correctly, it will automatically disappear from this review list!`
                    : 'Congratulations! You have zero incorrect questions in your review bank. Whenever you miss a question in exercises or quizzes, it will automatically be saved here for targeted practice.'}
                </p>
              </div>

              {mistakes.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleStartMistakesQuiz}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                      padding: '0.7rem 1.25rem',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)'
                    }}
                  >
                    Practice Mistakes ({mistakes.length}) <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quizzes List Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Available Quizzes
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {filteredQuizzes.map((quiz) => {
              const quizId = quiz.quiz_metadata.id;
              const quizAttempts = history[quizId] || [];
              const attemptCount = quizAttempts.length;
              const highestScore = attemptCount > 0 ? Math.max(...quizAttempts.map((a) => a.percent)) : null;
              const latestAttempt = attemptCount > 0 ? quizAttempts[0] : null;

              return (
                <div 
                  key={quizId}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}
                >
                  <div>
                    {/* Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        {quiz.quiz_metadata.topic}
                      </span>
                      <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                        {quiz.quiz_metadata.total_questions} Questions
                      </span>
                    </div>

                    {/* Quiz Title */}
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {quiz.quiz_metadata.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginBottom: '1rem' }}>
                      Master Tagalog grammar topics with interactive multiple-choice and fill-in-the-blank questions.
                    </p>

                    {/* Performance History Snippet */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.825rem' }}>
                      {attemptCount > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Times Attempted:</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{attemptCount} times</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Highest Accuracy:</span>
                            <strong style={{ color: 'var(--accent-emerald)' }}>{highestScore}%</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Latest Attempt:</span>
                            <strong style={{ color: 'var(--accent-amber)' }}>{latestAttempt.percent}% ({latestAttempt.score}/{latestAttempt.total})</strong>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No attempts yet. Take this quiz to build your accuracy history!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setActiveQuiz(quiz)}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.65rem 1rem', fontSize: '0.875rem' }}
                    >
                      {attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'} <ArrowRight size={16} aria-hidden="true" />
                    </button>

                    {attemptCount > 0 && (
                      <button
                        onClick={() => setSelectedQuizHistory(selectedQuizHistory === quizId ? null : quizId)}
                        className="btn-secondary"
                        aria-label={`View history for ${quiz.quiz_metadata.title}`}
                        style={{ padding: '0.65rem 0.85rem', fontSize: '0.875rem' }}
                        title="View attempt history"
                      >
                        <History size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Attempt History Panel for Selected Quiz */}
          {selectedQuizHistory && history[selectedQuizHistory] && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <History size={20} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Attempt History Log</h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleClearHistory(selectedQuizHistory)}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem' }}
                  >
                    <RefreshCw size={14} aria-hidden="true" /> Clear History
                  </button>
                  
                  <button
                    onClick={() => setSelectedQuizHistory(null)}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem' }}
                  >
                    Close Log
                  </button>
                </div>
              </div>

              {/* History Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--accent-cyan)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Attempt #</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date & Time</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Accuracy (%)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history[selectedQuizHistory].map((attempt, idx) => {
                      const dateStr = new Date(attempt.timestamp).toLocaleString();
                      const isBest = attempt.percent === Math.max(...history[selectedQuizHistory].map(a => a.percent));

                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>#{history[selectedQuizHistory].length - idx}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{dateStr}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {attempt.score} / {attempt.total}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '800', color: attempt.percent >= 80 ? '#34d399' : attempt.percent >= 60 ? '#fbbf24' : '#f43f5e' }}>
                            {attempt.percent}%
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {isBest ? (
                              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Best Score 🏆</span>
                            ) : attempt.percent >= 80 ? (
                              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Great Pass</span>
                            ) : (
                              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Needs Review</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
