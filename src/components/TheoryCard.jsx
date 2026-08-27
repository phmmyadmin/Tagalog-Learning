import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import slideMap from '../data/slideMap.json';
import { playTagalogAudio } from '../utils/aiAudioService';

/**
 * TheoryCard Component - Accessible grammar rule card with warm light styling, collapsible sections, pronoun tables, speech synthesis, and slides deep linking.
 */
export default function TheoryCard({ topicData, isMastered, onToggleMastered, index = 0, onOpenLesson }) {
  const [isExpanded, setIsExpanded] = useState(!isMastered);
  const [speakingText, setSpeakingText] = useState(null);

  const rawLesson = String(topicData.lesson || '').trim();
  const lessonParts = rawLesson.split(',').map((s) => s.trim()).filter(Boolean);
  const primaryLessonRaw = lessonParts[0] || 'Lesson_02';

  let normalizedLessonKey = primaryLessonRaw.replace(/\s+/g, '_');
  if (/^lesson_\d$/i.test(normalizedLessonKey)) {
    normalizedLessonKey = normalizedLessonKey.replace(/^lesson_(\d)$/i, 'Lesson_0$1');
  } else if (/^\d+$/.test(normalizedLessonKey)) {
    normalizedLessonKey = `Lesson_${normalizedLessonKey.padStart(2, '0')}`;
  } else if (!normalizedLessonKey.startsWith('Lesson_') && !normalizedLessonKey.toLowerCase().startsWith('lesson')) {
    normalizedLessonKey = `Lesson_${normalizedLessonKey}`;
  }

  const topicMapping = slideMap.theory?.[topicData.id] || {
    lesson: normalizedLessonKey,
    slide: 1,
    slideEnd: 1,
    label: topicData.topic,
  };

  const handleToggleMastered = () => {
    if (!isMastered) {
      setIsExpanded(false);
    }
    if (onToggleMastered) {
      onToggleMastered(topicData.id);
    }
  };

  const handleSpeak = (text) => {
    setSpeakingText(text);
    playTagalogAudio(text).finally(() => {
      setTimeout(() => setSpeakingText(null), 1000);
    });
  };

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && primaryLessonRaw) {
        onOpenLesson(
          topicMapping.lesson || normalizedLessonKey,
          topicMapping.slide || 1,
          topicMapping.slideEnd || topicMapping.slide || 1,
          topicMapping.label || topicData.topic
        );
      }
    }
  };

  return (
    <Card
      variant={isMastered ? 'alt' : 'default'}
      style={{
        marginBottom: '1.25rem',
        padding: 0,
        borderColor: isMastered ? 'var(--accent-success)' : 'var(--border-default)',
        backgroundColor: isMastered ? 'var(--accent-success-light)' : 'var(--bg-surface)',
      }}
      className="animate-fade-in"
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: isExpanded ? '1px solid var(--border-default)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
          <button
            type="button"
            onClick={handleToggleMastered}
            aria-label={isMastered ? `Mark ${topicData.topic} as unread` : `Mark ${topicData.topic} as mastered`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isMastered ? '✅' : '⚪'}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <Badge variant="primary">
                {(topicMapping.lesson || topicData.lesson || topicData.id).replace('_', ' ')}
              </Badge>

              {isMastered && (
                <Badge variant="success">Mastered</Badge>
              )}
            </div>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
              {topicData.topic}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {topicData.lesson && (
            <a
              href={`#slides-${topicMapping.lesson}-slide-${topicMapping.slide}`}
              onClick={handleLessonLinkClick}
              style={{
                fontSize: '0.85rem',
                color: 'var(--accent-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-alt)',
              }}
            >
              🖼️ Slides {topicMapping.slide}-{topicMapping.slideEnd}
            </a>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse topic content' : 'Expand topic content'}
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <ChevronDown
              size={18}
              aria-hidden="true"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-fast)',
              }}
            />
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary */}
          {topicData.summary && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '4px solid var(--accent-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            >
              {topicData.summary}
            </div>
          )}

          {/* Pronoun / Concept Data Tables (e.g., Nominative Pronouns, Demonstratives) */}
          {topicData.table && topicData.table.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Pronoun Table</h4>
              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                      <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>Pronoun</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>English Meaning</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>Type / Category</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>Contraction / Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topicData.table.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < topicData.table.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>{row.pronoun}</span>
                            <button
                              type="button"
                              onClick={() => handleSpeak(row.pronoun)}
                              aria-label={`Listen to ${row.pronoun}`}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                            >
                              🔊
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>
                          {row.meaning}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                          {row.type || row.plural || '-'}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                          {row.contraction || row.usage || row.polite || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grammar Rules */}
          {topicData.rules && topicData.rules.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Grammar & Syntax Rules</h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topicData.rules.map((rule, idx) => {
                  if (typeof rule === 'string') {
                    return <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{rule}</li>;
                  }

                  const title = rule.name || rule.title || rule.article || rule.order_type || rule.rule || rule.ligature || rule.type || rule.tense;
                  const detail = rule.description || rule.text || rule.target || rule.condition || rule.pattern || rule.singular;
                  const exTagalog = rule.example_tagalog || rule.example;
                  const exEnglish = rule.example_english;

                  return (
                    <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                      <div>
                        {title && <strong>{title}: </strong>}
                        {detail && <span>{detail} </span>}
                        {rule.singular && <span>(Singular: <em>{rule.singular}</em>, Plural: <em>{rule.plural}</em>) </span>}
                        {exTagalog && typeof exTagalog === 'string' && (
                          <span style={{ fontStyle: 'italic', color: 'var(--accent-primary)' }}>({exTagalog}{exEnglish ? ` - ${exEnglish}` : ''})</span>
                        )}
                      </div>

                      {/* Embedded Possessive Pronoun Pairs Table */}
                      {rule.pairs && rule.pairs.length > 0 && (
                        <div style={{ overflowX: 'auto', marginTop: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                              <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                                <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>Pre-Noun Form (with ligature)</th>
                                <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>Post-Noun Form</th>
                                <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>English Meaning</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rule.pairs.map((p, pIdx) => (
                                <tr key={pIdx} style={{ borderBottom: pIdx < rule.pairs.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span>{p.pre}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleSpeak(p.pre)}
                                        aria-label={`Listen to ${p.pre}`}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                                      >
                                        🔊
                                      </button>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span>{p.post}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleSpeak(p.post)}
                                        aria-label={`Listen to ${p.post}`}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                                      >
                                        🔊
                                      </button>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>
                                    {p.meaning}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Formulas / Code Blocks */}
          {topicData.formula && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Formula & Pattern
              </h4>
              <pre
                style={{
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--accent-primary)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  overflowX: 'auto',
                  border: '1px solid var(--border-default)',
                }}
              >
                {topicData.formula}
              </pre>
            </div>
          )}

          {/* Examples */}
          {topicData.examples && topicData.examples.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Examples</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {topicData.examples.map((ex, idx) => {
                  const tagalogText = typeof ex === 'string' ? ex : ex.tagalog || ex.tl;
                  const englishText = typeof ex === 'object' ? ex.english || ex.en : null;

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: 'var(--bg-surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {tagalogText}
                        </span>
                        {tagalogText && (
                          <button
                            type="button"
                            onClick={() => handleSpeak(tagalogText)}
                            aria-label={`Listen to ${tagalogText}`}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              padding: '0.2rem',
                            }}
                          >
                            🔊
                          </button>
                        )}
                      </div>
                      {englishText && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {englishText}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
