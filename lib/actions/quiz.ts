'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth, requireAdmin } from '@/lib/auth'
import type { QuizWithQuestions, QuestionWithOptions } from '@/types'

export async function getQuizzes() {
  const supabase = createClient()
  
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return quizzes
}

export async function getQuizById(id: string): Promise<QuizWithQuestions | null> {
  const supabase = createClient()
  
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (quizError || !quiz) {
    return null
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select(`
      *,
      question_options (*)
    `)
    .eq('quiz_id', id)
    .order('order_index')

  if (questionsError) {
    throw new Error(questionsError.message)
  }

  const questionsWithOptions: QuestionWithOptions[] = questions.map(question => ({
    ...question,
    options: question.question_options || []
  }))

  return {
    ...quiz,
    questions: questionsWithOptions
  }
}

export async function createQuiz(formData: FormData) {
  const user = await requireAdmin()
  const supabase = createClient()

  const quizData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    difficulty: formData.get('difficulty') as string,
    time_limit: parseInt(formData.get('time_limit') as string) || null,
    show_answers: formData.get('show_answers') === 'true',
    is_active: formData.get('is_active') === 'true',
    image_url: formData.get('image_url') as string || null,
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : [],
    created_by: user.id,
  }

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert(quizData)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quizzes')
  redirect(`/admin/quizzes/${quiz.id}`)
}

export async function updateQuiz(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = createClient()

  const updates = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    difficulty: formData.get('difficulty') as string,
    time_limit: parseInt(formData.get('time_limit') as string) || null,
    show_answers: formData.get('show_answers') === 'true',
    is_active: formData.get('is_active') === 'true',
    image_url: formData.get('image_url') as string || null,
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : [],
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('quizzes')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quizzes')
  revalidatePath(`/admin/quizzes/${id}`)
  return { success: true }
}

export async function deleteQuiz(id: string) {
  await requireAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quizzes')
  redirect('/admin/quizzes')
}

export async function submitQuizResult(
  quizId: string,
  answers: Array<{
    questionId: string
    selectedOptions: string[]
    isCorrect: boolean
    timeSpent: number
  }>
) {
  const user = await requireAuth()
  const supabase = createClient()

  const correctAnswers = answers.filter(answer => answer.isCorrect).length
  const totalQuestions = answers.length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const totalTimeSpent = answers.reduce((sum, answer) => sum + answer.timeSpent, 0)

  // Insert user progress
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_spent: totalTimeSpent,
    })
    .select()
    .single()

  if (progressError) {
    return { error: progressError.message }
  }

  // Insert user answers
  const userAnswers = answers.map(answer => ({
    progress_id: progress.id,
    question_id: answer.questionId,
    selected_options: answer.selectedOptions,
    is_correct: answer.isCorrect,
    time_spent: answer.timeSpent,
  }))

  const { error: answersError } = await supabase
    .from('user_answers')
    .insert(userAnswers)

  if (answersError) {
    return { error: answersError.message }
  }

  revalidatePath('/dashboard')
  return { success: true, progressId: progress.id }
}

export async function getUserProgress(userId?: string) {
  const user = userId ? { id: userId } : await requireAuth()
  const supabase = createClient()

  const { data: progress, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      quizzes (title, category, difficulty)
    `)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return progress
}