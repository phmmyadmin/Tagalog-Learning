import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import slideMap from '../data/slideMap.json';

/**
 * TheoryCard Component - Accessible grammar rule card with warm light styling, collapsible sections, speech synthesis, and slides deep linking.
 */
export default function TheoryCard({ topicData, isMastered, onToggleMastered, index = 0, onOpenLesson }) {
  const [isExpanded, setIsExpanded] = useState(!isMastered);
  const [speakingText, setSpeakingText] = useState(null);

  const topicMapping = slideMap.theory?.[topicData.id] || {
    lesson: topicData.lesson,
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
          >
            {isExpanded ? '▲' : '▼'}
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

          {/* Grammar Rules */}
          {topicData.rules && topicData.rules.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Grammar & Syntax Rules</h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                      {title && <strong>{title}: </strong>}
                      {detail && <span>{detail} </span>}
                      {exTagalog && typeof exTagalog === 'string' && (
                        <span style={{ fontStyle: 'italic', color: 'var(--accent-primary)' }}>({exTagalog}{exEnglish ? ` - ${exEnglish}` : ''})</span>
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
