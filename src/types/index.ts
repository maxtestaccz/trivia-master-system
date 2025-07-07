
import { Tables } from '@/integrations/supabase/types';

// Export Supabase types
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  emailVerified: boolean;
};

export type Profile = Tables<'profiles'>;
export type Quiz = Tables<'quizzes'>;
export type Question = Tables<'questions'>;
export type QuestionOption = Tables<'question_options'>;
export type UserProgress = Tables<'user_progress'>;
export type UserAnswer = Tables<'user_answers'>;

// Additional types for the UI
export interface QuizWithQuestions extends Quiz {
  questions: QuestionWithOptions[];
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: Date;
}
