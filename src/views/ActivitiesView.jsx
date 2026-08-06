import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ActivityGroupCard } from '../components/ActivityGroupCard';
import { FilterChip } from '../components/ui/FilterChip';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export default function ActivitiesView({ activitiesList = [], searchQuery = '', onOpenLesson }) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [allExpanded, setAllExpanded] = useState(false);

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
  const lessonsList = ['all', ...new Set(activitiesList.map((a) => a.lesson).filter(Boolean))];

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

    if (selectedLesson !== 'all' && act.lesson !== selectedLesson) {
      return false;
    }

    return true;
  });

  // Group activities by lesson + slide
  const activityGroups = [];
  const groupsMap = new Map();

  filteredActivities.forEach((act) => {
    const lesson = act.lesson || 'General';
    const slide = act.slide || 1;
    const key = `${lesson}_slide_${slide}`;

    if (!groupsMap.has(key)) {
      const groupObj = {
        key,
        lesson: act.lesson,
        slide: act.slide,
        activities: [],
      };
      groupsMap.set(key, groupObj);
      activityGroups.push(groupObj);
    }

    groupsMap.get(key).activities.push(act);
  });

  const completedIds = Object.keys(savedResults).filter((id) => savedResults[id]?.isCorrect);
  const completedCount = completedIds.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header & Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            ✍️ Practice & Exercises
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Test your Tagalog grammar, vocabulary, and translation skills grouped by lesson slide.
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

      {/* Filter Chips Bar + Batch Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          {/* Lesson Filter Chips */}
          {lessonsList.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {lessonsList.map((les) => (
                <FilterChip
                  key={les}
                  label={les === 'all' ? 'All Lessons' : les.replace('_', ' ')}
                  active={selectedLesson === les}
                  onClick={() => setSelectedLesson(les)}
                />
              ))}
            </div>
          )}

          {/* Type Filter Chips */}
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
        </div>

        {/* Global Batch Toggle Exercises */}
        {activityGroups.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAllExpanded(!allExpanded)}
            style={{
              fontSize: '0.85rem',
              padding: '0.45rem 0.85rem',
              gap: '0.45rem',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-alt)',
            }}
          >
            {allExpanded ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            <span>{allExpanded ? 'Collapse All Groups' : 'Expand All Groups'}</span>
          </Button>
        )}
      </div>

      {/* Activity Group Cards */}
      {activityGroups.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activityGroups.map((group) => (
            <ActivityGroupCard
              key={group.key}
              groupKey={group.key}
              lesson={group.lesson}
              slide={group.slide}
              activities={group.activities}
              savedResults={savedResults}
              onOpenLesson={onOpenLesson}
              completedIds={completedIds}
              isExpanded={allExpanded}
              onActivityComplete={(id, result) => handleSaveResult(id, result)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No exercises found"
          description="Try selecting another lesson or exercise type."
        />
      )}
    </div>
  );
}
