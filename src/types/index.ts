export interface QAItem {
  question: string;
  answer: string;
}

export interface KnowledgeItem {
  id: number;
  title: string;
  category: string;
  definition: string;
  key_points: string[];
  qa_pairs: QAItem[];
}

export type Page = 'home' | 'mindmap' | 'quiz' | 'feedback' | 'detail';

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
}

export interface FeedbackItem {
  id: number;
  type: 'bug' | 'suggestion' | 'praise' | 'other';
  content: string;
  timestamp: string;
}
