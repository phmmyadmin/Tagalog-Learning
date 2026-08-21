import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { generateAiQuiz } from '../utils/aiQuizGenerator';
import { getAiConfig } from '../utils/aiConfigStore';

export default function AiQuizGeneratorView({
  vocabularyList = [],
  theoryList = [],
  lessons = [],
  onStartQuiz,
  onOpenSettings,
}) {
  const [mode, setMode] = useState('adaptive_srs'); // 'adaptive_srs' | 'lesson' | 'custom_prompt'
  const [selectedLesson, setSelectedLesson] = useState('Lesson_02');
  const [customPrompt, setCustomPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('beginner');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const config = getAiConfig();
  const hasKey = Boolean(config.apiKey || config.proxyUrl);

  const presetPrompts = [
    'Food, dining & ordering at a Filipino restaurant',
    'Directions, transport & navigating the city',
    'Family, relationships & polite greetings (Po/Opo)',
    'Verb conjugations: -um- vs mag- verbs in present tense',
    'Shopping, market numbers & asking for prices',
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
            <Badge variant="primary">Powered by Gemini 2.5 Flash</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Create unlimited, personalized Tagalog quizzes tailored to your SRS weak spots, specific lessons, or custom prompt topics.
          </p>
        </div>

        {!hasKey && (
          <Button variant="warning" size="sm" onClick={onOpenSettings} icon={<span>⚙️</span>}>
            Configure API Key
          </Button>
        )}
      </Card>

      {/* Mode Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Mode 1: Adaptive SRS */}
        <Card
          onClick={() => setMode('adaptive_srs')}
          style={{
            padding: '1.25rem',
            cursor: 'pointer',
            border: mode === 'adaptive_srs' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'adaptive_srs' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              Adaptive SRS Weak-Spots
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Targets words with low stability in FSRS, cards in relearning, and items from your Mistakes Bank.
          </p>
        </Card>

        {/* Mode 2: By Lesson */}
        <Card
          onClick={() => setMode('lesson')}
          style={{
            padding: '1.25rem',
            cursor: 'pointer',
            border: mode === 'lesson' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'lesson' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              Lesson Master Review
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Focuses 100% of questions and grammar explanations on vocabulary & theory from a specific lesson.
          </p>
        </Card>

        {/* Mode 3: Custom Prompt */}
        <Card
          onClick={() => setMode('custom_prompt')}
          style={{
            padding: '1.25rem',
            cursor: 'pointer',
            border: mode === 'custom_prompt' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
            backgroundColor: mode === 'custom_prompt' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✍️</span>
            <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
              Custom Prompt Topic
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Instruct Gemini to generate a quiz on any real-life scenario, conversation topic, or grammar rule.
          </p>
        </Card>
      </div>

      {/* Options Panel */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
          ⚙️ Quiz Options & Configurations
        </h3>

        {/* Mode Specific Inputs */}
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

        {mode === 'custom_prompt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Enter Custom Prompt Directive:
              </label>
              <Input
                type="text"
                placeholder="e.g. Focus on restaurant dining, asking for the bill, and ordering drinks..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            {/* Quick Preset Chips */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Quick Presets:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                {presetPrompts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCustomPrompt(preset)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface-alt)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.775rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Options Grid: Questions Count + Difficulty */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
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
              fontSize: '0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>⚠️ {errorMsg}</span>
            {!hasKey && onOpenSettings && (
              <Button variant="danger" size="sm" onClick={onOpenSettings}>
                Open Settings
              </Button>
            )}
          </div>
        )}

        {/* Action Button */}
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
