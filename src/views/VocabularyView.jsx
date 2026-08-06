import React, { useState, useEffect } from 'react';
import VocabularyCard from '../components/VocabularyCard';
import SrsFlashcard from '../components/SrsFlashcard';
import { 
  Layers, 
  RotateCw, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Award, 
  RefreshCw, 
  Sparkles,
  BookOpen,
  Zap,
  Volume2,
  LayoutGrid,
  List
} from 'lucide-react';

export default function VocabularyView({ vocabularyList, searchQuery, onOpenLesson }) {
  const [activeSubTab, setActiveSubTab] = useState('dictionary'); // 'dictionary' | 'flashcards'
  const [dictViewMode, setDictViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedPos, setSelectedPos] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState('all');
  
  // Track review statistics for session summary
  const [sessionStats, setSessionStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    totalReviewed: 0
  });

  // Audio Speech Synthesis Handler
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tl-PH';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // Spaced Repetition System (SRS) Deck State & LocalStorage Engine
  // -------------------------------------------------------------
  const [srsDeck, setSrsDeck] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_srs_deck_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse SRS deck', e);
    }
    // Initialize default SRS state for all vocabulary items
    const initial = {};
    vocabularyList.forEach((item) => {
      initial[item.id] = {
        id: item.id,
        interval: 0, // Days
        repetition: 0,
        easeFactor: 2.5,
        dueDate: 0 // 0 means due immediately for initial review
      };
    });
    return initial;
  });

  // Save SRS deck state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tagalog_srs_deck_v1', JSON.stringify(srsDeck));
    } catch (e) {
      console.error('Failed to save SRS deck', e);
    }
  }, [srsDeck]);

  // Extract unique Parts of Speech & Lessons
  const posList = Array.from(new Set(vocabularyList.map((v) => v.partOfSpeech).filter(Boolean)));
  const lessonsList = Array.from(new Set(vocabularyList.map((v) => v.lesson).filter(Boolean)));

  // Filtered Vocabulary for Dictionary View
  const filteredVocabulary = vocabularyList.filter((item) => {
    if (selectedPos !== 'all' && item.partOfSpeech !== selectedPos) return false;
    if (selectedLesson !== 'all' && item.lesson !== selectedLesson) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchWord = item.word.toLowerCase().includes(q);
      const matchMeaning = item.meaning.toLowerCase().includes(q);
      const matchExample = item.example && item.example.toLowerCase().includes(q);
      return matchWord || matchMeaning || matchExample;
    }
    return true;
  });

  // -------------------------------------------------------------
  // SRS Flashcard Queue System
  // -------------------------------------------------------------
  // Active queue of card IDs for the current review session
  const [activeQueue, setActiveQueue] = useState(() => {
    const now = Date.now();
    return vocabularyList
      .filter((item) => {
        const srsData = srsDeck[item.id] || { dueDate: 0 };
        return srsData.dueDate <= now;
      })
      .map((item) => item.id);
  });

  const [initialQueueLength, setInitialQueueLength] = useState(activeQueue.length);
  const [reviewCount, setReviewCount] = useState(0);

  // Sync active queue when switching to flashcards tab if queue is empty
  useEffect(() => {
    if (activeSubTab === 'flashcards' && activeQueue.length === 0) {
      const now = Date.now();
      const newDue = vocabularyList
        .filter((item) => {
          const srsData = srsDeck[item.id] || { dueDate: 0 };
          return srsData.dueDate <= now;
        })
        .map((item) => item.id);
      if (newDue.length > 0) {
        setActiveQueue(newDue);
        setInitialQueueLength(newDue.length);
      }
    }
  }, [activeSubTab]);

  // Current active card is ALWAYS the first item in the active queue
  const currentCardId = activeQueue.length > 0 ? activeQueue[0] : null;
  const currentFlashcard = currentCardId ? vocabularyList.find((v) => v.id === currentCardId) : null;

  // Rating action handler for SRS algorithm
  const handleRateCard = (rating) => {
    if (!currentCardId || !currentFlashcard) return;

    const cardId = currentFlashcard.id;
    const currentSRS = srsDeck[cardId] || { interval: 0, repetition: 0, easeFactor: 2.5 };
    
    let newInterval = 0;
    let newRepetition = currentSRS.repetition;
    let newDueDate = 0;

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    if (rating === 'again') {
      newInterval = 0;
      newRepetition = 0;
      newDueDate = Date.now(); // Due immediately again in current session
    } else if (rating === 'hard') {
      newInterval = 1; // 1 day
      newRepetition += 1;
      newDueDate = Date.now() + 1 * ONE_DAY_MS;
    } else if (rating === 'good') {
      newInterval = currentSRS.interval === 0 ? 3 : Math.round(currentSRS.interval * 2.5); // 3 days initial
      newRepetition += 1;
      newDueDate = Date.now() + newInterval * ONE_DAY_MS;
    } else if (rating === 'easy') {
      newInterval = currentSRS.interval === 0 ? 7 : Math.round(currentSRS.interval * 3.5); // 7 days initial
      newRepetition += 1;
      newDueDate = Date.now() + newInterval * ONE_DAY_MS;
    }

    // Update Session Stats
    setSessionStats((prev) => ({
      ...prev,
      [rating]: prev[rating] + 1,
      totalReviewed: prev.totalReviewed + 1
    }));

    // Update SRS deck state
    setSrsDeck((prev) => ({
      ...prev,
      [cardId]: {
        ...currentSRS,
        interval: newInterval,
        repetition: newRepetition,
        dueDate: newDueDate
      }
    }));

    // QUEUE MANAGEMENT:
    // If 'again', move card to the VERY END of activeQueue
    // If rated hard/good/easy, remove card from activeQueue
    setActiveQueue((prevQueue) => {
      const [front, ...remaining] = prevQueue;
      if (rating === 'again') {
        return [...remaining, front]; // Push to back of queue
      } else {
        return remaining; // Remove from queue
      }
    });

    setReviewCount((prev) => prev + 1);
  };

  // Reset SRS progress
  const handleResetSRS = () => {
    if (window.confirm("Are you sure you want to reset all Spaced Repetition flashcard review history?")) {
      const resetDeck = {};
      const allIds = vocabularyList.map((item) => {
        resetDeck[item.id] = { id: item.id, interval: 0, repetition: 0, easeFactor: 2.5, dueDate: 0 };
        return item.id;
      });
      setSrsDeck(resetDeck);
      setActiveQueue(allIds);
      setInitialQueueLength(allIds.length);
      setReviewCount(0);
      setSessionStats({ again: 0, hard: 0, good: 0, easy: 0, totalReviewed: 0 });
    }
  };

  // Force review all cards
  const handleForceReviewAll = () => {
    const forceDeck = {};
    const allIds = vocabularyList.map((item) => {
      forceDeck[item.id] = { ...(srsDeck[item.id] || {}), dueDate: 0 };
      return item.id;
    });
    setSrsDeck(forceDeck);
    setActiveQueue(allIds);
    setInitialQueueLength(allIds.length);
    setReviewCount(0);
    setSessionStats({ again: 0, hard: 0, good: 0, easy: 0, totalReviewed: 0 });
  };

  // Stats calculation
  const masteredCount = Object.values(srsDeck).filter(s => s.interval >= 3).length;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Top Banner & Sub-Tab Switcher */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Layers size={22} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>Vocabulary & Flashcards</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Master Tagalog lexicon through full dictionary browsing and Spaced Repetition (SRS) flashcard practice.
            </p>
          </div>

          {/* Sub-Tab Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(9, 13, 22, 0.6)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }} role="tablist" aria-label="Vocabulary views">
            <a
              href="#vocabulary?sub=dictionary"
              role="tab"
              aria-selected={activeSubTab === 'dictionary'}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                  setActiveSubTab('dictionary');
                }
              }}
              className={activeSubTab === 'dictionary' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <BookOpen size={15} aria-hidden="true" /> Dictionary ({vocabularyList.length})
            </a>

            <a
              href="#vocabulary?sub=flashcards"
              role="tab"
              aria-selected={activeSubTab === 'flashcards'}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                  setActiveSubTab('flashcards');
                }
              }}
              className={activeSubTab === 'flashcards' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <RotateCw size={15} aria-hidden="true" /> SRS Flashcards ({activeQueue.length} Due)
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Vocabulary Terms</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{vocabularyList.length} Words</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Due For Review Today</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fbbf24' }}>{activeQueue.length} Cards</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>SRS Mastered Words</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#34d399' }}>{masteredCount} / {vocabularyList.length}</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-VIEW 1: DICTIONARY EXPLORER                                */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'dictionary' && (
        <div>
          {/* Filters & View Mode Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Part of Speech Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Part of Speech:</span>
              <button
                onClick={() => setSelectedPos('all')}
                className={selectedPos === 'all' ? 'badge badge-cyan' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
              >
                All
              </button>
              {posList.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={selectedPos === pos ? 'badge badge-cyan' : 'btn-secondary'}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Lesson Filter & View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Lesson:</span>
                <button
                  onClick={() => setSelectedLesson('all')}
                  className={selectedLesson === 'all' ? 'badge badge-indigo' : 'btn-secondary'}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                >
                  All
                </button>
                {lessonsList.map((lesson) => (
                  <button
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    className={selectedLesson === lesson ? 'badge badge-indigo' : 'btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                  >
                    {lesson.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Grid vs Table View Mode */}
              <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(9, 13, 22, 0.6)', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
                <button
                  onClick={() => setDictViewMode('grid')}
                  aria-label="Grid view"
                  className={dictViewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setDictViewMode('table')}
                  aria-label="Table view"
                  className={dictViewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Vocabulary Content: Grid or Table */}
          {filteredVocabulary.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No vocabulary terms found</h3>
              <p style={{ fontSize: '0.875rem' }}>Try clearing your search query or adjusting your filters.</p>
            </div>
          ) : dictViewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {filteredVocabulary.map((item, idx) => {
                const srsInfo = srsDeck[item.id];
                let nextDueDateStr = null;
                if (srsInfo && srsInfo.dueDate > Date.now()) {
                  const diffHours = Math.round((srsInfo.dueDate - Date.now()) / (1000 * 60 * 60));
                  nextDueDateStr = diffHours > 24 ? `in ${Math.round(diffHours / 24)} days` : `in ${diffHours} hours`;
                }

                return (
                  <VocabularyCard
                    key={item.id}
                    vocabItem={item}
                    srsStatus={srsInfo ? { ...srsInfo, nextDueDateStr, isDue: srsInfo.dueDate <= Date.now() } : null}
                    onSpeak={handleSpeak}
                    onOpenLesson={onOpenLesson}
                  />
                );
              })}
            </div>
          ) : (
            /* Table View Mode */
            <div className="glass-card animate-fade-in" style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--accent-cyan)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Tagalog Term</th>
                    <th style={{ padding: '0.75rem 1rem' }}>English Meaning</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Part of Speech</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lesson</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Example Context</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVocabulary.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.word}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>{item.meaning}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{item.partOfSpeech}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {item.lesson ? (
                          <button
                            onClick={() => onOpenLesson && onOpenLesson(item.lesson)}
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            title={`Open ${item.lesson.replace('_', ' ')} Slides`}
                          >
                            {item.lesson.replace('_', ' ')}
                          </button>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.825rem' }}>{item.example || '-'}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleSpeak(item.word)}
                          className="btn-secondary"
                          aria-label={`Listen to pronunciation of ${item.word}`}
                          style={{ padding: '0.3rem 0.5rem', borderRadius: '50%' }}
                        >
                          <Volume2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-VIEW 2: SPACED REPETITION FLASHCARDS                       */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'flashcards' && (
        <div>
          {activeQueue.length > 0 && currentFlashcard ? (
            <SrsFlashcard
              key={`${currentFlashcard.id}-${reviewCount}`}
              currentCard={currentFlashcard}
              totalDue={initialQueueLength}
              currentIndex={initialQueueLength - activeQueue.length}
              onRateCard={handleRateCard}
              onSpeak={handleSpeak}
              onOpenLesson={onOpenLesson}
            />
          ) : (
            /* Completion / Session Summary Screen */
            <div className="glass-card animate-fade-in" style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--accent-emerald)',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle2 size={36} aria-hidden="true" />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                All Flashcard Reviews Complete!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Great job! You have completed all due spaced repetition reviews for today.
              </p>

              {/* Session Recap Panel */}
              {sessionStats.totalReviewed > 0 && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>Again</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{sessionStats.again}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Hard</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{sessionStats.hard}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Good</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{sessionStats.good}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Easy</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{sessionStats.easy}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleForceReviewAll}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                >
                  <RotateCw size={16} aria-hidden="true" /> Extra Review Session (All {vocabularyList.length} Words)
                </button>

                <button
                  onClick={handleResetSRS}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                >
                  <RefreshCw size={16} aria-hidden="true" /> Reset SRS Memory Progress
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
