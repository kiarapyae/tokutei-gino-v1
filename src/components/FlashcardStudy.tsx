import React, { useState, useEffect } from 'react';
import { ChapterId, Flashcard, UserStats } from '../types';
import { FLASHCARDS } from '../data/chapterData';
import {
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Bookmark,
  Shuffle,
  Play,
  Pause,
  Filter,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';

interface FlashcardStudyProps {
  userStats: UserStats;
  onToggleMastered: (cardId: string) => void;
  onToggleBookmark: (cardId: string) => void;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  userStats,
  onToggleMastered,
  onToggleBookmark,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedChapterCategory] = useState<string>('all');
  const [filterMastered, setFilterMastered] = useState<'all' | 'unmastered' | 'mastered' | 'bookmarked'>('all');

  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Filter cards based on user selections
  useEffect(() => {
    let filtered = FLASHCARDS;

    if (selectedChapter !== 'all') {
      filtered = filtered.filter((c) => c.chapterId === selectedChapter);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (filterMastered === 'unmastered') {
      filtered = filtered.filter((c) => !userStats.masteredFlashcardIds.includes(c.id));
    } else if (filterMastered === 'mastered') {
      filtered = filtered.filter((c) => userStats.masteredFlashcardIds.includes(c.id));
    } else if (filterMastered === 'bookmarked') {
      filtered = filtered.filter((c) => userStats.bookmarkedFlashcardIds.includes(c.id));
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedChapter, selectedCategory, filterMastered, userStats]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, currentIndex]);

  // Slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAuto && cards.length > 0) {
      timer = setInterval(() => {
        setIsFlipped((prev) => {
          if (prev) {
            handleNext();
            return false;
          }
          return true;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAuto, currentIndex, cards.length]);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const categories = Array.from(new Set(FLASHCARDS.map((f) => f.category)));
  const isMastered = currentCard ? userStats.masteredFlashcardIds.includes(currentCard.id) : false;
  const isBookmarked = currentCard ? userStats.bookmarkedFlashcardIds.includes(currentCard.id) : false;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Flashcard Terminology Study</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Flip cards to learn key Japanese food manufacturing terminology, furigana & translations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isPlayingAuto
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAuto ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleShuffle}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedChapter}
            onChange={(e) =>
              setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Chapters</option>
            <option value="1">Chapter 1: Manufacturing Skills</option>
            <option value="2">Chapter 2: Food Hygiene (食品衛生)</option>
            <option value="3">Chapter 3: Workplace Safety (労働安全)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedChapterCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Sub-Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-1 ml-auto">
            <button
              onClick={() => setFilterMastered('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                filterMastered === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => setFilterMastered('unmastered')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                filterMastered === 'unmastered'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              Learning
            </button>
            <button
              onClick={() => setFilterMastered('mastered')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                filterMastered === 'mastered'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Flashcard Stage */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Award className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            No Flashcards Match Your Filters!
          </h3>
          <p className="text-sm text-slate-500">
            Try clearing or changing your chapter/category filters above.
          </p>
          <button
            onClick={() => {
              setSelectedChapter('all');
              setSelectedChapterCategory('all');
              setFilterMastered('all');
            }}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card Counter & Bookmark Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">
                Chapter {currentCard.chapterId} &bull; {currentCard.category}
              </span>
              <button
                onClick={() => onToggleBookmark(currentCard.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Bookmark card"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group cursor-pointer perspective-1000 min-h-[340px] sm:min-h-[380px] w-full"
            id="flashcard-container"
          >
            <div
              className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] transition-all duration-500 transform-style-3d rounded-3xl border ${
                isMastered
                  ? 'border-emerald-500/40 shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              } bg-white dark:bg-slate-900 shadow-xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between backface-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50/50 to-slate-100/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      currentCard.importance === 'critical'
                        ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {currentCard.importance === 'critical' ? 'High Exam Yield ★' : 'Core Concept'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTTS(currentCard.kanji);
                    }}
                    className="p-2 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors"
                    title="Pronounce Japanese audio"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center my-auto space-y-3 py-4">
                  <p className="text-sm font-jp text-sky-600 dark:text-sky-400 font-medium">
                    {currentCard.furigana}
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-jp tracking-wide">
                    {currentCard.kanji}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono tracking-wide">
                    {currentCard.romaji}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-4">
                  <span className="flex items-center space-x-1 text-slate-500">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click or press Space to reveal definition</span>
                  </span>
                  {isMastered && (
                    <span className="flex items-center space-x-1 text-emerald-500 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mastered</span>
                    </span>
                  )}
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl bg-slate-900 text-white border border-sky-500/30 shadow-2xl overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                        {currentCard.kanji} ({currentCard.furigana})
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {currentCard.english}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTTS(currentCard.kanji);
                      }}
                      className="p-2 rounded-xl bg-slate-800 text-sky-400 hover:bg-slate-700"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {currentCard.myanmar && (
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-200 text-sm font-medium leading-relaxed">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                        Myanmar Translation
                      </span>
                      {currentCard.myanmar}
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                    <p>{currentCard.definition}</p>
                  </div>

                  <div className="bg-sky-950/60 border border-sky-500/30 p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Exam Key Point (試験ポイント)</span>
                    </div>
                    <p className="text-xs text-sky-100 font-medium">
                      {currentCard.keyPoint}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 mt-4">
                  <span>Click again to flip front</span>
                  <span className="text-slate-500 font-mono">ID: {currentCard.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              id="btn-card-prev"
              onClick={handlePrev}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                id="btn-mark-unmastered"
                onClick={() => {
                  if (isMastered) onToggleMastered(currentCard.id);
                  handleNext();
                }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm border ${
                  !isMastered
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Need Practice</span>
              </button>

              <button
                id="btn-mark-mastered"
                onClick={() => {
                  if (!isMastered) onToggleMastered(currentCard.id);
                  handleNext();
                }}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                  isMastered
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isMastered ? 'Mastered ✓' : 'Mark Mastered'}</span>
              </button>
            </div>

            <button
              id="btn-card-next"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-all shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
