import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Sparkles,
  Bookmark
} from 'lucide-react';

// Import all generated slide JSON manifests
import lesson02Slides from '../data/slides/Lesson_02.json';
import lesson03Slides from '../data/slides/Lesson_03.json';
import lesson04Slides from '../data/slides/Lesson_04.json';
import lesson05Slides from '../data/slides/Lesson_05.json';

const slideManifests = {
  Lesson_02: lesson02Slides,
  Lesson_03: lesson03Slides,
  Lesson_04: lesson04Slides,
  Lesson_05: lesson05Slides
};

export default function PptxViewer({ 
  lessonId, 
  initialSlide = 1, 
  slideRange = null, 
  conceptLabel = null, 
  onClose 
}) {
  const normalizedLessonId = (lessonId || '').replace(' ', '_');
  const manifest = slideManifests[normalizedLessonId];
  const slides = manifest ? manifest.slides : [];

  const startIdx = Math.max(0, Math.min((initialSlide || 1) - 1, (slides.length || 1) - 1));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startIdx);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);

  // Update slide index if initialSlide prop changes
  useEffect(() => {
    const newIdx = Math.max(0, Math.min((initialSlide || 1) - 1, (slides.length || 1) - 1));
    setCurrentSlideIndex(newIdx);
  }, [initialSlide, lessonId, slides.length]);

  // Keyboard navigation & Escape key
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
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlideIndex(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  // Mobile Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!manifest || slides.length === 0) {
    return (
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Presentation Slide Viewer Error"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(5, 8, 15, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}
      >
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '480px' }}>
          <Presentation size={48} style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            No Presentation Slides Available
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Slides for <strong>{lessonId ? lessonId.replace('_', ' ') : 'this lesson'}</strong> could not be loaded.
          </p>
          <button onClick={onClose} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            Close Viewer
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progressPercent = Math.round(((currentSlideIndex + 1) / slides.length) * 100);

  const rangeStart = slideRange ? slideRange[0] : null;
  const rangeEnd = slideRange ? slideRange[1] : null;
  const isCurrentInTargetRange = rangeStart && rangeEnd && (currentSlideIndex + 1 >= rangeStart && currentSlideIndex + 1 <= rangeEnd);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Presentation Viewer for ${lessonId.replace('_', ' ')}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 8, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none'
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVBAR                                                    */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        padding: '0.85rem 1.5rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Presentation size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                {lessonId.replace('_', ' ')}
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                Slide {currentSlideIndex + 1} / {slides.length}
              </span>
              {conceptLabel && (
                <span className="badge badge-amber" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Bookmark size={10} /> {conceptLabel}
                  {rangeStart && rangeEnd && rangeStart !== rangeEnd ? ` (Slides ${rangeStart}–${rangeEnd})` : rangeStart ? ` (Slide ${rangeStart})` : ''}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.15rem 0 0 0', color: 'var(--text-primary)' }}>
              {currentSlide ? currentSlide.title : `${lessonId.replace('_', ' ')} Slides`}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={toggleFullscreen}
            className="btn-secondary"
            aria-label="Toggle full screen mode"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            title="Full Screen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={onClose}
            className="btn-secondary"
            aria-label="Close presentation viewer"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#f43f5e' }}
          >
            <X size={18} /> Close (Esc)
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)' }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: isCurrentInTargetRange
            ? 'linear-gradient(90deg, var(--accent-amber) 0%, var(--accent-cyan) 100%)'
            : 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)',
          transition: 'width 0.25s ease'
        }} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN STAGE / SLIDE CONTENT                                    */}
      {/* ------------------------------------------------------------- */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Previous Slide Button */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentSlideIndex === 0}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            left: '1.5rem',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSlideIndex === 0 ? 0.3 : 1,
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* 16:9 Slide Stage */}
        <div
          className="glass-card animate-fade-in"
          key={currentSlideIndex}
          style={{
            width: '100%',
            maxWidth: '1020px',
            aspectRatio: '16/9',
            maxHeight: 'calc(100vh - 230px)',
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            border: isCurrentInTargetRange
              ? '1.5px solid var(--accent-amber)'
              : '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: isCurrentInTargetRange
              ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.2)'
              : '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.1)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflowY: 'auto'
          }}
        >
          {/* Slide Header */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
              {isCurrentInTargetRange && (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  Target Concept Slide ✓
                </span>
              )}
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#38bdf8',
              lineHeight: '1.3',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {currentSlide ? currentSlide.title : ''}
            </h2>
          </div>

          {/* Slide Body / Paragraphs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            {currentSlide && currentSlide.paragraphs && currentSlide.paragraphs.length > 0 ? (
              currentSlide.paragraphs.map((p, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: p.isBullet ? '0.4rem 0.75rem' : '0.2rem 0',
                    background: p.isBullet ? 'rgba(6, 182, 212, 0.06)' : 'transparent',
                    borderRadius: p.isBullet ? 'var(--radius-sm)' : '0',
                    borderLeft: p.isBullet ? '3px solid var(--accent-cyan)' : 'none'
                  }}
                >
                  {p.isBullet && (
                    <Sparkles size={16} style={{ color: 'var(--accent-amber)', marginTop: '0.25rem', flexShrink: 0 }} />
                  )}
                  <span style={{ fontWeight: p.isBullet ? '600' : '400' }}>
                    {p.text}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> (Slide title visual layout)
              </div>
            )}

            {/* Embedded Images */}
            {currentSlide && currentSlide.images && currentSlide.images.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {currentSlide.images.map((imgSrc, imgIdx) => (
                  <img
                    key={imgIdx}
                    src={imgSrc}
                    alt={`Slide ${currentSlideIndex + 1} Illustration ${imgIdx + 1}`}
                    style={{
                      maxHeight: '180px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-subtle)',
                      objectFit: 'contain'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>Tagalog Master • Presentation Series</span>
            <span>{lessonId.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Next Slide Button */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlideIndex === slides.length - 1}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            right: '1.5rem',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentSlideIndex === slides.length - 1 ? 0.3 : 1,
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM THUMBNAIL STRIP & CONTROLS                             */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        padding: '0.75rem 1.5rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Navigation Indicator */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Slide <strong style={{ color: 'var(--accent-cyan)' }}>{currentSlideIndex + 1}</strong> of {slides.length}
        </div>

        {/* Horizontal Thumbnails Bar */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          maxWidth: '650px',
          padding: '0.2rem 0'
        }}>
          {slides.map((slide, sIdx) => {
            const slideNum = sIdx + 1;
            const isActive = sIdx === currentSlideIndex;
            const isInRange = rangeStart && rangeEnd && (slideNum >= rangeStart && slideNum <= rangeEnd);

            let bg = 'rgba(255, 255, 255, 0.08)';
            let border = '1px solid transparent';
            let color = 'var(--text-secondary)';

            if (isActive) {
              bg = 'var(--accent-cyan)';
              border = '1px solid #38bdf8';
              color = '#090d16';
            } else if (isInRange) {
              bg = 'rgba(245, 158, 11, 0.2)';
              border = '1px solid var(--accent-amber)';
              color = 'var(--accent-amber)';
            }

            return (
              <button
                key={sIdx}
                onClick={() => setCurrentSlideIndex(sIdx)}
                aria-label={`Jump to slide ${slideNum}: ${slide.title}`}
                style={{
                  minWidth: '34px',
                  height: '30px',
                  borderRadius: '4px',
                  background: bg,
                  color,
                  border,
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {slideNum}
              </button>
            );
          })}
        </div>

        {/* Hints */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
          <span>Use ← → keys or swipe</span>
        </div>
      </div>
    </div>
  );
}
