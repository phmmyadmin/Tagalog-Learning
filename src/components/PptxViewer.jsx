import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

import { getUserLessons } from '../utils/userLessonsManager';

import lesson02Slides from '../data/slides/Lesson_02.json';
import lesson03Slides from '../data/slides/Lesson_03.json';
import lesson04Slides from '../data/slides/Lesson_04.json';
import lesson05Slides from '../data/slides/Lesson_05.json';
import lesson06Slides from '../data/slides/Lesson_06.json';
import lesson07Slides from '../data/slides/Lesson_07.json';
import lesson08Slides from '../data/slides/Lesson_08.json';

const slideManifests = {
  Lesson_02: lesson02Slides,
  Lesson_03: lesson03Slides,
  Lesson_04: lesson04Slides,
  Lesson_05: lesson05Slides,
  Lesson_06: lesson06Slides,
  Lesson_07: lesson07Slides,
  Lesson_08: lesson08Slides,
};

/**
 * Builds dynamic presentation slides for custom or imported lessons without static JSON.
 */
function buildDynamicSlidesForLesson(lesson) {
  if (!lesson) return [];
  const slides = [];

  // Slide 1: Title & Overview
  slides.push({
    title: lesson.title || lesson.lessonKey?.replace('_', ' ') || 'Lesson Overview',
    paragraphs: [
      { text: lesson.summary || 'Tagalog Masterclass Module', isBullet: false },
      { text: `Theory Topics: ${lesson.theory?.length || 0}`, isBullet: true },
      { text: `Vocabulary Terms: ${lesson.vocabulary?.length || 0}`, isBullet: true },
      { text: `Practice Exercises: ${lesson.activities?.length || 0}`, isBullet: true },
      { text: `Mastery Exam: ${lesson.quiz?.questions?.length || 0} questions`, isBullet: true },
    ],
  });

  // Theory Slides
  if (Array.isArray(lesson.theory)) {
    lesson.theory.forEach((t, idx) => {
      const paras = [];
      if (t.summary) paras.push({ text: t.summary, isBullet: false });
      if (Array.isArray(t.rules)) {
        t.rules.forEach((r) => {
          if (r.pattern) paras.push({ text: `Pattern: ${r.pattern} — ${r.description || ''}`, isBullet: true });
          if (r.example_tagalog) paras.push({ text: `Example: ${r.example_tagalog} (${r.example_english || ''})`, isBullet: true });
        });
      }
      if (Array.isArray(t.table)) {
        t.table.forEach((row) => {
          const word = row.tagalog || row.filipino || row.term || row.word || row.pronoun;
          const meaning = row.english || row.meaning || row.translation || '';
          if (word) paras.push({ text: `${word} ➔ ${meaning}`, isBullet: true });
        });
      }
      slides.push({
        title: `Topic ${idx + 1}: ${t.topic || 'Grammar Rule'}`,
        paragraphs: paras.length > 0 ? paras : [{ text: 'Grammar structure and usage details.', isBullet: false }],
      });
    });
  }

  // Vocabulary Slide
  if (Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0) {
    slides.push({
      title: 'Vocabulary & Key Expressions',
      paragraphs: lesson.vocabulary.slice(0, 15).map((v) => ({
        text: `${v.word} (${v.partOfSpeech || 'vocab'}): ${v.meaning || v.translation}${v.example ? ` — "${v.example}"` : ''}`,
        isBullet: true,
      })),
    });
  }

  // Exercises Slide
  if (Array.isArray(lesson.activities) && lesson.activities.length > 0) {
    slides.push({
      title: 'Practice Exercises & Self-Check',
      paragraphs: lesson.activities.slice(0, 8).map((a, i) => ({
        text: `Ex ${i + 1}: ${a.prompt || a.sentence || ''} (Answer: ${a.correctAnswer || a.target || '✓'})`,
        isBullet: true,
      })),
    });
  }

  return slides;
}

/**
 * PptxViewer Component - Accessible modal presentation viewer with slide thumbnails, keyboard controls, dynamic custom lesson slides, and warm light theme.
 */
export default function PptxViewer({
  lessonKey = 'Lesson_02',
  initialSlide = 1,
  conceptLabel = null,
  onClose,
}) {
  const rawKey = String(lessonKey || '').split(',')[0].trim();
  let normalizedKey = rawKey.replace(/\s+/g, '_');
  if (/^lesson_\d$/i.test(normalizedKey)) {
    normalizedKey = normalizedKey.replace(/^lesson_(\d)$/i, 'Lesson_0$1');
  } else if (/^\d+$/.test(normalizedKey)) {
    normalizedKey = `Lesson_${normalizedKey.padStart(2, '0')}`;
  } else if (!normalizedKey.startsWith('Lesson_') && !normalizedKey.toLowerCase().startsWith('lesson')) {
    normalizedKey = `Lesson_${normalizedKey}`;
  }

  // 1. Check static manifests (case-insensitive lookup)
  const manifestKey = Object.keys(slideManifests).find((k) => k.toLowerCase() === normalizedKey.toLowerCase());
  const staticManifest = manifestKey ? slideManifests[manifestKey] : null;

  // 2. Check dynamic lessons in userLessonsManager
  let dynamicSlides = [];
  if (!staticManifest) {
    const userLessons = getUserLessons();
    const userLesson = userLessons.find((l) => {
      const lk = String(l.lessonKey || l.id || '').replace(/\s+/g, '_').toLowerCase();
      const normLower = normalizedKey.toLowerCase();
      return lk === normLower || lk.includes(normLower) || normLower.includes(lk);
    });

    if (userLesson) {
      if (Array.isArray(userLesson.slides) && userLesson.slides.length > 0) {
        dynamicSlides = userLesson.slides;
      } else {
        dynamicSlides = buildDynamicSlidesForLesson(userLesson);
      }
    }
  }

  const slides = staticManifest ? staticManifest.slides : (dynamicSlides.length > 0 ? dynamicSlides : [
    {
      title: normalizedKey.replace('_', ' '),
      paragraphs: [
        { text: 'Presentation slide deck for this module.', isBullet: false },
        { text: 'Use the navigation controls below to explore lessons and grammar rules.', isBullet: true },
      ],
    }
  ]);

  const startIdx = Math.max(0, Math.min((initialSlide || 1) - 1, (slides.length || 1) - 1));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startIdx);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Presentation Slides: ${normalizedKey.replace('_', ' ')}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-overlay)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <Card
        ref={containerRef}
        variant="default"
        style={{
          width: '900px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface-alt)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="primary">🖼️ {normalizedKey.replace('_', ' ')}</Badge>
            {conceptLabel && <Badge variant="default">{conceptLabel}</Badge>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose} ariaLabel="Close Presentation Viewer">
              ✕
            </Button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-surface)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto',
            minHeight: '360px',
          }}
        >
          {currentSlide ? (
            <div style={{ width: '100%', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title */}
              {currentSlide.title && (
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', textAlign: 'left', margin: 0, fontWeight: 700, borderBottom: '2px solid var(--border-default)', paddingBottom: '0.5rem' }}>
                  {currentSlide.title}
                </h3>
              )}

              {/* Images */}
              {currentSlide.images && currentSlide.images.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', alignItems: 'center' }}>
                  {currentSlide.images.map((imgSrc, imgIdx) => (
                    <img
                      key={imgIdx}
                      src={imgSrc}
                      alt={`Slide ${currentSlideIndex + 1} Image ${imgIdx + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '360px',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)',
                      }}
                    />
                  ))}
                </div>
              ) : currentSlide.image ? (
                <img
                  src={currentSlide.image}
                  alt={`Slide ${currentSlideIndex + 1}: ${currentSlide.title || ''}`}
                  style={{
                    width: '100%',
                    maxHeight: '360px',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                  }}
                />
              ) : null}

              {/* Paragraphs */}
              {currentSlide.paragraphs && currentSlide.paragraphs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
                  {currentSlide.paragraphs.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        fontSize: '0.975rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6,
                        paddingLeft: p.isBullet ? '1rem' : 0,
                        backgroundColor: p.isBullet ? 'transparent' : 'var(--bg-surface-alt)',
                        padding: p.isBullet ? '0.2rem 0.5rem' : '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: p.isBullet ? 'none' : '1px solid var(--border-default)',
                      }}
                    >
                      {p.isBullet && <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>•</span>}
                      <span style={{ flex: 1 }}>{p.text}</span>
                    </div>
                  ))}
                </div>
              ) : currentSlide.text ? (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {currentSlide.text}
                </p>
              ) : null}
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>No slide content available</span>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <Button
            variant="secondary"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
          >
            ← Previous Slide
          </Button>

          <div style={{ flex: 1, maxWidth: '280px' }}>
            <ProgressBar
              value={currentSlideIndex + 1}
              max={slides.length}
              showPercent={false}
              color="var(--accent-primary)"
            />
          </div>

          <Button
            variant="primary"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          >
            Next Slide →
          </Button>
        </div>
      </Card>
    </div>
  );
}
