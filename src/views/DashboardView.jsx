import React from 'react';
import { Card } from '../components/ui/Card';
import { StreakCalendar } from '../components/StreakCalendar';
import { ProgressCard } from '../components/ProgressCard';

/**
 * DashboardView Component - Home overview with greeting, study stats, progress cards, and quick action links.
 */
export const DashboardView = ({
  onNavigate,
  streakCount = 1,
  daysActiveThisWeek = [0],
  stats = {
    theoryMastered: 0,
    totalTheory: 0,
    vocabMastered: 0,
    totalVocab: 0,
    activitiesDone: 0,
    totalActivities: 0,
    quizzesCompleted: 0,
    totalQuizzes: 0,
    dueSrsCount: 0,
    mistakesCount: 0,
  },
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Magandang umaga (Good morning), Pablo 👋';
    if (hour < 18) return 'Magandang hapon (Good afternoon), Pablo 👋';
    return 'Magandang gabi (Good evening), Pablo 👋';
  };

  const handleNavClick = (e, tabId) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      onNavigate(tabId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <Card variant="alt" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-alt) 100%)' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {getGreeting()}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px' }}>
          Welcome back to your Tagalog learning hub. Continue mastering grammar, expanding your lexicon, and practicing quizzes.
        </p>
      </Card>

      {/* Grid: Streak + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <StreakCalendar streakCount={streakCount} daysActive={daysActiveThisWeek} />

        {/* Quick Action Links */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Quick Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.dueSrsCount > 0 && (
              <a
                href="#vocabulary"
                onClick={(e) => handleNavClick(e, 'vocabulary')}
                className="btn-primary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                <span>🧠</span> Review SRS Flashcards ({stats.dueSrsCount} due)
              </a>
            )}

            {stats.mistakesCount > 0 && (
              <a
                href="#quizzes"
                onClick={(e) => handleNavClick(e, 'quizzes')}
                className="btn-primary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', backgroundColor: 'var(--accent-danger)' }}
              >
                <span>⚠️</span> Review Mistakes Bank ({stats.mistakesCount} items)
              </a>
            )}

            <a
              href="#theory"
              onClick={(e) => handleNavClick(e, 'theory')}
              className="btn-secondary"
              style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
            >
              <span>📖</span> Explore Theory & Grammar
            </a>

            <a
              href="#ingest"
              onClick={(e) => handleNavClick(e, 'ingest')}
              className="btn-secondary"
              style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
            >
              <span>📤</span> Ingest PPTX Lesson
            </a>
          </div>
        </Card>
      </div>

      {/* Section Progress Grid */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Your Learning Modules
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <ProgressCard
            title="Grammar & Theory"
            icon="📖"
            completedCount={stats.theoryMastered}
            totalCount={stats.totalTheory}
            targetTab="theory"
            onNavigate={() => onNavigate('theory')}
            color="var(--accent-primary)"
          />

          <ProgressCard
            title="Vocabulary"
            icon="🎴"
            completedCount={stats.vocabMastered}
            totalCount={stats.totalVocab}
            targetTab="vocabulary"
            onNavigate={() => onNavigate('vocabulary')}
            color="var(--accent-success)"
          />

          <ProgressCard
            title="Practice Activities"
            icon="✍️"
            completedCount={stats.activitiesDone}
            totalCount={stats.totalActivities}
            targetTab="activities"
            onNavigate={() => onNavigate('activities')}
            color="var(--accent-warning)"
          />

          <ProgressCard
            title="Quizzes & Exams"
            icon="🏆"
            completedCount={stats.quizzesCompleted}
            totalCount={stats.totalQuizzes}
            targetTab="quizzes"
            onNavigate={() => onNavigate('quizzes')}
            color="var(--accent-info)"
          />
        </div>
      </div>
    </div>
  );
};
