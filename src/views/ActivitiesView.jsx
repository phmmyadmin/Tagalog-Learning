import React, { useState, useEffect } from 'react';
import ActivityCard from '../components/ActivityCard';
import { 
  GraduationCap, 
  CheckCircle2, 
  RefreshCw, 
  RotateCw, 
  Trophy, 
  Sparkles, 
  BookOpen, 
  ListFilter,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ActivitiesView({ activitiesList, searchQuery, onOpenLesson }) {
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [quizMode, setQuizMode] = useState(false); // false = list view, true = step-by-step quiz
  const [quizIndex, setQuizIndex] = useState(0);

  // Persistence for exercise results in localStorage
  const [savedResults, setSavedResults] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_activity_results_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tagalog_activity_results_v1', JSON.stringify(savedResults));
    } catch (e) {
      console.error('Failed to save activity results', e);
    }
  }, [savedResults]);

  const handleSaveResult = (id, resultData) => {
    setSavedResults((prev) => {
      const copy = { ...prev };
      if (resultData === null) {
        delete copy[id]; // Reset result
      } else {
        copy[id] = resultData;
      }
      return copy;
    });
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all activity progress? You will be able to retake all exercises.")) {
      setSavedResults({});
      setQuizIndex(0);
    }
  };

  // Filtered activities list
  const filteredActivities = activitiesList.filter((act) => {
    if (selectedLesson !== 'all' && act.lesson !== selectedLesson) return false;
    if (selectedType !== 'all' && act.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = act.prompt.toLowerCase().includes(q);
      const matchAnswer = act.correctAnswer.toLowerCase().includes(q);
      const matchId = act.id.toLowerCase().includes(q);
      return matchPrompt || matchAnswer || matchId;
    }

    return true;
  });

  // Calculate score stats
  const totalActivities = activitiesList.length;
  const completedCount = Object.keys(savedResults).length;
  const correctCount = Object.values(savedResults).filter((r) => r.isCorrect).length;
  const scorePercent = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;

  // Unique lessons list
  const lessonsList = Array.from(new Set(activitiesList.map((a) => a.lesson).filter(Boolean)));

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <GraduationCap size={24} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>Activities & Practice Center</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Practice Tagalog grammar rules and translations. Attempt exercises, receive instant feedback, and retake them anytime.
            </p>
          </div>

          {/* Quiz Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} role="tablist" aria-label="Exercise modes">
            <a
              href="#activities?mode=all"
              role="tab"
              aria-selected={!quizMode}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                  setQuizMode(false);
                }
              }}
              className={!quizMode ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <Layers size={15} aria-hidden="true" /> All Exercises
            </a>

            <a
              href="#activities?mode=quiz"
              role="tab"
              aria-selected={quizMode}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                  setQuizMode(true);
                  setQuizIndex(0);
                }
              }}
              className={quizMode ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <Trophy size={15} aria-hidden="true" /> Step-by-Step Quiz Mode
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Exercises Available</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalActivities} Exercises</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Completed Exercises</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#34d399' }}>{correctCount} / {totalActivities}</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Accuracy Score</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fbbf24' }}>{scorePercent}%</div>
            </div>

            {completedCount > 0 && (
              <button
                onClick={handleResetAll}
                className="btn-secondary"
                aria-label="Reset all exercise progress"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                title="Reset all activity results to retake everything"
              >
                <RefreshCw size={12} aria-hidden="true" /> Reset Progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODE 1: ALL EXERCISES LIST VIEW                                */}
      {/* ------------------------------------------------------------- */}
      {!quizMode && (
        <div>
          {/* Filters Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Filter by Lesson:</span>
              <button
                onClick={() => setSelectedLesson('all')}
                className={selectedLesson === 'all' ? 'badge badge-cyan' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
              >
                All
              </button>
              {lessonsList.map((lesson) => (
                <button
                  key={lesson}
                  onClick={() => setSelectedLesson(lesson)}
                  className={selectedLesson === lesson ? 'badge badge-cyan' : 'btn-secondary'}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                >
                  {lesson.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Type:</span>
              <button
                onClick={() => setSelectedType('all')}
                className={selectedType === 'all' ? 'badge badge-indigo' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType('fill_in_blank')}
                className={selectedType === 'fill_in_blank' ? 'badge badge-indigo' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
              >
                Fill-in-blank
              </button>
              <button
                onClick={() => setSelectedType('translation')}
                className={selectedType === 'translation' ? 'badge badge-indigo' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
              >
                Translation
              </button>
            </div>
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No exercises found</h3>
              <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or clearing your search bar.</p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                savedResult={savedResults[act.id]}
                onSaveResult={handleSaveResult}
                onOpenLesson={onOpenLesson}
              />
            ))
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 2: STEP-BY-STEP QUIZ MODE                                */}
      {/* ------------------------------------------------------------- */}
      {quizMode && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {filteredActivities.length > 0 && quizIndex < filteredActivities.length ? (
            <div>
              {/* Quiz Navigation Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '600' }}>Question {quizIndex + 1} of {filteredActivities.length}</span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: '700' }}>Score: {correctCount} / {completedCount}</span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.round(((quizIndex + 1) / filteredActivities.length) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-amber) 0%, var(--accent-cyan) 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Active Quiz Question Card */}
              <ActivityCard
                key={filteredActivities[quizIndex].id}
                activity={filteredActivities[quizIndex]}
                savedResult={savedResults[filteredActivities[quizIndex].id]}
                onSaveResult={handleSaveResult}
                onOpenLesson={onOpenLesson}
              />

              {/* Quiz Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => setQuizIndex((prev) => Math.max(0, prev - 1))}
                  className="btn-secondary"
                  disabled={quizIndex === 0}
                  style={{ opacity: quizIndex === 0 ? 0.5 : 1 }}
                >
                  Previous Question
                </button>

                <button
                  onClick={() => setQuizIndex((prev) => prev + 1)}
                  className="btn-primary"
                >
                  {quizIndex < filteredActivities.length - 1 ? (
                    <>Next Question <ArrowRight size={16} aria-hidden="true" /></>
                  ) : (
                    <>Finish Quiz <Trophy size={16} aria-hidden="true" /></>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="glass-card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--accent-amber)',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)'
              }}>
                <Trophy size={36} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Quiz Finished!
              </h2>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                You completed all questions with an accuracy score of <strong style={{ color: 'var(--accent-amber)' }}>{scorePercent}%</strong> ({correctCount} correct out of {completedCount} attempted).
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setQuizIndex(0);
                  }}
                  className="btn-primary"
                >
                  <RotateCw size={16} aria-hidden="true" /> Retake Quiz Session
                </button>

                <button
                  onClick={() => setQuizMode(false)}
                  className="btn-secondary"
                >
                  <Layers size={16} aria-hidden="true" /> Back to All Exercises
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
