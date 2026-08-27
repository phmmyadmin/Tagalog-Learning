import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { parsePptxFile } from '../utils/pptxBrowserParser';
import { structureLessonWithAi } from '../utils/aiLessonStructurer';
import {
  getUserLessons,
  saveUserLesson,
  deleteUserLesson
} from '../utils/userLessonsManager';
import { getAiConfig } from '../utils/aiConfigStore';

export default function LessonIngestionView({
  onOpenTheory,
  onOpenVocabulary,
  onOpenActivities,
  onStartQuiz,
  onOpenSettings,
}) {
  const [file, setFile] = useState(null);
  const [lessonName, setLessonName] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'parsing' | 'structuring' | 'success' | 'error'
  const [statusDetail, setStatusDetail] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [ingestedResult, setIngestedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLessons, setUserLessons] = useState(() => getUserLessons());
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const config = getAiConfig();
  const hasApiKey = Boolean(config.apiKey || config.proxyUrl);

  const refreshLessons = () => {
    setUserLessons(getUserLessons());
  };

  useEffect(() => {
    window.addEventListener('tagalog_user_lessons_updated', refreshLessons);
    return () => {
      window.removeEventListener('tagalog_user_lessons_updated', refreshLessons);
    };
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith('.pptx')) {
        setErrorMsg('Please select a valid PowerPoint (.pptx) file.');
        return;
      }
      setFile(selected);
      setErrorMsg(null);
      const derivedName = selected.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
      setLessonName(derivedName);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (!dropped.name.endsWith('.pptx')) {
        setErrorMsg('Please drop a valid PowerPoint (.pptx) file.');
        return;
      }
      setFile(dropped);
      setErrorMsg(null);
      const derivedName = dropped.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
      setLessonName(derivedName);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setErrorMsg('Please select a PowerPoint (.pptx) file first.');
      return;
    }
    if (!hasApiKey) {
      setErrorMsg('Google Gemini API Key is required to structure lessons. Please configure it in Settings ⚙️.');
      return;
    }

    try {
      setErrorMsg(null);
      setStatus('parsing');
      setStatusDetail('Reading presentation slides and media with in-browser JSZip parser...');

      const parsed = await parsePptxFile(file);
      setParsedPreview(parsed);

      setStatus('structuring');
      setStatusDetail(
        `Extracted ${parsed.totalSlides} slides. Asking Gemini AI to structure grammar rules, tables, vocabulary, and mastery quiz...`
      );

      const targetLessonName = lessonName.trim() || parsed.lessonName || 'Lesson_Custom';
      const structured = await structureLessonWithAi({
        slideText: parsed.fullText,
        lessonName: targetLessonName,
        customInstructions,
      });

      // Attach parsed slides from PowerPoint archive
      structured.slides = parsed.slides || [];

      // Save to local storage and trigger cloud sync
      saveUserLesson(structured);

      setIngestedResult(structured);
      setStatus('success');
      setStatusDetail('Lesson successfully ingested and ready for study!');
      refreshLessons();
    } catch (err) {
      console.error('Ingestion process error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred during ingestion.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setLessonName('');
    setCustomInstructions('');
    setStatus('idle');
    setStatusDetail('');
    setParsedPreview(null);
    setIngestedResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (lessonIdOrKey) => {
    if (window.confirm('Are you sure you want to delete this imported lesson and all its associated topics/quizzes?')) {
      deleteUserLesson(lessonIdOrKey);
      refreshLessons();
      if (ingestedResult && (ingestedResult.id === lessonIdOrKey || ingestedResult.lessonKey === lessonIdOrKey)) {
        handleReset();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <Card
        variant="alt"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
          border: '1px solid var(--accent-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
              📤 PowerPoint Lesson Ingestion
            </h2>
            <Badge variant="primary">Self-Service AI</Badge>
          </div>
          <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Upload any Tagalog PowerPoint lesson file (<code style={{ fontFamily: 'var(--font-mono)' }}>.pptx</code>). In-browser parsing and Gemini AI will automatically extract grammar theory tables, vocabulary cards, exercises, and an 8-question mastery exam.
          </p>
        </div>

        {onOpenSettings && (
          <Button variant="outline" size="sm" onClick={onOpenSettings}>
            ⚙️ AI Settings
          </Button>
        )}
      </Card>

      {/* API Key Missing Warning */}
      {!hasApiKey && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--accent-warning-light, #FEF3C7)',
            color: 'var(--accent-warning, #B45309)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-warning, #F59E0B)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <strong>Google Gemini API Key is required.</strong> Please configure your free Gemini API Key in Settings to enable automated lesson structuring.
          </div>
          {onOpenSettings && (
            <Button size="sm" variant="primary" onClick={onOpenSettings}>
              Configure Key
            </Button>
          )}
        </div>
      )}

      {/* Main Ingestion Workflow Card */}
      {status !== 'success' ? (
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
            1. Select or Drop PowerPoint File
          </h3>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: isDragOver ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
              cursor: status === 'parsing' || status === 'structuring' ? 'not-allowed' : 'pointer',
              transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pptx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={status === 'parsing' || status === 'structuring'}
            />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
            {file ? (
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--accent-primary)' }}>{file.name}</strong>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Click or drop another file to replace
                </p>
              </div>
            ) : (
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Drop your .pptx file here, or browse
                </strong>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Supports Microsoft PowerPoint (.pptx) presentations
                </p>
              </div>
            )}
          </div>

          {/* Form Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label
                htmlFor="lesson-name-input"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}
              >
                Lesson Identifier / Tag
              </label>
              <input
                id="lesson-name-input"
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="e.g. Lesson_09"
                disabled={status === 'parsing' || status === 'structuring'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="custom-notes-input"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}
              >
                Special Directives for Gemini (Optional)
              </label>
              <input
                id="custom-notes-input"
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Ensure table includes actor-focus affixes (-um-, mag-)"
                disabled={status === 'parsing' || status === 'structuring'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Stepper / Progress display */}
          {(status === 'parsing' || status === 'structuring') && (
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div className="animate-spin" style={{ fontSize: '1.5rem' }}>
                ⏳
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {status === 'parsing' ? 'Stage 1/2: Parsing PowerPoint File...' : 'Stage 2/2: Structuring with Gemini AI...'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {statusDetail}
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--accent-danger-light, #FEE2E2)',
                color: 'var(--accent-danger, #DC2626)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-danger, #EF4444)',
                fontSize: '0.9rem',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {file && (
              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={status === 'parsing' || status === 'structuring'}
              >
                Clear
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleProcess}
              disabled={!file || !hasApiKey || status === 'parsing' || status === 'structuring'}
            >
              {status === 'parsing' || status === 'structuring' ? 'Processing...' : '🚀 Ingest & Structure Lesson'}
            </Button>
          </div>
        </Card>
      ) : (
        /* Success View Card */
        <Card
          style={{
            padding: '1.75rem',
            border: '2px solid var(--accent-success)',
            backgroundColor: 'var(--accent-success-light, #F0FDF4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.8rem' }}>🎉</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
                {ingestedResult?.title || 'Lesson Ingested Successfully!'}
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Identifier: <Badge variant="primary">{ingestedResult?.lessonKey}</Badge> • Ready for immediate practice across all views.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Grammar Theory</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                {ingestedResult?.theory?.length || 0} Topics
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vocabulary Cards</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-success)', marginTop: '0.2rem' }}>
                {ingestedResult?.vocabulary?.length || 0} Terms
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Practice Exercises</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-warning, #D97706)', marginTop: '0.2rem' }}>
                {ingestedResult?.activities?.length || 0} Exercises
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mastery Exam</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                {ingestedResult?.quiz?.questions?.length || 0} Questions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {ingestedResult?.quiz?.questions?.length > 0 && onStartQuiz && (
              <Button
                variant="primary"
                onClick={() => onStartQuiz(ingestedResult.quiz)}
              >
                🎓 Take Lesson Mastery Exam
              </Button>
            )}

            {onOpenTheory && (
              <Button variant="outline" onClick={onOpenTheory}>
                📖 View in Grammar Theory
              </Button>
            )}

            {onOpenVocabulary && (
              <Button variant="outline" onClick={onOpenVocabulary}>
                🗂️ View in Vocabulary
              </Button>
            )}

            {onOpenActivities && (
              <Button variant="outline" onClick={onOpenActivities}>
                ✏️ View in Activities
              </Button>
            )}

            <Button variant="ghost" onClick={handleReset}>
              ➕ Ingest Another Lesson
            </Button>
          </div>
        </Card>
      )}

      {/* Unified Masterclass Lessons Section */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
            🗃️ Active Masterclass Lessons ({userLessons.length})
          </h3>
          <Badge variant="neutral">{userLessons.length} Total Lessons</Badge>
        </div>

        {userLessons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            No lessons loaded. Upload a PowerPoint file above or refresh to load default lessons!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {userLessons.map((les) => (
              <div
                key={les.id || les.lessonKey}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Badge variant="primary">{les.lessonKey}</Badge>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{les.title}</strong>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {les.theory?.length || 0} Theory Topics • {les.vocabulary?.length || 0} Vocab Items • {les.activities?.length || 0} Exercises • {les.quiz?.questions?.length || 0} Quiz Questions
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {les.quiz?.questions?.length > 0 && onStartQuiz && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartQuiz(les.quiz)}
                      icon={<span style={{ fontSize: '0.85rem' }}>🎓</span>}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                      }}
                    >
                      Exam
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(les.id || les.lessonKey)}
                    icon={<span style={{ fontSize: '0.85rem' }}>🗑️</span>}
                    style={{
                      backgroundColor: 'var(--accent-danger-light, #FEE2E2)',
                      color: 'var(--accent-danger, #DC2626)',
                      borderColor: 'transparent',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm, 6px)',
                    }}
                    aria-label={`Delete ${les.title}`}
                    title={`Delete ${les.title}`}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
