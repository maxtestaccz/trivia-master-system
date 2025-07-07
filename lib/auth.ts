import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@/types'

export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name: profile.name,
    role: profile.role as 'admin' | 'user',
    avatar_url: profile.avatar_url || undefined,
    created_at: profile.created_at!,
    email_verified: user.email_confirmed_at !== null,
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return user
}