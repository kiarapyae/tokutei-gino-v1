import React from 'react';
import { ActiveTab, UserStats } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  BookMarked
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userStats: UserStats;
  totalCards: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  totalCards,
}) => {
  const masteredPercentage = Math.round(
    (userStats.masteredFlashcardIds.length / totalCards) * 100
  ) || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
            id="brand-logo"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  SSW Pro
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md">
                  Food Mfg 4th Ed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-jp hidden sm:block">
                特定技能1号 飲食料品製造業 試験対策
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-flashcards"
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Cards</span>
            </button>

            <button
              id="nav-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Practice Tests</span>
            </button>

            <button
              id="nav-guide"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Cheat Sheet</span>
            </button>

            <button
              id="nav-ai-tutor"
              onClick={() => setActiveTab('ai-tutor')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
                activeTab === 'ai-tutor'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-xs'
                  : 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Exam Tutor</span>
            </button>
          </nav>

          {/* User Badges (Streak & Mastery) */}
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200/80 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold"
              title="Daily Study Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userStats.studyStreakDays} Day Streak</span>
            </div>

            <div
              className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold"
              title="Flashcards Mastered"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{masteredPercentage}% Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-white px-2 py-2 flex justify-around items-center text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dash</span>
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'flashcards' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Cards</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'quiz' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>Tests</span>
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'guide' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <BookMarked className="w-5 h-5 mb-0.5" />
          <span>Guides</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-tutor')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'ai-tutor' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>AI Tutor</span>
        </button>
      </div>
    </header>
  );
};
