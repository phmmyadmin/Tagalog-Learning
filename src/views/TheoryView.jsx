import React from 'react';
import TheoryCard from '../components/TheoryCard';
import { BookOpen } from 'lucide-react';

export default function TheoryView({ 
  theoryList, 
  searchQuery, 
  selectedCategory, 
  selectedLesson, 
  filterMastered,
  masteredIds,
  onToggleMastered,
  onOpenLesson
}) {
  // Filter logic
  const filteredTheory = theoryList.filter((item) => {
    // Category filter
    if (selectedCategory !== 'all' && item.id !== selectedCategory) {
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

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = item.topic.toLowerCase().includes(q);
      const matchSummary = item.summary && item.summary.toLowerCase().includes(q);
      const matchRules = item.rules && item.rules.some(r => 
        (r.article && r.article.toLowerCase().includes(q)) ||
        (r.target && r.target.toLowerCase().includes(q)) ||
        (r.example_tagalog && r.example_tagalog.toLowerCase().includes(q)) ||
        (r.example_english && r.example_english.toLowerCase().includes(q)) ||
        (r.example && r.example.toLowerCase().includes(q))
      );
      const matchTable = item.table && item.table.some(t =>
        (t.pronoun && t.pronoun.toLowerCase().includes(q)) ||
        (t.word && t.word.toLowerCase().includes(q)) ||
        (t.meaning && t.meaning.toLowerCase().includes(q))
      );

      return matchTopic || matchSummary || matchRules || matchTable;
    }

    return true;
  });

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Page Title & Controls */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>Grammar Theory & Contents</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Master Tagalog grammar rules, word orders, pronouns, ligatures, and possessives.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-cyan" style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem' }}>
            Showing {filteredTheory.length} of {theoryList.length} topics
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredTheory.length === 0 ? (
        <div className="glass-card" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: 'var(--accent-amber)'
          }}>
            🔍
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No grammar topics found
          </h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
            No topics matched your search query or category filters. Try clearing your search bar or adjusting the category filters.
          </p>
        </div>
      ) : (
        /* Render Theory Cards */
        filteredTheory.map((topic, index) => (
          <TheoryCard
            key={topic.id}
            index={index}
            topicData={topic}
            isMastered={masteredIds.includes(topic.id)}
            onToggleMastered={onToggleMastered}
            onOpenLesson={onOpenLesson}
          />
        ))
      )}
    </div>
  );
}
