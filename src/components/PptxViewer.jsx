import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

import lesson02Slides from '../data/slides/Lesson_02.json';
import lesson03Slides from '../data/slides/Lesson_03.json';
import lesson04Slides from '../data/slides/Lesson_04.json';
import lesson05Slides from '../data/slides/Lesson_05.json';

const slideManifests = {
  Lesson_02: lesson02Slides,
  Lesson_03: lesson03Slides,
  Lesson_04: lesson04Slides,
  Lesson_05: lesson05Slides,
};

/**
 * PptxViewer Component - Accessible modal presentation viewer with slide thumbnails, keyboard controls, and warm light theme.
 */
export default function PptxViewer({
  lessonKey = 'Lesson_02',
  initialSlide = 1,
  conceptLabel = null,
  onClose,
}) {
  const normalizedKey = (lessonKey || '').replace(' ', '_');
  const manifest = slideManifests[normalizedKey];
  const slides = manifest ? manifest.slides : [];

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

  const currentSlide = slides[currentSlideIndex];

  if (!manifest) return null;

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
            <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentSlide.image && (
                <img
                  src={currentSlide.image}
                  alt={`Slide ${currentSlideIndex + 1}: ${currentSlide.title || ''}`}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                  }}
                />
              )}

              {currentSlide.title && (
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', textAlign: 'center', margin: 0 }}>
                  {currentSlide.title}
                </h3>
              )}

              {currentSlide.text && (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {currentSlide.text}
                </p>
              )}
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
