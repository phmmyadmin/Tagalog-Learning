import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StreakCalendar } from '../components/StreakCalendar';
import { ProgressCard } from '../components/ProgressCard';

/**
 * DashboardView Component - Home overview with greeting, study stats, progress cards, and quick actions.
 */
export const DashboardView = ({
  onNavigate,
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
        <StreakCalendar streakCount={5} daysActive={[0, 1, 2, 3, 4]} />

        {/* Quick Action Cards */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Quick Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.dueSrsCount > 0 && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => onNavigate('vocabulary')}
                icon={<span>🧠</span>}
              >
                Review SRS Flashcards ({stats.dueSrsCount} due)
              </Button>
            )}

            {stats.mistakesCount > 0 && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => onNavigate('quizzes')}
                icon={<span>⚠️</span>}
              >
                Review Mistakes Bank ({stats.mistakesCount} items)
              </Button>
            )}

            <Button
              variant="secondary"
              fullWidth
              onClick={() => onNavigate('theory')}
              icon={<span>📖</span>}
            >
              Explore Theory & Grammar
            </Button>
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
            onNavigate={() => onNavigate('theory')}
            color="var(--accent-primary)"
          />

          <ProgressCard
            title="Vocabulary"
            icon="🎴"
            completedCount={stats.vocabMastered}
            totalCount={stats.totalVocab}
            onNavigate={() => onNavigate('vocabulary')}
            color="var(--accent-success)"
          />

          <ProgressCard
            title="Practice Activities"
            icon="✍️"
            completedCount={stats.activitiesDone}
            totalCount={stats.totalActivities}
            onNavigate={() => onNavigate('activities')}
            color="var(--accent-warning)"
          />

          <ProgressCard
            title="Quizzes & Exams"
            icon="🏆"
            completedCount={stats.quizzesCompleted}
            totalCount={stats.totalQuizzes}
            onNavigate={() => onNavigate('quizzes')}
            color="var(--accent-info)"
          />
        </div>
      </div>
    </div>
  );
};
