import React, { useState, useEffect } from 'react';
import { ChapterId, QuizQuestion, QuizAttempt, UserStats } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface QuizModuleProps {
  userStats: UserStats;
  onRecordAttempt: (attempt: QuizAttempt) => void;
  initialMode?: 'chapter' | 'mock_exam' | 'weak_points';
  initialChapterId?: ChapterId;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  userStats,
  onRecordAttempt,
  initialMode = 'chapter',
  initialChapterId = 1,
}) => {
  const [quizMode, setQuizMode] = useState<'chapter' | 'mock_exam' | 'weak_points'>(initialMode);
  const [selectedChapterId, setSelectedChapterId] = useState<ChapterId>(initialChapterId);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Initialize questions based on mode selection
  useEffect(() => {
    let qList: QuizQuestion[] = [];

    if (quizMode === 'chapter') {
      qList = QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedChapterId);
    } else if (quizMode === 'mock_exam') {
      // Shuffle & take questions across all chapters
      qList = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    } else if (quizMode === 'weak_points') {
      qList = QUIZ_QUESTIONS.filter((q) => userStats.wrongQuestionIds.includes(q.id));
      if (qList.length === 0) {
        qList = QUIZ_QUESTIONS.slice(0, 5); // Fallback if no weak points recorded yet
      }
    }

    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(qList.length).fill(null));
    setIsSubmitted(false);
    setIsCompleted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  }, [quizMode, selectedChapterId]);

  // Timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && !isCompleted) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, isCompleted]);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after answer confirmed
    setSelectedAnswer(optionIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      const nextAns = userAnswers[currentQIndex + 1];
      setSelectedAnswer(nextAns !== undefined ? nextAns : null);
      setIsSubmitted(nextAns !== undefined && nextAns !== null);
    } else {
      // Finalize Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    setIsCompleted(true);

    // Calculate score
    let score = 0;
    const wrongIds: string[] = [];

    questions.forEach((q, idx) => {
      const uAns = userAnswers[idx];
      if (uAns === q.correctAnswer) {
        score += 1;
      } else {
        wrongIds.push(q.id);
      }
    });

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      chapterId: quizMode === 'mock_exam' ? 'mock_exam' : selectedChapterId,
      score,
      totalQuestions: questions.length,
      timeSpentSeconds: timerSeconds,
      wrongQuestionIds: wrongIds,
    };

    onRecordAttempt(attempt);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          No Quiz Questions Available
        </h3>
        <p className="text-sm text-slate-500">
          Try selecting a different chapter or mode.
        </p>
        <button
          onClick={() => setQuizMode('chapter')}
          className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Chapter Quiz
        </button>
      </div>
    );
  }

  // QUIZ RESULT SCORE SCREEN
  if (isCompleted) {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correctCount += 1;
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    const isPassed = percentage >= 60;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div
          className={`rounded-3xl border p-8 text-center space-y-4 shadow-xs ${
            isPassed
              ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
              : 'bg-rose-50/50 border-rose-200 text-slate-900'
          }`}
        >
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold ${
              isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isPassed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full ${
                isPassed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {isPassed ? 'Exam Pass Standard Met! 🎉' : 'Needs More Review 📖'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 pt-2">
              Your Result: {percentage}%
            </h2>
            <p className="text-sm text-slate-600">
              Answered {correctCount} out of {questions.length} questions correctly in {formatTime(timerSeconds)}
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setUserAnswers(new Array(questions.length).fill(null));
                setIsSubmitted(false);
                setTimerSeconds(0);
                setIsTimerRunning(true);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors border border-slate-200 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test</span>
            </button>

            <button
              onClick={() => setQuizMode('mock_exam')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Start Full Mock Exam</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Question Review & Explanations</span>
          </h3>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const uAns = userAnswers[idx];
              const isCorrect = uAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-white border rounded-2xl p-5 space-y-3 shadow-xs ${
                    isCorrect
                      ? 'border-emerald-200'
                      : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Q{idx + 1}. Chapter {q.chapterId} &bull; {q.topic}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center space-x-1 ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 font-jp">
                    {q.questionJp}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{q.questionEn}</p>

                  <div className="grid grid-cols-1 gap-2 pt-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = uAns === oIdx;
                      const isTargetCorrect = q.correctAnswer === oIdx;

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between font-jp ${
                            isTargetCorrect
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                              : isChosen
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <span>{opt.jp} ({opt.en})</span>
                          {isTargetCorrect && <span className="text-[10px] font-bold text-emerald-600">Correct Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1 border border-slate-200/80">
                    <p className="font-bold text-indigo-700 font-jp">
                      解説: {q.explanationJp}
                    </p>
                    <p className="text-slate-600">
                      Explanation: {q.explanationEn}
                    </p>
                    {q.explanationMy && (
                      <p className="text-slate-500">
                        {q.explanationMy}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block pt-1">
                      📖 Official Textbook OTAFF 4th Ed Page: {q.textbookPage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION SCREEN
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Quiz Top Mode Switcher Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuizMode('chapter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                quizMode === 'chapter'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Chapter Practice
            </button>
            <button
              onClick={() => setQuizMode('mock_exam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                quizMode === 'mock_exam'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Full Mock Exam
            </button>
            <button
              onClick={() => setQuizMode('weak_points')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                quizMode === 'weak_points'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Weak Points ({userStats.wrongQuestionIds.length})
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono font-semibold text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
            <span>
              Q {currentQIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Chapter dropdown if chapter mode */}
        {quizMode === 'chapter' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Select Chapter:</span>
            <button
              onClick={() => setSelectedChapterId(1)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedChapterId === 1 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ch 1: Skills
            </button>
            <button
              onClick={() => setSelectedChapterId(2)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedChapterId === 2 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ch 2: Hygiene (食品衛生)
            </button>
            <button
              onClick={() => setSelectedChapterId(3)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedChapterId === 3 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ch 3: Safety (労働安全)
            </button>
          </div>
        )}

        {/* Question Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card (Matching Practice Quiz Daily Sprint design in prompt) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <span className="text-indigo-600 font-semibold text-sm">Question {currentQIndex + 1} of {questions.length}</span>
          <span className="text-xs text-slate-400 ml-auto font-mono">Page {currentQ.textbookPage}</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-jp leading-relaxed">
            {currentQ.questionJp}
          </h2>
          <p className="text-sm text-slate-500 leading-normal">
            {currentQ.questionEn}
          </p>
          {currentQ.questionMy && (
            <p className="text-xs text-slate-400 leading-normal">
              {currentQ.questionMy}
            </p>
          )}
        </div>

        {/* Options List with Clean Minimalism styling */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let optionStyle =
              'border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 hover:shadow-md text-slate-800';

            if (isSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
              } else {
                optionStyle = 'opacity-50 border-slate-100 bg-slate-50 text-slate-500';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-50/80 border-indigo-400 text-indigo-950 font-bold shadow-xs';
            }

            return (
              <button
                key={idx}
                id={`option-${idx}`}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left px-5 py-4 border transition-all rounded-xl flex items-center justify-between group ${optionStyle}`}
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-base">{option.jp}</p>
                  <p className="text-xs opacity-85">{option.en}</p>
                  {option.my && <p className="text-[11px] opacity-75">{option.my}</p>}
                </div>

                <div className="shrink-0 ml-3">
                  {isSubmitted && isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isSubmitted && isSelected && !isCorrect ? (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300 group-hover:border-indigo-400'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Box when answer submitted */}
        {isSubmitted && (
          <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-xl space-y-2 text-xs text-indigo-950 shadow-xs">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-700 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explanation (解説)</span>
            </div>
            <p className="font-jp text-sm font-semibold">{currentQ.explanationJp}</p>
            <p className="text-slate-600">{currentQ.explanationEn}</p>
            {currentQ.explanationMy && <p className="text-slate-500">{currentQ.explanationMy}</p>}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {!isSubmitted ? (
            <button
              id="btn-confirm-answer"
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                selectedAnswer !== null
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          ) : (
            <button
              id="btn-next-question"
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              <span>{currentQIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
