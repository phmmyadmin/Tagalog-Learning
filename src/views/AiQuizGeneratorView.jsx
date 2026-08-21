import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { generateAiQuiz } from '../utils/aiQuizGenerator';
import { getAiConfig } from '../utils/aiConfigStore';

export default function AiQuizGeneratorView({
  vocabularyList = [],
  theoryList = [],
  lessons = [],
  onStartQuiz,
  onOpenSettings,
}) {
  const [mode, setMode] = useState('custom_prompt'); // default to custom prompt
  const [selectedLesson, setSelectedLesson] = useState('Lesson_02');
  const [customPrompt, setCustomPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('beginner');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const config = getAiConfig();
  const hasKey = Boolean(config.apiKey || config.proxyUrl);

  const presetPrompts = [
    { icon: '🍽️', label: 'Restaurant & food', prompt: 'Food, dining & ordering at a Filipino restaurant' },
    { icon: '🗺️', label: 'Directions & transport', prompt: 'Directions, transport & navigating the city' },
    { icon: '👨‍👩‍👧', label: 'Family & greetings', prompt: 'Family, relationships & polite greetings (Po/Opo)' },
    { icon: '🔤', label: 'Verb conjugations', prompt: 'Verb conjugations: -um- vs mag- verbs in present tense' },
    { icon: '🛒', label: 'Shopping & prices', prompt: 'Shopping, market numbers & asking for prices' },
    { icon: '🏥', label: 'Health & emergency', prompt: 'Health, body parts, feeling sick, visiting a doctor' },
    { icon: '📅', label: 'Time & dates', prompt: 'Days of the week, months, telling time, making appointments' },
  ];

  const handleGenerate = async () => {
    if (!hasKey) {
      setErrorMsg('Google Gemini API Key is required. Please add your key in Settings ⚙️.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const generatedQuiz = await generateAiQuiz({
        mode,
        selectedLesson,
        customPrompt,
        questionCount,
        difficulty,
        vocabularyList,
        theoryList,
      });

      setIsGenerating(false);
      if (onStartQuiz) {
        onStartQuiz(generatedQuiz);
      }
    } catch (err) {
      setIsGenerating(false);
      setErrorMsg(err.message || 'Failed to generate quiz with Gemini AI.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }} className="animate-fade-in">
      {/* Banner */}
      <Card
        variant="alt"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
          border: '1px solid var(--accent-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
              🤖 AI Adaptive Quiz Generator
            </h2>
            <Badge variant="primary">Gemini 3.6 Flash</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Describe qué tipo de quiz quieres y la IA lo genera al instante. También puedes usar modos predefinidos.
          </p>
        </div>

        {!hasKey && (
          <Button variant="secondary" size="sm" onClick={onOpenSettings} icon={<span>⚙️</span>}>
            Configure API Key
          </Button>
        )}
      </Card>

      {/* Custom Prompt Area — ALWAYS VISIBLE AND PROMINENT */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-primary)' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
            ✍️ ¿Qué quieres practicar?
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Escribe libremente lo que quieras como quiz, o selecciona un preset rápido.
          </p>
        </div>

        <textarea
          placeholder="Ejemplo: Quiero un quiz sobre pedir comida en un restaurante filipino, incluyendo frases de cortesía y vocabulario de bebidas..."
          value={customPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            if (mode !== 'custom_prompt') setMode('custom_prompt');
          }}
          rows={3}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface-alt)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            resize: 'vertical',
            minHeight: '80px',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
        />

        {/* Quick Preset Chips */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Presets:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.4rem' }}>
            {presetPrompts.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant={customPrompt === preset.prompt ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setCustomPrompt(preset.prompt);
                  setMode('custom_prompt');
                }}
                icon={<span>{preset.icon}</span>}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Mode Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
        {/* Mode 1: Custom Prompt */}
        <Card
          onClick={() => setMode('custom_prompt')}
          style={{
            padding: '1.15rem',
            cursor: 'pointer',
            border: mode === 'custom_prompt' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'custom_prompt' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem' }}>✍️</span>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              Custom Prompt
            </h3>
            {mode === 'custom_prompt' && <Badge variant="primary">Active</Badge>}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Describe what you want and Gemini creates it.
          </p>
        </Card>

        {/* Mode 2: Adaptive SRS */}
        <Card
          onClick={() => setMode('adaptive_srs')}
          style={{
            padding: '1.15rem',
            cursor: 'pointer',
            border: mode === 'adaptive_srs' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'adaptive_srs' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem' }}>🎯</span>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              SRS Weak-Spots
            </h3>
            {mode === 'adaptive_srs' && <Badge variant="primary">Active</Badge>}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Targets your weakest words from SRS + Mistakes Bank.
          </p>
        </Card>

        {/* Mode 3: By Lesson */}
        <Card
          onClick={() => setMode('lesson')}
          style={{
            padding: '1.15rem',
            cursor: 'pointer',
            border: mode === 'lesson' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'lesson' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem' }}>📖</span>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              Lesson Review
            </h3>
            {mode === 'lesson' && <Badge variant="primary">Active</Badge>}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            100% focused on one specific lesson.
          </p>
        </Card>
      </div>

      {/* Options Panel */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
          ⚙️ Quiz Options
        </h3>

        {/* Lesson Selector (only if lesson mode) */}
        {mode === 'lesson' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Select Lesson:
            </label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface-alt)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              {lessons.filter((l) => l !== 'all').map((les) => (
                <option key={les} value={les}>
                  {les.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Global Options Grid: Questions Count + Difficulty */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Number of Questions:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[5, 10, 15, 20].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant={questionCount === num ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setQuestionCount(num)}
                  style={{ flex: 1 }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Difficulty Level:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <Button
                  key={lvl}
                  type="button"
                  variant={difficulty === lvl ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDifficulty(lvl)}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {lvl}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--accent-danger-light)',
              color: 'var(--accent-danger)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-danger)',
              fontSize: '0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ flex: 1 }}>⚠️ {errorMsg}</span>
            {!hasKey && onOpenSettings && (
              <Button variant="danger" size="sm" onClick={onOpenSettings}>
                Open Settings
              </Button>
            )}
          </div>
        )}

        {/* Generate Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          fullWidth
          icon={<span>{isGenerating ? '⏳' : '✨'}</span>}
        >
          {isGenerating ? 'Gemini AI is generating your quiz...' : 'Generate & Start AI Quiz'}
        </Button>
      </Card>
    </div>
  );
}
