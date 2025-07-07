'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function getAdminStats() {
  await requireAdmin()
  const supabase = createClient()

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get total quizzes
  const { count: totalQuizzes } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })

  // Get total questions
  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })

  // Get quiz completions
  const { count: totalCompletions } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })

  // Get average score
  const { data: avgScoreData } = await supabase
    .from('user_progress')
    .select('score')

  const averageScore = avgScoreData?.length 
    ? Math.round(avgScoreData.reduce((sum, item) => sum + item.score, 0) / avgScoreData.length)
    : 0

  return {
    totalUsers: totalUsers || 0,
    totalQuizzes: totalQuizzes || 0,
    totalQuestions: totalQuestions || 0,
    totalCompletions: totalCompletions || 0,
    averageScore,
  }
}

export async function getAllQuizzes() {
  await requireAdmin()
  const supabase = createClient()

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions (count),
      user_progress (count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return quizzes
}

export async function getAllUsers() {
  await requireAdmin()
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return users
}

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
  await requireAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  const supabase = createClient()

  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function getQuizAnalytics(quizId: string) {
  await requireAdmin()
  const supabase = createClient()

  // Get quiz details
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single()

  if (quizError) {
    throw new Error(quizError.message)
  }

  // Get completion stats
  const { data: completions, error: completionsError } = await supabase
    .from('user_progress')
    .select(`
      *,
      profiles (name, email)
    `)
    .eq('quiz_id', quizId)
    .order('completed_at', { ascending: false })

  if (completionsError) {
    throw new Error(completionsError.message)
  }

  // Calculate analytics
  const totalAttempts = completions.length
  const averageScore = totalAttempts > 0 
    ? Math.round(completions.reduce((sum, item) => sum + item.score, 0) / totalAttempts)
    : 0
  const averageTime = totalAttempts > 0
    ? Math.round(completions.reduce((sum, item) => sum + (item.time_spent || 0), 0) / totalAttempts)
    : 0

  return {
    quiz,
    completions,
    analytics: {
      totalAttempts,
      averageScore,
      averageTime,
      completionRate: totalAttempts > 0 ? 100 : 0, // This would need more data to calculate properly
    }
  }
}

export async function createQuestion(quizId: string, formData: FormData) {
  await requireAdmin()
  const supabase = createClient()

  const questionData = {
    quiz_id: quizId,
    type: formData.get('type') as string,
    question: formData.get('question') as string,
    explanation: formData.get('explanation') as string || null,
    points: parseInt(formData.get('points') as string) || 1,
    order_index: parseInt(formData.get('order_index') as string),
    image_url: formData.get('image_url') as string || null,
  }

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .insert(questionData)
    .select()
    .single()

  if (questionError) {
    return { error: questionError.message }
  }

  // Add options
  const options = JSON.parse(formData.get('options') as string || '[]')
  
  if (options.length > 0) {
    const optionsData = options.map((option: any) => ({
      question_id: question.id,
      text: option.text,
      is_correct: option.isCorrect,
      image_url: option.imageUrl || null,
    }))

    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(optionsData)

    if (optionsError) {
      return { error: optionsError.message }
    }
  }

  revalidatePath(`/admin/quizzes/${quizId}`)
  return { success: true, questionId: question.id }
}

export async function updateQuestion(questionId: string, formData: FormData) {
  await requireAdmin()
  const supabase = createClient()

  const updates = {
    type: formData.get('type') as string,
    question: formData.get('question') as string,
    explanation: formData.get('explanation') as string || null,
    points: parseInt(formData.get('points') as string) || 1,
    order_index: parseInt(formData.get('order_index') as string),
    image_url: formData.get('image_url') as string || null,
  }

  const { error: questionError } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', questionId)

  if (questionError) {
    return { error: questionError.message }
  }

  // Update options
  const options = JSON.parse(formData.get('options') as string || '[]')
  
  // Delete existing options
  await supabase
    .from('question_options')
    .delete()
    .eq('question_id', questionId)

  // Insert new options
  if (options.length > 0) {
    const optionsData = options.map((option: any) => ({
      question_id: questionId,
      text: option.text,
      is_correct: option.isCorrect,
      image_url: option.imageUrl || null,
    }))

    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(optionsData)

    if (optionsError) {
      return { error: optionsError.message }
    }
  }

  revalidatePath(`/admin/questions/${questionId}`)
  return { success: true }
}

export async function deleteQuestion(questionId: string) {
  await requireAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quizzes')
  return { success: true }
}