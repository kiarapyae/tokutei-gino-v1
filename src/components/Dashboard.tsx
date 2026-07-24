import React from 'react';
import { ActiveTab, ChapterId, UserStats } from '../types';
import { CHAPTERS, FLASHCARDS } from '../data/chapterData';
import { QUIZ_QUESTIONS } from '../data/quizData';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Factory,
  Award,
  Zap,
  Flame,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  setActiveTab: (tab: ActiveTab) => void;
  onStartChapterQuiz: (chapterId: ChapterId) => void;
  onStartMockExam: () => void;
  onStartWeakPointQuiz: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userStats,
  setActiveTab,
  onStartChapterQuiz,
  onStartMockExam,
  onStartWeakPointQuiz,
}) => {
  const totalCards = FLASHCARDS.length;
  const masteredCount = userStats.masteredFlashcardIds.length;
  const cardProgressPercent = Math.round((masteredCount / totalCards) * 100);

  const totalQuizAttempts = userStats.quizAttempts.length;
  const averageQuizScore = totalQuizAttempts > 0
    ? Math.round(
        userStats.quizAttempts.reduce(
          (acc, cur) => acc + (cur.score / cur.totalQuestions) * 100,
          0
        ) / totalQuizAttempts
      )
    : 0;

  // Calculate Readiness Index (weighted combination of cards mastered + quiz accuracy)
  const readinessIndex = Math.min(
    100,
    Math.round(cardProgressPercent * 0.4 + averageQuizScore * 0.6)
  );

  const weakPointCount = userStats.wrongQuestionIds.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Welcome back, Candidate</h1>
          <p className="text-slate-500 mt-1">SSW Food & Beverage Manufacturing Exam Preparation (OTAFF 4th Edition)</p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-xs border border-slate-200 text-left sm:text-right self-start sm:self-auto">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Official OTAFF Exam</div>
          <div className="text-base font-bold text-slate-800">Target Score: 60%+</div>
        </div>
      </header>

      {/* Daily Goal & Weak Points Grid (Matching Clean Minimalism layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Daily Goal Indigo Banner */}
        <div className="lg:col-span-3 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Daily Study Sprint</h3>
                <p className="text-indigo-100 text-sm">Master 50 key flashcards and rules today</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                {readinessIndex}% Readiness
              </div>
            </div>

            <div className="pt-2">
              <div className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight">
                {masteredCount} <span className="text-lg font-normal opacity-70">/ {totalCards} Terms Mastered</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${cardProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="btn-hero-flashcards"
                onClick={() => setActiveTab('flashcards')}
                className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-indigo-950 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all text-xs sm:text-sm"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Study Cards</span>
              </button>

              <button
                id="btn-hero-mock-exam"
                onClick={onStartMockExam}
                className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm border border-indigo-400/40 transition-all text-xs sm:text-sm"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Practice Quiz</span>
              </button>

              <button
                id="btn-hero-ai-tutor"
                onClick={() => setActiveTab('ai-tutor')}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-white/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Decorative SVG elements matching design template */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute right-8 top-12 w-12 h-12 bg-white/5 rounded-full pointer-events-none" />
        </div>

        {/* Weak Points & Statistics Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Weak Points & Review</h3>
              <span className="text-xs text-slate-400 font-medium">{weakPointCount} flagged items</span>
            </div>

            {weakPointCount > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">Flagged Missed Questions</div>
                    <div className="text-xs text-slate-500">{weakPointCount} items requiring practice</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900">Quiz Average</div>
                    <div className="text-xs text-slate-500">{averageQuizScore}% accuracy across {totalQuizAttempts} attempts</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Weak Points Recorded!</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Take a practice quiz or mock test to pinpoint key topics for review.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            {weakPointCount > 0 ? (
              <button
                onClick={onStartWeakPointQuiz}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-red-200/60"
              >
                <span>Review Weak Points Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onStartMockExam}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-indigo-200/60"
              >
                <span>Take Daily Quiz Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div id="stat-card-cards" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Flashcard Mastery</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">
              {masteredCount} <span className="text-sm font-normal text-slate-400">/ {totalCards}</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${cardProgressPercent}%` }}
            />
          </div>
        </div>

        <div id="stat-card-quiz" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Quiz Avg Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">
              {averageQuizScore}%
            </span>
          </div>
          <p className="text-xs text-slate-400">Across {totalQuizAttempts} tests</p>
        </div>

        <div id="stat-card-streak" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">
              {userStats.studyStreakDays} <span className="text-sm font-normal text-slate-400">Days</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">Continuous study</p>
        </div>

        <div id="stat-card-weakness" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Flagged Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">
              {weakPointCount} <span className="text-sm font-normal text-slate-400">Items</span>
            </span>
          </div>
          {weakPointCount > 0 ? (
            <button
              onClick={onStartWeakPointQuiz}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <span>Review Missed</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">No errors recorded</p>
          )}
        </div>
      </div>

      {/* Course Chapters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Course Progress & Modules
            </h2>
            <p className="text-xs text-slate-500">
              Chapter breakdown based on the OTAFF Specified Skilled Worker No.1 Curriculum.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('flashcards')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All Flashcards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHAPTERS.map((ch, idx) => {
            const chCards = FLASHCARDS.filter((f) => f.chapterId === ch.id);
            const chMasteredCards = chCards.filter((f) =>
              userStats.masteredFlashcardIds.includes(f.id)
            ).length;
            const chProgress = Math.round((chMasteredCards / chCards.length) * 100) || 0;

            const badgeStyles = [
              'bg-blue-50 text-blue-600',
              'bg-emerald-50 text-emerald-600',
              'bg-amber-50 text-amber-600',
            ][idx % 3];

            const barStyles = [
              'bg-blue-500',
              'bg-emerald-500',
              'bg-amber-500',
            ][idx % 3];

            return (
              <div
                key={ch.id}
                id={`chapter-card-${ch.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${badgeStyles}`}>
                      Chapter {ch.id}
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{chProgress}%</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                      {ch.titleJp}
                    </h3>
                    <p className="text-xs text-indigo-600 font-jp mb-1 font-medium">
                      {ch.titleFurigana}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {ch.titleEn}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 line-clamp-2">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${barStyles}`}
                      style={{ width: `${chProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{chMasteredCards}/{chCards.length} Topics Mastered</p>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      id={`btn-ch-${ch.id}-study`}
                      onClick={() => setActiveTab('flashcards')}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      Cards
                    </button>
                    <button
                      id={`btn-ch-${ch.id}-quiz`}
                      onClick={() => onStartChapterQuiz(ch.id)}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Yield Cheat Sheet Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 text-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Must-Memorize Exam Criteria</h3>
              <p className="text-xs text-slate-500">
                Core numbers, sterilizing temperatures, and safety standards
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('guide')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>Open Reference Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Heat Sterilization
            </span>
            <p className="text-sm font-bold text-slate-900">75℃ for 1+ Minute</p>
            <p className="text-xs text-slate-500">General food poisoning bacteria core temp limit.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Norovirus Rule
            </span>
            <p className="text-sm font-bold text-slate-900">85~90℃ for 90+ Secs</p>
            <p className="text-xs text-slate-500">Use 200ppm Chlorine (Alcohol does NOT kill Norovirus).</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
              Spore Heating (芽胞)
            </span>
            <p className="text-sm font-bold text-slate-900">120℃ for 4+ Mins</p>
            <p className="text-xs text-slate-500">Required for Cereus, Perfringens, Botulinum spores.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Rapid Cooling Rule
            </span>
            <p className="text-sm font-bold text-slate-900">20℃ / 30m or 10℃ / 60m</p>
            <p className="text-xs text-slate-500">Cool hot foods rapidly to prevent bacterial growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
