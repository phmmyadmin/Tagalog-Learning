import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TheoryView from './views/TheoryView';
import VocabularyView from './views/VocabularyView';
import ActivitiesView from './views/ActivitiesView';
import QuizzesView from './views/QuizzesView';
import PptxViewer from './components/PptxViewer';
import tagalogData from './data/tagalogData.json';

export default function App() {
  // Parse URL hash for view, category, lesson, slide, and status query parameters
  const parseHash = () => {
    const rawHash = window.location.hash.replace('#', '');
    const [viewPart, queryPart] = rawHash.split('?');
    const params = new URLSearchParams(queryPart || '');

    const isSlides = viewPart?.toLowerCase() === 'slides';
    const view = ['theory', 'vocabulary', 'activities', 'quizzes', 'slides'].includes(viewPart?.toLowerCase())
      ? (isSlides ? 'theory' : viewPart.toLowerCase())
      : 'theory';

    const slidesLesson = isSlides ? params.get('lesson') : null;
    const slidesNum = isSlides ? parseInt(params.get('slide') || '1', 10) : 1;

    return {
      view,
      category: params.get('category') || 'all',
      lesson: params.get('lesson') || 'all',
      status: params.get('status') || 'all',
      slidesState: slidesLesson ? { lesson: slidesLesson, slide: slidesNum, slideEnd: slidesNum, label: null } : null
    };
  };

  const initialParsed = parseHash();
  const [activeView, setActiveView] = useState(initialParsed.view);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialParsed.category);
  const [selectedLesson, setSelectedLesson] = useState(initialParsed.lesson);
  const [filterMastered, setFilterMastered] = useState(initialParsed.status);
  const [viewingSlides, setViewingSlides] = useState(initialParsed.slidesState);

  const handleOpenLesson = (lesson, slide = 1, slideEnd = null, label = null) => {
    setViewingSlides({
      lesson,
      slide: slide || 1,
      slideEnd: slideEnd || slide || 1,
      label
    });
  };

  // Sync state to URL hash
  const handleViewChange = (view) => {
    setActiveView(view);
    window.location.hash = view;
  };

  // Sync browser back/forward buttons and new tab deep links
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash();
      setActiveView(parsed.view);
      setSelectedCategory(parsed.category);
      setSelectedLesson(parsed.lesson);
      setFilterMastered(parsed.status);
      if (parsed.slidesState) {
        setViewingSlides(parsed.slidesState);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mastered topics persistence in localStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tagalog_mastered_topics');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tagalog_mastered_topics', JSON.stringify(masteredIds));
    } catch (e) {
      console.error('Failed to save mastered topics to localStorage', e);
    }
  }, [masteredIds]);

  const handleToggleMastered = (id) => {
    setMasteredIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const theoryList = tagalogData.theory || [];
  const vocabularyList = tagalogData.vocabulary || [];
  const activitiesList = tagalogData.activities || [];
  
  // Extract unique lessons for filtering
  const lessonsList = Array.from(new Set(theoryList.map((t) => t.lesson).filter(Boolean)));

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={handleViewChange}
        masteredCount={masteredIds.length}
        totalTopics={theoryList.length}
      />

      {/* Main Container */}
      <main className="main-content-wrapper" id="main-content">
        {/* Sidebar Navigation & Filters (shown in theory view) */}
        <div style={{ display: activeView === 'theory' ? 'block' : 'none' }}>
          <Sidebar
            categories={theoryList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            lessonsList={lessonsList}
            filterMastered={filterMastered}
            setFilterMastered={setFilterMastered}
            masteredCount={masteredIds.length}
            totalTopics={theoryList.length}
            onOpenLesson={handleOpenLesson}
          />
        </div>

        {/* View Content (Kept mounted in DOM to preserve state across tab switches) */}
        <div style={{ flex: 1, minWidth: 0, display: activeView === 'theory' ? 'block' : 'none' }}>
          <TheoryView
            theoryList={theoryList}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedLesson={selectedLesson}
            filterMastered={filterMastered}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onOpenLesson={handleOpenLesson}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: activeView === 'vocabulary' ? 'block' : 'none' }}>
          <VocabularyView
            vocabularyList={vocabularyList}
            searchQuery={searchQuery}
            onOpenLesson={handleOpenLesson}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: activeView === 'activities' ? 'block' : 'none' }}>
          <ActivitiesView
            activitiesList={activitiesList}
            searchQuery={searchQuery}
            onOpenLesson={handleOpenLesson}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: activeView === 'quizzes' ? 'block' : 'none' }}>
          <QuizzesView
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* Full-screen PPTX Presentation Viewer Modal */}
      {viewingSlides && (
        <PptxViewer
          lessonId={viewingSlides.lesson}
          initialSlide={viewingSlides.slide}
          slideRange={[viewingSlides.slide, viewingSlides.slideEnd]}
          conceptLabel={viewingSlides.label}
          onClose={() => setViewingSlides(null)}
        />
      )}
    </div>
  );
}
