import { Tables } from './database'

// Export Supabase types
export type Profile = Tables<'profiles'>
export type Quiz = Tables<'quizzes'>
export type Question = Tables<'questions'>
export type QuestionOption = Tables<'question_options'>
export type UserProgress = Tables<'user_progress'>
export type UserAnswer = Tables<'user_answers'>

// Additional types for the UI
export interface QuizWithQuestions extends Quiz {
  questions: QuestionWithOptions[]
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  avatar_url?: string
  created_at: string
  email_verified: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  unlocked_at?: Date
}

export interface QuizSession {
  quiz: QuizWithQuestions
  current_question_index: number
  user_answers: UserAnswer[]
  time_remaining: number
  started_at: Date
}

export interface QuizResult {
  quiz_id: string
  user_id: string
  score: number
  total_questions: number
  correct_answers: number
  time_spent: number
  completed_at: Date
  answers: UserAnswer[]
}