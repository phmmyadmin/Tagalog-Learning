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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(selectedCategory);

  const categories = ['all', ...new Set(theoryList.map((item) => item.category || item.id).filter(Boolean))];

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

    // Category filter
    if (activeCategoryFilter !== 'all' && (item.category || item.id) !== activeCategoryFilter) {
      return false;
    }

    // Lesson filter
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

        {/* Category Chips */}
        {categories.length > 2 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem 0' }}>
            {categories.map((cat) => (
              <FilterChip
                key={cat}
                label={cat === 'all' ? 'All Topics' : cat}
                active={activeCategoryFilter === cat}
                onClick={() => setActiveCategoryFilter(cat)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Topics List */}
      {filteredTheory.length > 0 ? (
        <div>
          {filteredTheory.map((topic, idx) => (
            <TheoryCard
              key={topic.id}
              topicData={topic}
              isMastered={masteredIds.includes(topic.id)}
              onToggleMastered={onToggleMastered}
              index={idx}
              onOpenLesson={onOpenLesson}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📖"
          title="No grammar topics match your filters"
          description="Try selecting 'All Lessons' or clearing your search term to see all grammar rules."
        />
      )}
    </div>
  );
}
