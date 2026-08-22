import React, { useState, useEffect } from 'react';
import QuizRunner from '../components/QuizRunner';
import AiQuizGeneratorView from './AiQuizGeneratorView';
import SrsSettingsPanel from '../components/SrsSettingsPanel';
import { getMergedLessonQuizzes } from '../utils/userLessonsManager';
import { getSavedQuizzes, deleteSavedQuiz } from '../utils/savedQuizzesManager';
import { getMistakes, clearAllMistakes } from '../utils/mistakesManager';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { pushProgressToCloud } from '../utils/cloudSyncManager';

export default function QuizzesView({
  vocabularyList = [],
  theoryList = [],
  lessons = [],
  masteredItems = [],
  onMarkLessonMastered,
}) {
  const [subMode, setSubMode] = useState('lesson_exams'); // 'lesson_exams' | 'ai_generator' | 'library' | 'history'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [mistakes, setMistakes] = useState(getMistakes());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState(getSavedQuizzes());
  const [lessonQuizzesList, setLessonQuizzesList] = useState(() => getMergedLessonQuizzes());
  const [celebrationMsg, setCelebrationMsg] = useState(null);

  useEffect(() => {
    const handleMistakesUpdate = () => {
      setMistakes(getMistakes());
    };
    const handleSavedQuizzesUpdate = () => {
      setSavedQuizzes(getSavedQuizzes());
    };
    const handleUserLessonsUpdate = () => {
      setLessonQuizzesList(getMergedLessonQuizzes());
    };

    window.addEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
    window.addEventListener('tagalog_saved_quizzes_updated', handleSavedQuizzesUpdate);
    window.addEventListener('tagalog_user_lessons_updated', handleUserLessonsUpdate);
    return () => {
      window.removeEventListener('tagalog_mistakes_updated', handleMistakesUpdate);
      window.removeEventListener('tagalog_saved_quizzes_updated', handleSavedQuizzesUpdate);
      window.removeEventListener('tagalog_user_lessons_updated', handleUserLessonsUpdate);
    };
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
    const percent = Math.round((score / total) * 100);
    const record = {
      timestamp: new Date().toISOString(),
      score,
      total,
      percent,
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

    // Check if this was a Lesson Quiz completed with 100% score (0 errors)
    const isPerfectScore = score === total && total > 0;
    const activeLessonKey = activeQuiz?.quiz_metadata?.lesson;

    if (isPerfectScore && activeLessonKey && onMarkLessonMastered) {
      onMarkLessonMastered(activeLessonKey);
      setCelebrationMsg(`🎉 Perfect Score (100%)! ${activeLessonKey.replace('_', ' ')} is now marked as Mastered!`);
    }

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
    const matchedQuiz = [...lessonQuizzesList, ...savedQuizzes].find((q) => (q.quiz_metadata?.id || q.id) === quizId);
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
      {/* Header & Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            🏆 Quizzes & Exam Suite
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            Take Lesson Mastery Exams (100% required to master) or generate custom AI quizzes.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <Button
            variant={subMode === 'lesson_exams' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSubMode('lesson_exams')}
            icon={<span>🎓</span>}
          >
            Lesson Exams ({lessonQuizzesList.length})
          </Button>
          <Button
            variant={subMode === 'ai_generator' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSubMode('ai_generator')}
            icon={<span>🤖</span>}
          >
            AI Generator
          </Button>
          <Button
            variant={subMode === 'library' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSubMode('library')}
            icon={<span>📚</span>}
          >
            Quiz Library ({savedQuizzes.length})
          </Button>
          <Button
            variant={subMode === 'history' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSubMode('history')}
            icon={<span>📜</span>}
          >
            History
          </Button>
        </div>
      </div>

      {/* Celebration Notification */}
      {celebrationMsg && (
        <Card variant="alt" style={{ border: '1px solid var(--accent-emerald)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>
              {celebrationMsg}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setCelebrationMsg(null)}>
              ✕
            </Button>
          </div>
        </Card>
      )}

      {/* Mistakes Bank Alert */}
      {mistakes.length > 0 && (
        <Card variant="alt" style={{ border: '1px solid var(--accent-danger)', backgroundColor: 'var(--accent-danger-light)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span> Mistakes Bank ({mistakes.length} items waiting)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                You have {mistakes.length} missed questions waiting for review. Practice until you master them!
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

      {/* SubMode 1: Lesson Exams (Pestaña dedicada) */}
      {subMode === 'lesson_exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎓</span> Lesson Mastery Exams
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Score <strong>100% (0 errors)</strong> on a Lesson Exam to mark the entire lesson as <strong>Mastered / Entendida</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {lessonQuizzesList.map((quiz) => {
              const meta = quiz.quiz_metadata || {};
              const quizId = meta.id || quiz.id;
              const lessonKey = meta.lesson || 'Lesson_02';
              const quizTitle = meta.title || `Lesson Quiz (${lessonKey})`;
              const quizTopic = meta.topic || 'Grammar & Vocab Exam';
              const numQuestions = quiz.questions?.length || 8;

              const quizHistory = history[quizId] || [];
              const lastAttempt = quizHistory[0];

              const normLessonKey = lessonKey.includes('Lesson_') ? lessonKey : lessonKey.replace('Lesson ', 'Lesson_');
              const isLessonMastered = masteredItems.includes(`LESSON_MASTERED_${normLessonKey}`) || (lastAttempt && lastAttempt.percent === 100);

              return (
                <Card
                  key={quizId}
                  variant="interactive"
                  onClick={() => setActiveQuiz(quiz)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: isLessonMastered ? '2px solid var(--accent-emerald)' : '1px solid var(--border-default)',
                    backgroundColor: isLessonMastered ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <Badge variant="primary">{normLessonKey.replace('_', ' ')}</Badge>
                      {isLessonMastered ? (
                        <Badge variant="success">
                          🏆 Mastered (100%)
                        </Badge>
                      ) : lastAttempt ? (
                        <Badge variant="amber">
                          Best: {lastAttempt.percent}%
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Attempted</Badge>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
                      {quizTitle}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {quizTopic} · {numQuestions} Questions
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
                    <span style={{ fontSize: '0.8rem', color: isLessonMastered ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: isLessonMastered ? 600 : 400 }}>
                      {isLessonMastered ? '✓ 100% Mastered' : 'Requires 100% score'}
                    </span>

                    <Button variant={isLessonMastered ? 'secondary' : 'primary'} size="sm" onClick={(e) => { e.stopPropagation(); setActiveQuiz(quiz); }}>
                      {isLessonMastered ? 'Retake Exam 🔄' : 'Take Exam →'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SubMode 2: AI Quiz Generator */}
      {subMode === 'ai_generator' && (
        <AiQuizGeneratorView
          vocabularyList={vocabularyList}
          theoryList={theoryList}
          lessons={lessons}
          onStartQuiz={(generatedQuiz) => setActiveQuiz(generatedQuiz)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* SubMode 3: Quiz Library (Saved AI Quizzes) */}
      {subMode === 'library' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
              📚 Saved Quiz Library
            </h2>
            <Button variant="primary" size="sm" onClick={() => setSubMode('ai_generator')} icon={<span>✨</span>}>
              Generate New Quiz
            </Button>
          </div>

          {savedQuizzes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {savedQuizzes.map((quiz) => {
                const meta = quiz.quiz_metadata || {};
                const quizId = meta.id || quiz.id;
                const quizTitle = meta.title || quiz.title || 'Tagalog Quiz';
                const quizTopic = meta.topic || quiz.category || 'General Practice';
                const numQuestions = quiz.questions?.length || meta.total_questions || 0;

                const quizHistory = history[quizId] || [];
                const lastAttempt = quizHistory[0];

                return (
                  <Card
                    key={quizId}
                    variant="interactive"
                    onClick={() => setActiveQuiz(quiz)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      gap: '1rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Badge variant="primary">{quizTopic}</Badge>
                          {lastAttempt && (
                            <Badge variant={lastAttempt.percent >= 80 ? 'success' : 'amber'}>
                              Best: {lastAttempt.percent}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
                        {quizTitle}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {numQuestions} questions · {meta.created_at ? new Date(meta.created_at).toLocaleDateString() : 'Saved Quiz'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSavedQuiz(quizId);
                        }}
                        icon={<span>🗑️</span>}
                        style={{
                          backgroundColor: 'var(--accent-danger-light)',
                          color: 'var(--accent-danger)',
                          borderColor: 'transparent',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                        title="Delete quiz"
                      >
                        Delete
                      </Button>

                      <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); setActiveQuiz(quiz); }}>
                        Take Quiz →
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="alt" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                No saved quizzes yet. Use the <strong>AI Generator</strong> to create custom quizzes, and they will automatically be saved here and synced to Supabase Cloud so you can re-take them anytime!
              </p>
              <Button variant="primary" size="md" onClick={() => setSubMode('ai_generator')} style={{ marginTop: '1rem' }}>
                ✨ Generate Your First AI Quiz
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* SubMode 4: Attempt History */}
      {subMode === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <p style={{ margin: 0 }}>No quiz attempts recorded yet. Generate an AI quiz or select a saved quiz to start!</p>
            </Card>
          )}
        </div>
      )}

      {/* Settings Modal */}
      <SrsSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
