import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import ActivityCard from './ActivityCard';

/**
 * ActivityGroupCard Component - Container that groups activities belonging to the same lesson & slide.
 */
export const ActivityGroupCard = ({
  groupKey,
  lesson,
  slide,
  activities = [],
  onOpenLesson,
  savedResults = {},
  completedIds = [],
  onActivityComplete,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const completedCount = activities.filter((act) => completedIds.includes(act.id)).length;
  const totalCount = activities.length;
  const lessonDisplay = lesson ? lesson.replace('_', ' ') : 'General Exercises';

  const handleLessonLinkClick = (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (onOpenLesson && lesson) {
        onOpenLesson(lesson, slide || 1, slide || 1, `${lessonDisplay} - Slide ${slide}`);
      }
    }
  };

  return (
    <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
      {/* Group Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--bg-surface-alt)',
          borderBottom: isExpanded ? '1px solid var(--border-default)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Badge variant="primary">
            {lessonDisplay} {slide ? `· Slide ${slide}` : ''}
          </Badge>

          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {totalCount} {totalCount === 1 ? 'Exercise' : 'Exercises'}
          </span>

          {completedCount > 0 && (
            <Badge variant={completedCount === totalCount ? 'success' : 'amber'}>
              {completedCount}/{totalCount} Completed
            </Badge>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {lesson && slide && (
            <a
              href={`#slides-${lesson}-slide-${slide}`}
              onClick={handleLessonLinkClick}
              style={{
                fontSize: '0.825rem',
                color: 'var(--accent-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                transition: 'all var(--transition-fast)',
              }}
            >
              🖼️ View Slide {slide}
            </a>
          )}

          <Button
            variant={isExpanded ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse exercise group' : 'Expand exercise group'}
            style={{
              fontSize: '0.875rem',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              boxShadow: isExpanded ? 'none' : 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isExpanded ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </span>
            <span style={{ display: 'inline-block', lineHeight: 1 }}>{isExpanded ? 'Hide Exercises' : 'Show Exercises'}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ChevronDown
                size={16}
                aria-hidden="true"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition-fast)',
                }}
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Progress Bar Header Subline */}
      <div style={{ padding: '0 1.5rem', backgroundColor: 'var(--bg-surface-alt)' }}>
        <ProgressBar value={completedCount} max={totalCount} showPercent={false} color="var(--accent-success)" />
      </div>

      {/* Expanded Exercises Body */}
      {isExpanded && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-surface)' }}>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              savedResult={savedResults[activity.id]}
              onOpenLesson={onOpenLesson}
              onComplete={onActivityComplete}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
