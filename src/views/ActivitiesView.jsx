import React, { useState, useEffect } from 'react';
import ActivityCard from '../components/ActivityCard';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';

export default function ActivitiesView({ activitiesList = [], searchQuery = '', onOpenLesson }) {
  const [selectedType, setSelectedType] = useState('all');

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
      if (resultData === null) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: resultData };
    });
  };

  const typesList = ['all', 'fill_in_blank', 'translation', 'multiple_choice'];

  const filteredActivities = activitiesList.filter((act) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = act.prompt?.toLowerCase().includes(q);
      const matchId = act.id?.toLowerCase().includes(q);
      if (!matchPrompt && !matchId) return false;
    }

    if (selectedType !== 'all' && act.type !== selectedType) {
      return false;
    }

    return true;
  });

  const completedCount = Object.values(savedResults).filter((r) => r && r.isCorrect).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header & Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            ✍️ Practice & Exercises
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Test your Tagalog grammar, vocabulary, and translation skills with interactive prompts.
          </p>
        </div>

        <div style={{ minWidth: '220px' }}>
          <ProgressBar
            value={completedCount}
            max={activitiesList.length || 1}
            label="Practice Mastered"
            color="var(--accent-warning)"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {typesList.map((type) => (
          <FilterChip
            key={type}
            label={type === 'all' ? 'All Types' : type.replace(/_/g, ' ').toUpperCase()}
            active={selectedType === type}
            onClick={() => setSelectedType(type)}
          />
        ))}
      </div>

      {/* Activities List */}
      {filteredActivities.length > 0 ? (
        <div>
          {filteredActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              savedResult={savedResults[act.id]}
              onSaveResult={handleSaveResult}
              onOpenLesson={onOpenLesson}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="✍️"
          title="No activities match your filters"
          description="Try selecting 'All Types' or clearing your search term to see all practice exercises."
        />
      )}
    </div>
  );
}
