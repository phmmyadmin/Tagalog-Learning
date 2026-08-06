import React, { useState, useEffect } from 'react';
import tagalogData from './data/tagalogData.json';
import { Header } from './components/Header';
import { Drawer } from './components/Drawer';
import { DashboardView } from './views/DashboardView';
import TheoryView from './views/TheoryView';
import VocabularyView from './views/VocabularyView';
import ActivitiesView from './views/ActivitiesView';
import QuizzesView from './views/QuizzesView';
import PptxViewer from './components/PptxViewer';
import { recordStudyActivity, calculateStreak } from './utils/streakManager';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [filterMastered, setFilterMastered] = useState('all');

  // Real streak state
  const [streakCount, setStreakCount] = useState(calculateStreak());

  const refreshStreak = () => {
    setStreakCount(calculateStreak());
  };

  useEffect(() => {
    // Record study activity on initial visit
    recordStudyActivity();
    refreshStreak();

    window.addEventListener('tagalog_streak_updated', refreshStreak);
    return () => window.removeEventListener('tagalog_streak_updated', refreshStreak);
  }, []);

  // Mastered state persistence
  const [masteredItems, setMasteredItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_mastered_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // PPTX Viewer modal state
  const [pptxModal, setPptxModal] = useState({ isOpen: false, lesson: 'Lesson_02', initialSlide: 1, conceptLabel: null });

  useEffect(() => {
    try {
      localStorage.setItem('tagalog_mastered_items', JSON.stringify(masteredItems));
    } catch (e) {
      console.error('Failed to save mastered items:', e);
    }
  }, [masteredItems]);

  const toggleMastered = (itemId) => {
    recordStudyActivity();
    setMasteredItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const totalTheory = tagalogData.theory.length;
  const totalVocab = tagalogData.vocabulary.length;
  const totalActivities = tagalogData.activities.length;
  const totalItems = totalTheory + totalVocab;

  const theoryMastered = tagalogData.theory.filter((t) => masteredItems.includes(t.id)).length;
  const vocabMastered = tagalogData.vocabulary.filter((v) => masteredItems.includes(v.id)).length;
  const totalMastered = theoryMastered + vocabMastered;

  const handleOpenSlideViewer = (lessonKey = 'Lesson_02', slide = 1, slideEnd = 1, conceptLabel = null) => {
    const formatted = lessonKey.includes('Lesson_') ? lessonKey : lessonKey.replace('Lesson ', 'Lesson_');
    setPptxModal({ isOpen: true, lesson: formatted, initialSlide: slide, conceptLabel });
  };

  return (
    <div className="app-container">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* TopBar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        masteredCount={totalMastered}
        totalCount={totalItems}
      />

      {/* Collapsible Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedLesson={selectedLesson}
        onSelectLesson={setSelectedLesson}
        filterMastered={filterMastered}
        onSelectFilterMastered={setFilterMastered}
        onOpenSlideViewer={handleOpenSlideViewer}
        activeView={activeTab}
      />

      {/* Main Content Area */}
      <main id="main-content" className="main-content-wrapper">
        <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none', width: '100%' }}>
          <DashboardView
            onNavigate={setActiveTab}
            streakCount={streakCount}
            stats={{
              theoryMastered,
              totalTheory,
              vocabMastered,
              totalVocab,
              activitiesDone: 0,
              totalActivities,
              quizzesCompleted: 0,
              totalQuizzes: 4,
              dueSrsCount: 12,
              mistakesCount: 0,
            }}
          />
        </div>

        <div style={{ display: activeTab === 'theory' ? 'block' : 'none', width: '100%' }}>
          <TheoryView
            theoryList={tagalogData.theory}
            searchQuery={searchQuery}
            selectedCategory="all"
            selectedLesson={selectedLesson}
            filterMastered={filterMastered}
            masteredIds={masteredItems}
            onToggleMastered={toggleMastered}
            onOpenLesson={handleOpenSlideViewer}
          />
        </div>

        <div style={{ display: activeTab === 'vocabulary' ? 'block' : 'none', width: '100%' }}>
          <VocabularyView
            vocabularyList={tagalogData.vocabulary}
            searchQuery={searchQuery}
            onOpenLesson={handleOpenSlideViewer}
          />
        </div>

        <div style={{ display: activeTab === 'activities' ? 'block' : 'none', width: '100%' }}>
          <ActivitiesView
            activitiesList={tagalogData.activities}
            onOpenLesson={handleOpenSlideViewer}
          />
        </div>

        <div style={{ display: activeTab === 'quizzes' ? 'block' : 'none', width: '100%' }}>
          <QuizzesView />
        </div>
      </main>

      {/* PPTX Presentation Modal */}
      {pptxModal.isOpen && (
        <PptxViewer
          lessonKey={pptxModal.lesson}
          initialSlide={pptxModal.initialSlide}
          conceptLabel={pptxModal.conceptLabel}
          onClose={() => setPptxModal({ isOpen: false, lesson: 'Lesson_02', initialSlide: 1, conceptLabel: null })}
        />
      )}
    </div>
  );
}

export default App;
