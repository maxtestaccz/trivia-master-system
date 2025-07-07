
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  emailVerified: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
  showAnswers: boolean;
  isActive: boolean;
  imageUrl?: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

export interface Question {
  id: string;
  quizId: string;
  type: 'single' | 'multiple' | 'truefalse';
  question: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswers: string[]; // option IDs
  explanation?: string;
  points: number;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: Date;
}
