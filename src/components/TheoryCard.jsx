import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Info,
  Presentation
} from 'lucide-react';
import slideMap from '../data/slideMap.json';

export default function TheoryCard({ topicData, isMastered, onToggleMastered, index = 0, onOpenLesson }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [speakingText, setSpeakingText] = useState(null);

  const topicMapping = slideMap.theory?.[topicData.id] || {
    lesson: topicData.lesson,
    slide: 1,
    slideEnd: 1,
    label: topicData.topic
  };

  // Audio Speech Synthesis for Tagalog / English
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tl-PH';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && topicData.lesson) {
        onOpenLesson(
          topicMapping.lesson || topicData.lesson,
          topicMapping.slide || 1,
          topicMapping.slideEnd || topicMapping.slide || 1,
          topicMapping.label || topicData.topic
        );
      }
    }
  };

  const staggerClass = `stagger-${(index % 5) + 1}`;

  return (
    <article className={`glass-card animate-fade-in ${staggerClass}`} style={{
      marginBottom: '1.5rem',
      overflow: 'hidden',
      border: isMastered ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
      boxShadow: isMastered ? '0 0 15px rgba(16, 185, 129, 0.08)' : 'var(--shadow-subtle)'
    }}>
      {/* Card Header Bar */}
      <div style={{
        padding: '1.25rem 1.5rem',
        background: isMastered 
          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 24, 38, 0.9) 100%)' 
          : 'rgba(18, 24, 38, 0.95)',
        borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
          <button
            onClick={() => onToggleMastered(topicData.id)}
            aria-label={isMastered ? `Mark ${topicData.topic} as unread` : `Mark ${topicData.topic} as mastered`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
          >
            {isMastered ? (
              <CheckCircle size={24} style={{ color: 'var(--accent-emerald)', filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' }} aria-hidden="true" />
            ) : (
              <Circle size={24} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            )}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{topicData.id}</span>
              
              {topicData.lesson && (
                <a
                  href={`#slides?lesson=${topicData.lesson}&slide=${topicMapping.slide}`}
                  onClick={handleLessonLinkClick}
                  className="badge badge-indigo"
                  style={{
                    fontSize: '0.65rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer'
                  }}
                  title={`Open ${topicData.lesson.replace('_', ' ')} Slide ${topicMapping.slide}`}
                >
                  <Presentation size={11} aria-hidden="true" />
                  {topicData.lesson.replace('_', ' ')} (p. {topicMapping.slide})
                </a>
              )}
              
              {isMastered && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Mastered ✓</span>}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
              {topicData.topic}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${topicData.topic}` : `Expand details for ${topicData.topic}`}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            {isExpanded ? (
              <>Collapse <ChevronUp size={14} aria-hidden="true" /></>
            ) : (
              <>View Details <ChevronDown size={14} aria-hidden="true" /></>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      {isExpanded && (
        <div style={{ padding: '1.5rem' }}>
          
          {/* Summary Box */}
          {topicData.summary && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.05)',
              borderLeft: '3px solid var(--accent-cyan)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              padding: '0.85rem 1.1rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              lineHeight: '1.6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--accent-cyan)', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Info size={14} aria-hidden="true" /> Core Concept
              </div>
              {topicData.summary}
            </div>
          )}

          {/* Rules Section / List */}
          {topicData.rules && Array.isArray(topicData.rules) && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" /> Key Rules & Patterns
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {topicData.rules.map((rule, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      {rule.article && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>{rule.article}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rule.target}</span>
                        </div>
                      )}

                      {rule.order_type && (
                        <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                          {rule.order_type}
                        </div>
                      )}

                      {rule.ligature && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>{rule.ligature}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rule.condition}</span>
                        </div>
                      )}

                      {rule.type && (
                        <div style={{ fontWeight: '600', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          {rule.type}
                        </div>
                      )}

                      {rule.pattern && (
                        <code style={{
                          display: 'block',
                          background: 'rgba(0, 0, 0, 0.4)',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: '#38bdf8',
                          fontFamily: 'monospace',
                          marginBottom: '0.6rem'
                        }}>
                          {rule.pattern}
                        </code>
                      )}

                      {rule.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {rule.description}
                        </p>
                      )}
                    </div>

                    {/* Example Snippet */}
                    {(rule.example_tagalog || rule.example) && (
                      <div style={{
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        borderRadius: '6px',
                        padding: '0.6rem 0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.875rem' }}>
                            {rule.example_tagalog || rule.example}
                          </div>
                          {rule.example_english && (
                            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                              {rule.example_english}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSpeak(rule.example_tagalog || rule.example)}
                          aria-label={`Listen to Tagalog pronunciation of ${rule.example_tagalog || rule.example}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: speakingText === (rule.example_tagalog || rule.example) ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Listen to Tagalog pronunciation"
                        >
                          <Volume2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables Section (e.g. Pronouns, Demonstratives, Possessives) */}
          {topicData.table && Array.isArray(topicData.table) && (
            <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
                textAlign: 'left',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(6, 182, 212, 0.15)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>Tagalog Term</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: '700' }}>English Meaning</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Category / Usage</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Contraction & Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {topicData.table.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#38bdf8' }}>
                        {row.pronoun || row.word}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>
                        {row.meaning}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {row.type || row.plural || row.usage || row.polite || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {row.contraction && (
                            <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>{row.contraction}</span>
                          )}
                          <button
                            onClick={() => handleSpeak(row.pronoun || row.word)}
                            aria-label={`Play audio for ${row.pronoun || row.word}`}
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            <Volume2 size={12} aria-hidden="true" /> Play
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pre vs Post Possessive Pronouns Pair Card Table */}
          {topicData.rules && topicData.rules.some(r => r.pairs) && (
            <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '0.6rem' }}>
                Possessive Pronoun Pair Reference Table
              </div>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.15)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.6rem 1rem', color: 'var(--accent-amber)' }}>Pre-Noun Base Form</th>
                    <th style={{ padding: '0.6rem 1rem', color: 'var(--accent-emerald)' }}>Post-Noun</th>
                    <th style={{ padding: '0.6rem 1rem', color: 'var(--text-primary)' }}>English Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {topicData.rules.find(r => r.pairs).pairs.map((pair, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: '700', color: '#fbbf24' }}>{pair.pre}</td>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: '700', color: '#34d399' }}>{pair.post}</td>
                      <td style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)' }}>{pair.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </article>
  );
}
