import React, { useState, useEffect } from 'react';
import { ActiveTab, ChapterId, QuizAttempt, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FlashcardStudy } from './components/FlashcardStudy';
import { QuizModule } from './components/QuizModule';
import { ReferenceGuide } from './components/ReferenceGuide';
import { AITutorModal } from './components/AITutorModal';
import { FLASHCARDS } from './data/chapterData';

const LOCAL_STORAGE_KEY = 'ssw_food_prep_user_stats_v1';

const initialStats: UserStats = {
  masteredFlashcardIds: [],
  bookmarkedFlashcardIds: [],
  quizAttempts: [],
  wrongQuestionIds: [],
  studyStreakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 15,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Quiz launcher props
  const [quizMode, setQuizMode] = useState<'chapter' | 'mock_exam' | 'weak_points'>('chapter');
  const [quizChapterId, setQuizChapterId] = useState<ChapterId>(1);

  // Load local state
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check streak maintenance
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastStudyDate !== today) {
          const lastDate = new Date(parsed.lastStudyDate);
          const currentDate = new Date(today);
          const diffDays = Math.round(
            (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
          );

          if (diffDays === 1) {
            parsed.studyStreakDays = (parsed.studyStreakDays || 0) + 1;
          } else if (diffDays > 1) {
            parsed.studyStreakDays = 1;
          }
          parsed.lastStudyDate = today;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved user stats from localStorage:', e);
    }
    return initialStats;
  });

  // Save state on updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userStats));
    } catch (e) {
      console.error('Failed to save user stats to localStorage:', e);
    }
  }, [userStats]);

  // Mastered Card Toggle Handler
  const handleToggleMastered = (cardId: string) => {
    setUserStats((prev) => {
      const exists = prev.masteredFlashcardIds.includes(cardId);
      const updated = exists
        ? prev.masteredFlashcardIds.filter((id) => id !== cardId)
        : [...prev.masteredFlashcardIds, cardId];

      return { ...prev, masteredFlashcardIds: updated };
    });
  };

  // Bookmark Card Toggle Handler
  const handleToggleBookmark = (cardId: string) => {
    setUserStats((prev) => {
      const exists = prev.bookmarkedFlashcardIds.includes(cardId);
      const updated = exists
        ? prev.bookmarkedFlashcardIds.filter((id) => id !== cardId)
        : [...prev.bookmarkedFlashcardIds, cardId];

      return { ...prev, bookmarkedFlashcardIds: updated };
    });
  };

  // Record Quiz Attempt Handler
  const handleRecordQuizAttempt = (attempt: QuizAttempt) => {
    setUserStats((prev) => {
      // Update wrong question IDs list
      const wrongSet = new Set([...prev.wrongQuestionIds, ...attempt.wrongQuestionIds]);

      // Remove questions that were answered correctly in this attempt
      if (attempt.chapterId !== 'mock_exam') {
        // If question was correctly answered now, clean up from wrong set
        attempt.wrongQuestionIds.forEach((wId) => wrongSet.add(wId));
      }

      return {
        ...prev,
        quizAttempts: [attempt, ...prev.quizAttempts],
        wrongQuestionIds: Array.from(wrongSet),
      };
    });
  };

  // Quick Action Launchers
  const startChapterQuiz = (chapterId: ChapterId) => {
    setQuizMode('chapter');
    setQuizChapterId(chapterId);
    setActiveTab('quiz');
  };

  const startMockExam = () => {
    setQuizMode('mock_exam');
    setActiveTab('quiz');
  };

  const startWeakPointQuiz = () => {
    setQuizMode('weak_points');
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        totalCards={FLASHCARDS.length}
      />

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            userStats={userStats}
            setActiveTab={setActiveTab}
            onStartChapterQuiz={startChapterQuiz}
            onStartMockExam={startMockExam}
            onStartWeakPointQuiz={startWeakPointQuiz}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardStudy
            userStats={userStats}
            onToggleMastered={handleToggleMastered}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizModule
            userStats={userStats}
            onRecordAttempt={handleRecordQuizAttempt}
            initialMode={quizMode}
            initialChapterId={quizChapterId}
          />
        )}

        {activeTab === 'guide' && <ReferenceGuide />}

        {activeTab === 'ai-tutor' && <AITutorModal />}
      </main>
    </div>
  );
}
