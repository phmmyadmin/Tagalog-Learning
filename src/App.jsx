import React, { useState, useEffect } from 'react';
import { getMergedLessonData } from './utils/userLessonsManager';
import { Header } from './components/Header';
import { Drawer } from './components/Drawer';
import { DashboardView } from './views/DashboardView';
import TheoryView from './views/TheoryView';
import VocabularyView from './views/VocabularyView';
import ActivitiesView from './views/ActivitiesView';
import QuizzesView from './views/QuizzesView';
import LessonIngestionView from './views/LessonIngestionView';
import PptxViewer from './components/PptxViewer';
import { SettingsModal } from './components/SettingsModal';
import { recordStudyActivity, calculateStreak } from './utils/streakManager';
import { autoPushIfLoggedIn, pullProgressFromCloud, pushProgressToCloud } from './utils/cloudSyncManager';

const VALID_TABS = ['dashboard', 'theory', 'vocabulary', 'activities', 'quizzes', 'ingest'];

const getTabFromHash = () => {
  if (typeof window === 'undefined') return 'dashboard';
  const raw = window.location.hash.replace('#', '').split('?')[0].split('-')[0];
  return VALID_TABS.includes(raw) ? raw : 'dashboard';
};

export function App() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromHash());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [filterMastered, setFilterMastered] = useState('all');

  // Dynamic merged lesson data (built-in + user-uploaded lessons)
  const [lessonData, setLessonData] = useState(() => getMergedLessonData());

  const setActiveTab = (tab) => {
    if (VALID_TABS.includes(tab)) {
      setActiveTabState(tab);
      if (window.location.hash !== `#${tab}`) {
        window.history.pushState(null, '', `#${tab}`);
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const currentTab = getTabFromHash();
      setActiveTabState(currentTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Real streak state
  const [streakCount, setStreakCount] = useState(calculateStreak());

  const refreshStreak = () => {
    setStreakCount(calculateStreak());
  };

  useEffect(() => {
    // Record study activity on initial visit
    recordStudyActivity();
    refreshStreak();

    // Perform initial cloud pull on startup
    pullProgressFromCloud().then((merged) => {
      if (merged?.masteredItems) {
        setMasteredItems(merged.masteredItems);
      }
      refreshStreak();
    }).catch((e) => {
      console.warn('Initial cloud pull skipped:', e.message);
    });

    const handleCloudSyncCompleted = () => {
      try {
        const saved = localStorage.getItem('tagalog_mastered_items');
        if (saved) setMasteredItems(JSON.parse(saved));
      } catch {}
      setLessonData(getMergedLessonData());
      refreshStreak();
    };

    const handleUserLessonsUpdated = () => {
      setLessonData(getMergedLessonData());
    };

    window.addEventListener('tagalog_streak_updated', refreshStreak);
    window.addEventListener('tagalog_cloud_sync_completed', handleCloudSyncCompleted);
    window.addEventListener('tagalog_user_lessons_updated', handleUserLessonsUpdated);
    return () => {
      window.removeEventListener('tagalog_streak_updated', refreshStreak);
      window.removeEventListener('tagalog_cloud_sync_completed', handleCloudSyncCompleted);
      window.removeEventListener('tagalog_user_lessons_updated', handleUserLessonsUpdated);
    };
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

  const toggleMastered = async (itemId) => {
    recordStudyActivity();
    setMasteredItems((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      try {
        localStorage.setItem('tagalog_mastered_items', JSON.stringify(next));
      } catch (e) {}
      pushProgressToCloud().catch(() => {});
      return next;
    });
  };

  const totalTheory = lessonData.theory.length;
  const totalVocab = lessonData.vocabulary.length;
  const totalActivities = lessonData.activities.length;
  const totalItems = totalTheory + totalVocab;

  const theoryMastered = lessonData.theory.filter((t) => masteredItems.includes(t.id)).length;
  const vocabMastered = lessonData.vocabulary.filter((v) => masteredItems.includes(v.id)).length;
  const totalMastered = theoryMastered + vocabMastered;

  const handleOpenSlideViewer = (lessonKey = 'Lesson_02', slide = 1, slideEnd = 1, conceptLabel = null) => {
    const formatted = lessonKey.includes('Lesson_') ? lessonKey : lessonKey.replace('Lesson ', 'Lesson_');
    setPptxModal({ isOpen: true, lesson: formatted, initialSlide: slide, conceptLabel });
  };

  // Dynamic stats from localStorage
  const getDynamicStats = () => {
    let activitiesDone = 0;
    try {
      const savedAct = localStorage.getItem('tagalog_activity_results_v1');
      if (savedAct) {
        activitiesDone = Object.values(JSON.parse(savedAct)).filter((r) => r && r.isCorrect).length;
      }
    } catch (e) {}

    let mistakesCount = 0;
    try {
      const savedBank = localStorage.getItem('tagalog_mistakes_bank_v1');
      if (savedBank) {
        mistakesCount = JSON.parse(savedBank).length;
      }
    } catch (e) {}

    let quizzesCompleted = 0;
    try {
      const savedQuiz = localStorage.getItem('tagalog_quiz_history_v1');
      if (savedQuiz) {
        quizzesCompleted = JSON.parse(savedQuiz).length;
      }
    } catch (e) {}

    return { activitiesDone, mistakesCount, quizzesCompleted };
  };

  const availableLessons = lessonData.lessons;
  const dynamicStats = getDynamicStats();

  const handleMarkLessonMastered = (lessonKey) => {
    recordStudyActivity();
    const normLesson = lessonKey.includes('Lesson_') ? lessonKey : lessonKey.replace('Lesson ', 'Lesson_');
    const theoryIds = lessonData.theory
      .filter((t) => t.lesson === normLesson || t.lesson === normLesson.replace('_', ' '))
      .map((t) => t.id);
    const vocabIds = lessonData.vocabulary
      .filter((v) => v.lesson === normLesson || v.lesson === normLesson.replace('_', ' '))
      .map((v) => v.id);

    const lessonTag = `LESSON_MASTERED_${normLesson}`;

    setMasteredItems((prev) => {
      const next = Array.from(new Set([...prev, ...theoryIds, ...vocabIds, lessonTag]));
      try {
        localStorage.setItem('tagalog_mastered_items', JSON.stringify(next));
      } catch (e) {}
      pushProgressToCloud().catch(() => {});
      return next;
    });
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
        onOpenSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        masteredCount={totalMastered}
        totalCount={totalItems}
      />

      {/* Collapsible Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lessons={availableLessons}
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
              activitiesDone: dynamicStats.activitiesDone,
              totalActivities,
              quizzesCompleted: dynamicStats.quizzesCompleted,
              totalQuizzes: 4,
              dueSrsCount: totalVocab - vocabMastered,
              mistakesCount: dynamicStats.mistakesCount,
            }}
          />
        </div>

        <div style={{ display: activeTab === 'theory' ? 'block' : 'none', width: '100%' }}>
          <TheoryView
            theoryList={lessonData.theory}
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
            vocabularyList={lessonData.vocabulary}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLesson={selectedLesson}
            filterMastered={filterMastered}
            masteredIds={masteredItems}
            onToggleMastered={toggleMastered}
            onOpenLesson={handleOpenSlideViewer}
          />
        </div>

        <div style={{ display: activeTab === 'activities' ? 'block' : 'none', width: '100%' }}>
          <ActivitiesView
            activitiesList={lessonData.activities}
            searchQuery={searchQuery}
            selectedLesson={selectedLesson}
            onOpenLesson={handleOpenSlideViewer}
          />
        </div>

        <div style={{ display: activeTab === 'quizzes' ? 'block' : 'none', width: '100%' }}>
          <QuizzesView
            vocabularyList={lessonData.vocabulary}
            theoryList={lessonData.theory}
            lessons={availableLessons}
            masteredItems={masteredItems}
            onMarkLessonMastered={handleMarkLessonMastered}
          />
        </div>

        <div style={{ display: activeTab === 'ingest' ? 'block' : 'none', width: '100%' }}>
          <LessonIngestionView
            onOpenTheory={() => setActiveTab('theory')}
            onOpenVocabulary={() => setActiveTab('vocabulary')}
            onOpenActivities={() => setActiveTab('activities')}
            onStartQuiz={(quiz) => {
              setActiveTab('quizzes');
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
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

      {/* Unified Settings & Cloud Sync Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
