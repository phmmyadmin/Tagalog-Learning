import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  getCardMaturityDistribution,
  calculateRetentionStats,
  getDailyReviewHistory,
  getWorkloadForecast,
  getDifficultyDistribution,
} from '../utils/srsStats';
import { getGamificationState, getLevelInfo, ACHIEVEMENTS } from '../utils/gamification';

export default function SrsStatsView({ vocabularyList = [] }) {
  const maturity = getCardMaturityDistribution(vocabularyList);
  const retention = calculateRetentionStats(30);
  const dailyHistory = getDailyReviewHistory(30);
  const forecast = getWorkloadForecast(vocabularyList, 30);
  const difficultyDist = getDifficultyDistribution(vocabularyList);
  const gamification = getGamificationState();
  const levelInfo = getLevelInfo(gamification.xp);

  const maxDailyCount = Math.max(1, ...dailyHistory.map((d) => d.count));
  const maxForecastCount = Math.max(1, ...forecast.map((f) => f.count));
  const maxDifficultyCount = Math.max(1, ...difficultyDist.map((d) => d.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
          📊 SRS Analytics & Memory Forecast
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Deep-dive memory retention stats, card maturity stages, and review projections based on FSRS-5.
        </p>
      </div>

      {/* Gamification Banner Card */}
      <Card
        variant="alt"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
          border: '1px solid var(--accent-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{levelInfo.currentLevel.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>
                  Level {levelInfo.currentLevel.level}: {levelInfo.currentLevel.name}
                </h3>
                <Badge variant="primary">{levelInfo.currentLevel.title}</Badge>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, marginTop: '0.15rem' }}>
                Total XP: <strong>{gamification.xp} XP</strong>
                {levelInfo.nextLevel !== levelInfo.currentLevel && (
                  <span> · {levelInfo.xpToNext} XP until {levelInfo.nextLevel.name}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <ProgressBar
          value={levelInfo.percent}
          max={100}
          label={`Progress to Level ${levelInfo.nextLevel.level}: ${levelInfo.percent}%`}
          color="var(--accent-primary)"
        />

        {/* Achievement Badges */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Unlocked Achievements ({gamification.unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = gamification.unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  title={`${ach.title}: ${ach.desc}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isUnlocked ? 'var(--bg-surface)' : 'var(--bg-surface-alt)',
                    border: isUnlocked ? '1px solid var(--accent-warning)' : '1px solid var(--border-default)',
                    opacity: isUnlocked ? 1 : 0.45,
                    fontSize: '0.825rem',
                    fontWeight: isUnlocked ? 700 : 500,
                  }}
                >
                  <span>{ach.icon}</span>
                  <span>{ach.title.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Top Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-success)' }}>
            {retention.retentionRate}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
            True Retention (30d)
          </div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {retention.totalReviews}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
            Total Reviews (30d)
          </div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6' }}>
            {retention.averageTimeMs ? `${(retention.averageTimeMs / 1000).toFixed(1)}s` : '0s'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
            Avg Speed per Card
          </div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
            {maturity.mature}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
            Mature Words (S ≥ 21d)
          </div>
        </Card>
      </div>

      {/* Card Maturity Distribution */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
          🌱 Card Maturity Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <span>🟦 New ({maturity.new})</span>
              <span>{maturity.percentages.new}%</span>
            </div>
            <ProgressBar value={maturity.percentages.new} max={100} color="var(--accent-primary)" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <span>🟧 Learning ({maturity.learning})</span>
              <span>{maturity.percentages.learning}%</span>
            </div>
            <ProgressBar value={maturity.percentages.learning} max={100} color="var(--accent-warning)" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <span>🟩 Young ({maturity.young})</span>
              <span>{maturity.percentages.young}%</span>
            </div>
            <ProgressBar value={maturity.percentages.young} max={100} color="#10B981" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <span>🟪 Mature ({maturity.mature})</span>
              <span>{maturity.percentages.mature}%</span>
            </div>
            <ProgressBar value={maturity.percentages.mature} max={100} color="#8B5CF6" />
          </div>
        </div>
      </Card>

      {/* Daily Review History Chart (30 Days) */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
          📈 Review Activity (Last 30 Days)
        </h3>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px', paddingTop: '1rem' }}>
          {dailyHistory.map((d) => {
            const heightPercent = maxDailyCount > 0 ? (d.count / maxDailyCount) * 100 : 0;
            return (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} reviews (${d.correct} correct)`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(4, heightPercent)}%`,
                    backgroundColor: d.count > 0 ? 'var(--accent-primary)' : 'var(--bg-surface-alt)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </Card>

      {/* Workload Forecast (Next 30 Days) */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
          🔮 Memory Forecast (Cards Due Next 30 Days)
        </h3>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px', paddingTop: '1rem' }}>
          {forecast.map((f) => {
            const heightPercent = maxForecastCount > 0 ? (f.count / maxForecastCount) * 100 : 0;
            return (
              <div
                key={f.date}
                title={`${f.date}: ${f.count} cards due`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(4, heightPercent)}%`,
                    backgroundColor: f.count > 0 ? 'var(--accent-warning)' : 'var(--bg-surface-alt)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Today</span>
          <span>In 30 days</span>
        </div>
      </Card>
    </div>
  );
}
