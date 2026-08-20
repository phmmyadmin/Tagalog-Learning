import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import {
  getCardMaturityDistribution,
  calculateRetentionStats,
  getDailyReviewHistory,
  getWorkloadForecast,
  getDifficultyDistribution,
} from '../utils/srsStats';
import { getGamificationState, getLevelInfo, ACHIEVEMENTS } from '../utils/gamification';

export default function SrsStatsView({ vocabularyList = [] }) {
  const [selectedHistoryDay, setSelectedHistoryDay] = useState(null);
  const [selectedForecastDay, setSelectedForecastDay] = useState(null);
  const [hoveredHistoryDay, setHoveredHistoryDay] = useState(null);
  const [hoveredForecastDay, setHoveredForecastDay] = useState(null);

  const maturity = getCardMaturityDistribution(vocabularyList);
  const retention = calculateRetentionStats(30);
  const dailyHistory = getDailyReviewHistory(30, vocabularyList);
  const forecast = getWorkloadForecast(vocabularyList, 30);
  const difficultyDist = getDifficultyDistribution(vocabularyList);
  const gamification = getGamificationState();
  const levelInfo = getLevelInfo(gamification.xp);

  const maxDailyCount = Math.max(1, ...dailyHistory.map((d) => d.count));
  const maxForecastCount = Math.max(1, ...forecast.map((f) => f.count));

  const getRatingBadge = (ratingName) => {
    if (ratingName === 'again') return <Badge variant="danger">1. Again</Badge>;
    if (ratingName === 'hard') return <Badge variant="warning">2. Hard</Badge>;
    if (ratingName === 'good') return <Badge variant="primary">3. Good</Badge>;
    if (ratingName === 'easy') return <Badge variant="success">4. Easy ⭐</Badge>;
    return <Badge variant="default">{ratingName}</Badge>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
          📊 SRS Analytics & Memory Forecast
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive memory retention stats, card maturity stages, and review projections based on FSRS-5.
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

      {/* 1. INTERACTIVE CHART: Daily Review History (Last 30 Days) */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              📈 Review Activity (Last 30 Days)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Click any bar to inspect exact words reviewed on that date.
            </p>
          </div>
          {hoveredHistoryDay && (
            <Badge variant="primary">
              {hoveredHistoryDay.date}: {hoveredHistoryDay.count} reviews ({hoveredHistoryDay.correct} correct)
            </Badge>
          )}
        </div>

        {/* Interactive Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '150px', paddingTop: '1.5rem', position: 'relative' }}>
          {dailyHistory.map((d) => {
            const heightPercent = maxDailyCount > 0 ? (d.count / maxDailyCount) * 100 : 0;
            const isSelected = selectedHistoryDay?.date === d.date;
            const isHovered = hoveredHistoryDay?.date === d.date;

            return (
              <div
                key={d.date}
                onClick={() => setSelectedHistoryDay(isSelected ? null : d)}
                onMouseEnter={() => setHoveredHistoryDay(d)}
                onMouseLeave={() => setHoveredHistoryDay(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Count Bubble on Top of Selected/Hovered Bar */}
                {(isSelected || isHovered) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                      backgroundColor: 'var(--bg-surface-alt)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-default)',
                      whiteSpace: 'nowrap',
                      zIndex: 5,
                    }}
                  >
                    {d.count}
                  </div>
                )}

                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(6, heightPercent)}%`,
                    backgroundColor: isSelected
                      ? 'var(--accent-primary-hover)'
                      : d.count > 0
                      ? 'var(--accent-primary)'
                      : 'var(--bg-surface-alt)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 0 2px var(--accent-primary)' : 'none',
                    transform: isHovered || isSelected ? 'scaleY(1.05)' : 'none',
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

        {/* Selected Review Activity Word Detail Panel */}
        {selectedHistoryDay && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface-alt)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            className="animate-fade-in"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                  📅 Reviews on {selectedHistoryDay.date} ({selectedHistoryDay.count} reviews)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Accuracy: {selectedHistoryDay.count > 0 ? Math.round((selectedHistoryDay.correct / selectedHistoryDay.count) * 100) : 0}% · Total time: {selectedHistoryDay.timeSec}s
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedHistoryDay(null)}>
                ✕ Close
              </Button>
            </div>

            {selectedHistoryDay.items.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.25rem' }}>
                {selectedHistoryDay.items.map((item, idx) => (
                  <div
                    key={`${item.id}_${idx}`}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {item.word}
                      </span>
                      {getRatingBadge(item.ratingName)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.meaning}
                    </div>
                    {item.timeMs > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ⏱️ {(item.timeMs / 1000).toFixed(1)}s
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No reviews recorded on this date.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 2. INTERACTIVE CHART: Workload Forecast (Cards Due Next 30 Days) */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              🔮 Memory Forecast (Cards Due Next 30 Days)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Click any day bar to view which cards are scheduled for review.
            </p>
          </div>
          {hoveredForecastDay && (
            <Badge variant="warning">
              {hoveredForecastDay.date}: {hoveredForecastDay.count} cards due
            </Badge>
          )}
        </div>

        {/* Interactive Forecast Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '150px', paddingTop: '1.5rem', position: 'relative' }}>
          {forecast.map((f) => {
            const heightPercent = maxForecastCount > 0 ? (f.count / maxForecastCount) * 100 : 0;
            const isSelected = selectedForecastDay?.date === f.date;
            const isHovered = hoveredForecastDay?.date === f.date;

            return (
              <div
                key={f.date}
                onClick={() => setSelectedForecastDay(isSelected ? null : f)}
                onMouseEnter={() => setHoveredForecastDay(f)}
                onMouseLeave={() => setHoveredForecastDay(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Count Bubble on Top of Selected/Hovered Bar */}
                {(isSelected || isHovered) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isSelected ? 'var(--accent-warning)' : 'var(--text-primary)',
                      backgroundColor: 'var(--bg-surface-alt)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-default)',
                      whiteSpace: 'nowrap',
                      zIndex: 5,
                    }}
                  >
                    {f.count}
                  </div>
                )}

                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(6, heightPercent)}%`,
                    backgroundColor: isSelected
                      ? '#B45309'
                      : f.count > 0
                      ? 'var(--accent-warning)'
                      : 'var(--bg-surface-alt)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 0 2px var(--accent-warning)' : 'none',
                    transform: isHovered || isSelected ? 'scaleY(1.05)' : 'none',
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

        {/* Selected Forecast Cards Word Detail Panel */}
        {selectedForecastDay && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface-alt)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-warning)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            className="animate-fade-in"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                  🔮 Cards Due on {selectedForecastDay.date} ({selectedForecastDay.count} cards)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  FSRS Scheduled Review Queue
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedForecastDay(null)}>
                ✕ Close
              </Button>
            </div>

            {selectedForecastDay.items.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.25rem' }}>
                {selectedForecastDay.items.map((item, idx) => (
                  <div
                    key={`${item.id}_${idx}`}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {item.word}
                      </span>
                      <Badge variant="warning">{item.partOfSpeech || 'Vocab'}</Badge>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.meaning}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      <span>S: {item.srs?.stability ? `${Math.round(item.srs.stability)}d` : '1d'}</span>
                      <span>·</span>
                      <span>D: {item.srs?.difficulty ? item.srs.difficulty.toFixed(1) : '5.0'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No cards scheduled for review on this date.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
