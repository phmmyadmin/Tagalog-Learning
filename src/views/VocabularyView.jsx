import React, { useState, useEffect } from 'react';
import VocabularyCard from '../components/VocabularyCard';
import SrsFlashcard from '../components/SrsFlashcard';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function VocabularyView({
  vocabularyList = [],
  searchQuery = '',
  selectedLesson = 'all',
  filterMastered = 'all',
  masteredIds = [],
  onToggleMastered,
  onOpenLesson,
}) {
  const [mode, setMode] = useState('dictionary'); // 'dictionary' | 'flashcards'
  const [selectedPos, setSelectedPos] = useState('all');
  const [activeLessonFilter, setActiveLessonFilter] = useState(selectedLesson);
  const [srsIndex, setSrsIndex] = useState(0);
  const [historyStack, setHistoryStack] = useState([]);

  const posList = ['all', 'noun', 'verb', 'adjective', 'pronoun', 'adverb'];
  const lessons = ['all', ...new Set(vocabularyList.map((item) => item.lesson).filter(Boolean))].sort();

  // Reset SRS index & history when filters change
  useEffect(() => {
    setSrsIndex(0);
    setHistoryStack([]);
  }, [searchQuery, selectedPos, activeLessonFilter, selectedLesson, filterMastered]);

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

  const handleRateCard = (rating) => {
    const currentCard = filteredVocab[srsIndex];
    if (!currentCard) return;

    const wasMasteredBefore = masteredIds.includes(currentCard.id);
    let newlyMastered = false;

    // Automatically mark as mastered in vocabulary list when rated "easy"
    if (rating === 'easy') {
      if (!wasMasteredBefore && onToggleMastered) {
        onToggleMastered(currentCard.id);
        newlyMastered = true;
      }
    }

    setHistoryStack((prev) => [
      ...prev,
      {
        index: srsIndex,
        cardId: currentCard.id,
        newlyMastered,
        rating,
      },
    ]);

    if (srsIndex < filteredVocab.length - 1) {
      setSrsIndex((prev) => prev + 1);
    } else {
      setSrsIndex(0);
    }
  };

  const handleUndoCard = () => {
    if (historyStack.length === 0) return;

    const lastState = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));

    // Revert mastered status if easy rating newly marked it as mastered
    if (lastState.newlyMastered && masteredIds.includes(lastState.cardId) && onToggleMastered) {
      onToggleMastered(lastState.cardId);
    }

    setSrsIndex(lastState.index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header & Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            🎴 Vocabulary & Flashcards
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Expand your Tagalog lexicon with spaced repetition and categorised dictionary lookup.
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
        </div>
      </div>

      {/* Lesson Filter Chips + POS Filter Chips */}
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
      {mode === 'dictionary' ? (
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
      ) : (
        /* Flashcards SRS Mode */
        filteredVocab.length > 0 ? (
          <SrsFlashcard
            currentCard={filteredVocab[srsIndex]}
            totalDue={filteredVocab.length}
            currentIndex={srsIndex}
            isMastered={masteredIds.includes(filteredVocab[srsIndex]?.id)}
            canUndo={historyStack.length > 0}
            onRateCard={handleRateCard}
            onUndoCard={handleUndoCard}
            onSpeak={handleSpeak}
          />
        ) : (
          <EmptyState
            icon="🎉"
            title="All caught up!"
            description="No due flashcards right now. Great job!"
          />
        )
      )}
    </div>
  );
}
