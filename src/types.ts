export type ChapterId = 1 | 2 | 3;

export interface Flashcard {
  id: string;
  chapterId: ChapterId;
  category: string;
  kanji: string;
  furigana: string;
  romaji: string;
  english: string;
  myanmar?: string;
  definition: string;
  keyPoint: string;
  importance: 'critical' | 'high' | 'normal';
}

export interface QuizQuestion {
  id: string;
  chapterId: ChapterId;
  topic: string;
  questionJp: string;
  questionFurigana?: string;
  questionEn: string;
  questionMy?: string;
  options: {
    jp: string;
    en: string;
    my?: string;
  }[];
  correctAnswer: number; // 0-indexed
  explanationJp: string;
  explanationEn: string;
  explanationMy?: string;
  textbookPage: number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  chapterId: ChapterId | 'mock_exam';
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  wrongQuestionIds: string[];
}

export interface UserStats {
  masteredFlashcardIds: string[];
  bookmarkedFlashcardIds: string[];
  quizAttempts: QuizAttempt[];
  wrongQuestionIds: string[];
  studyStreakDays: number;
  lastStudyDate: string;
  totalStudyMinutes: number;
}

export type ActiveTab = 'dashboard' | 'flashcards' | 'quiz' | 'guide' | 'ai-tutor';
