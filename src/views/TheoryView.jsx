import React, { useState } from 'react';
import TheoryCard from '../components/TheoryCard';
import { FilterChip } from '../components/ui/FilterChip';
import { EmptyState } from '../components/ui/EmptyState';

export default function TheoryView({
  theoryList = [],
  searchQuery = '',
  selectedCategory = 'all',
  selectedLesson = 'all',
  filterMastered = 'all',
  masteredIds = [],
  onToggleMastered,
  onOpenLesson,
}) {
  const [activeLessonFilter, setActiveLessonFilter] = useState(selectedLesson);

  const lessons = ['all', ...new Set(theoryList.map((item) => item.lesson).filter(Boolean))];

  // Filtering logic
  const filteredTheory = theoryList.filter((item) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTopic = item.topic?.toLowerCase().includes(q);
      const matchSummary = item.summary?.toLowerCase().includes(q);
      const matchId = item.id?.toLowerCase().includes(q);
      if (!matchTopic && !matchSummary && !matchId) return false;
    }

    // Internal Lesson filter chip
    if (activeLessonFilter !== 'all' && item.lesson !== activeLessonFilter) {
      return false;
    }

    // External Lesson filter from drawer
    if (selectedLesson !== 'all' && item.lesson !== selectedLesson) {
      return false;
    }

    // Mastered filter
    const isMastered = masteredIds.includes(item.id);
    if (filterMastered === 'mastered' && !isMastered) return false;
    if (filterMastered === 'unmastered' && isMastered) return false;

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header & Filter Chips Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
              📖 Grammar & Theory
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Master Tagalog sentence structures, markers, pronouns, and syntax rules.
            </p>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing {filteredTheory.length} of {theoryList.length} topics
          </div>
        </div>

        {/* Lesson Filter Chips */}
        {lessons.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem 0' }}>
            {lessons.map((les) => (
              <FilterChip
                key={les}
                label={les === 'all' ? 'All Lessons' : les.replace('_', ' ')}
                active={activeLessonFilter === les}
                onClick={() => setActiveLessonFilter(les)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Topics Grid */}
      {filteredTheory.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {filteredTheory.map((topicData) => (
            <TheoryCard
              key={topicData.id}
              topicData={topicData}
              isMastered={masteredIds.includes(topicData.id)}
              onToggleMastered={onToggleMastered}
              onOpenLesson={onOpenLesson}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No theory topics found"
          description="Try adjusting your search query or lesson filter."
        />
      )}
    </div>
  );
}
