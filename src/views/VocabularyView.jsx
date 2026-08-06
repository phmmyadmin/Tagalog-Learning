import React, { useState } from 'react';
import VocabularyCard from '../components/VocabularyCard';
import SrsFlashcard from '../components/SrsFlashcard';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function VocabularyView({
  vocabularyList = [],
  searchQuery = '',
  masteredIds = [],
  onToggleMastered,
  onOpenLesson,
}) {
  const [mode, setMode] = useState('dictionary'); // 'dictionary' | 'flashcards'
  const [selectedPos, setSelectedPos] = useState('all');
  const [srsIndex, setSrsIndex] = useState(0);

  const posList = ['all', 'noun', 'verb', 'adjective', 'pronoun', 'adverb'];

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
    if (srsIndex < filteredVocab.length - 1) {
      setSrsIndex((prev) => prev + 1);
    } else {
      setSrsIndex(0);
    }
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

      {/* POS Filter Chips (For Dictionary Mode) */}
      {mode === 'dictionary' && (
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
            onRateCard={handleRateCard}
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
