import React, { useState, useEffect } from 'react';
import VocabularyCard from '../components/VocabularyCard';
import SrsSessionView from './SrsSessionView';
import SrsStatsView from './SrsStatsView';
import { SettingsModal } from '../components/SettingsModal';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { migrateLegacyMasteredItems } from '../utils/srsStore';

export default function VocabularyView({
  vocabularyList = [],
  searchQuery = '',
  onSearchChange,
  selectedLesson = 'all',
  filterMastered = 'all',
  masteredIds = [],
  onToggleMastered,
  onOpenLesson,
}) {
  const [mode, setMode] = useState('dictionary'); // 'dictionary' | 'flashcards' | 'stats'
  const [selectedPos, setSelectedPos] = useState('all');
  const [activeLessonFilter, setActiveLessonFilter] = useState(selectedLesson);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync external searchQuery prop with local state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (val) => {
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleResetFilters = () => {
    handleClearSearch();
    setSelectedPos('all');
    setActiveLessonFilter('all');
  };

  const posList = ['all', 'noun', 'verb', 'adjective', 'pronoun', 'particle', 'adverb', 'prefix'];
  
  // Extract all distinct lesson keys from vocabulary
  const rawLessons = new Set();
  vocabularyList.forEach((item) => {
    if (item.lesson) {
      String(item.lesson)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((l) => rawLessons.add(l.includes('Lesson_') ? l : `Lesson_${l.replace('Lesson ', '')}`));
    }
  });
  const lessons = ['all', ...Array.from(rawLessons)].sort();

  // Run legacy mastered items migration on initial render
  useEffect(() => {
    if (vocabularyList.length > 0 && masteredIds.length > 0) {
      migrateLegacyMasteredItems(vocabularyList, masteredIds);
    }
  }, [vocabularyList, masteredIds]);

  const matchesLessonFilter = (itemLesson, filter) => {
    if (!filter || filter === 'all') return true;
    if (!itemLesson) return false;
    const parts = String(itemLesson)
      .split(',')
      .map((s) => s.trim().replace('Lesson ', 'Lesson_'));
    const normFilter = filter.replace('Lesson ', 'Lesson_');
    return parts.some((p) => p === normFilter || p === normFilter.replace('Lesson_', ''));
  };

  const filteredVocab = vocabularyList.filter((item) => {
    const q = localSearch.trim().toLowerCase();
    if (q) {
      const matchWord = (item.word || '').toLowerCase().includes(q);
      const matchMeaning = (item.meaning || '').toLowerCase().includes(q);
      const matchPos = (item.partOfSpeech || '').toLowerCase().includes(q);
      const matchLesson = (item.lesson || '').toLowerCase().includes(q);
      const matchExample = (
        item.example ||
        item.example_tagalog ||
        item.example_english ||
        item.usage ||
        ''
      ).toLowerCase().includes(q);

      if (!matchWord && !matchMeaning && !matchPos && !matchLesson && !matchExample) {
        return false;
      }
    }

    if (selectedPos !== 'all') {
      const p = (item.partOfSpeech || '').toLowerCase();
      if (!p.includes(selectedPos)) return false;
    }

    // Internal Lesson filter chip
    if (!matchesLessonFilter(item.lesson, activeLessonFilter)) {
      return false;
    }

    // External Lesson filter from drawer
    if (!matchesLessonFilter(item.lesson, selectedLesson)) {
      return false;
    }

    // Mastered filter
    const isMastered = masteredIds.includes(item.id);
    if (filterMastered === 'mastered' && !isMastered) return false;
    if (filterMastered === 'unmastered' && isMastered) return false;

    return true;
  });

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tl-PH';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header & Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            🎴 Vocabulary & Anki SRS Suite
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Expand your Tagalog lexicon with FSRS-5 spaced repetition and categorised dictionary lookup.
          </p>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <Button
            variant={mode === 'dictionary' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMode('dictionary')}
            icon={<span>📚</span>}
          >
            Dictionary
          </Button>
          <Button
            variant={mode === 'flashcards' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMode('flashcards')}
            icon={<span>🧠</span>}
          >
            SRS Flashcards
          </Button>
          <Button
            variant={mode === 'stats' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMode('stats')}
            icon={<span>📊</span>}
          >
            SRS Stats
          </Button>
        </div>
      </div>

      {/* Dictionary Search & Filter Bar */}
      {mode === 'dictionary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          {/* Search Input with Clear Button */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Input
                placeholder="Search Tagalog word, English meaning, examples, or lesson..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                icon="🔍"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Showing {filteredVocab.length} of {vocabularyList.length} words
            </div>
          </div>

          {/* Lesson Filter Chips */}
          {lessons.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filter by Lesson
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {lessons.map((les) => (
                  <FilterChip
                    key={les}
                    label={les === 'all' ? 'All Lessons' : les.replace('_', ' ')}
                    active={activeLessonFilter === les}
                    onClick={() => setActiveLessonFilter(les)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* POS Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Part of Speech
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {posList.map((pos) => (
                <FilterChip
                  key={pos}
                  label={pos === 'all' ? 'All POS' : pos.charAt(0).toUpperCase() + pos.slice(1) + 's'}
                  active={selectedPos === pos}
                  onClick={() => setSelectedPos(pos)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode Content */}
      {mode === 'dictionary' && (
        filteredVocab.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredVocab.map((item) => (
              <VocabularyCard
                key={item.id || item.word}
                vocabItem={item}
                isMastered={masteredIds.includes(item.id)}
                onToggleMastered={onToggleMastered}
                onSpeak={handleSpeak}
                onOpenLesson={onOpenLesson}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <EmptyState
              icon="🔍"
              title="No vocabulary matches found"
              description={
                localSearch
                  ? `No words matched "${localSearch}" with the current filters.`
                  : "No words found for the selected lesson or part of speech."
              }
              actionLabel="Clear Search & Filters"
              onAction={handleResetFilters}
            />
          </div>
        )
      )}

      {mode === 'flashcards' && (
        <SrsSessionView
          vocabularyList={vocabularyList}
          searchQuery={localSearch}
          selectedLesson={activeLessonFilter !== 'all' ? activeLessonFilter : selectedLesson}
          selectedPos={selectedPos}
          filterMastered={filterMastered}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSpeak={handleSpeak}
        />
      )}

      {mode === 'stats' && (
        <SrsStatsView vocabularyList={vocabularyList} />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab="srs"
      />
    </div>
  );
}
