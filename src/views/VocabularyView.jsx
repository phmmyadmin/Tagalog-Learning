import React, { useState, useEffect } from 'react';
import VocabularyCard from '../components/VocabularyCard';
import SrsSessionView from './SrsSessionView';
import SrsStatsView from './SrsStatsView';
import SrsSettingsPanel from '../components/SrsSettingsPanel';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { migrateLegacyMasteredItems } from '../utils/srsStore';

export default function VocabularyView({
  vocabularyList = [],
  searchQuery = '',
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

  const posList = ['all', 'noun', 'verb', 'adjective', 'pronoun', 'adverb'];
  const lessons = ['all', ...new Set(vocabularyList.map((item) => item.lesson).filter(Boolean))].sort();

  // Run legacy mastered items migration on initial render
  useEffect(() => {
    if (vocabularyList.length > 0 && masteredIds.length > 0) {
      migrateLegacyMasteredItems(vocabularyList, masteredIds);
    }
  }, [vocabularyList, masteredIds]);

  const filteredVocab = vocabularyList.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchWord = item.word?.toLowerCase().includes(q);
      const matchMeaning = item.meaning?.toLowerCase().includes(q);
      if (!matchWord && !matchMeaning) return false;
    }

    if (selectedPos !== 'all') {
      const p = (item.partOfSpeech || '').toLowerCase();
      if (!p.includes(selectedPos)) return false;
    }

    // Internal Lesson filter chip
    if (activeLessonFilter !== 'all' && item.lesson !== activeLessonFilter && item.lesson !== activeLessonFilter.replace(' ', '_')) {
      return false;
    }

    // External Lesson filter from drawer
    if (selectedLesson !== 'all' && item.lesson !== selectedLesson && item.lesson !== selectedLesson.replace(' ', '_')) {
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

      {/* Lesson Filter Chips + POS Filter Chips (Dictionary Mode) */}
      {mode === 'dictionary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Lesson Chips */}
          {lessons.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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

          {/* POS Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
          <EmptyState
            icon="🎴"
            title="No vocabulary matches found"
            description="Try clearing your search term or selecting 'All POS' to see all words."
          />
        )
      )}

      {mode === 'flashcards' && (
        <SrsSessionView
          vocabularyList={filteredVocab}
          searchQuery={searchQuery}
          selectedLesson={selectedLesson}
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

      {/* SRS Settings Panel Modal */}
      <SrsSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
