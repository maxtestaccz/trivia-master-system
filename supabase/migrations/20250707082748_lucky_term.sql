/*
  # Complete Trivia System Database Schema

  1. New Tables
    - `profiles` - User profile information with role-based access
    - `quizzes` - Quiz definitions with categories and settings
    - `questions` - Individual questions belonging to quizzes
    - `question_options` - Multiple choice options for questions
    - `user_progress` - Track user quiz completion and scores
    - `user_answers` - Store individual question responses

  2. Security
    - Enable RLS on all tables
    - Role-based policies for admin vs user access
    - Users can only access their own data
    - Public can view active quizzes and questions

  3. Features
    - Automatic profile creation on user registration
    - Admin role assignment based on email pattern
    - Sample quiz data for testing
*/

-- Create user profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quizzes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- in minutes
  show_answers BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Create questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'multiple', 'truefalse')),
  question TEXT NOT NULL,
  image_url TEXT,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create question options table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_spent INTEGER, -- in seconds
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quiz_id, completed_at)
);

-- Create user answers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id UUID REFERENCES public.user_progress(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_options UUID[] DEFAULT '{}',
  is_correct BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0
);

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

  -- Quizzes policies
  DROP POLICY IF EXISTS "Everyone can view active quizzes" ON public.quizzes;
  DROP POLICY IF EXISTS "Admins can manage all quizzes" ON public.quizzes;

  -- Questions policies
  DROP POLICY IF EXISTS "Everyone can view questions of active quizzes" ON public.questions;
  DROP POLICY IF EXISTS "Admins can manage all questions" ON public.questions;

  -- Question options policies
  DROP POLICY IF EXISTS "Everyone can view question options" ON public.question_options;
  DROP POLICY IF EXISTS "Admins can manage question options" ON public.question_options;

  -- User progress policies
  DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
  DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
  DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

  -- User answers policies
  DROP POLICY IF EXISTS "Users can manage their own answers" ON public.user_answers;
  DROP POLICY IF EXISTS "Admins can view all answers" ON public.user_answers;
END $$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for quizzes
CREATE POLICY "Everyone can view active quizzes" ON public.quizzes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all quizzes" ON public.quizzes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for questions
CREATE POLICY "Everyone can view questions of active quizzes" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE id = quiz_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage all questions" ON public.questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for question options
CREATE POLICY "Everyone can view question options" ON public.question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_id AND qz.is_active = true
    )
  );

CREATE POLICY "Admins can manage question options" ON public.question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for user answers
CREATE POLICY "Users can manage their own answers" ON public.user_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_progress up
      WHERE up.id = progress_id AND up.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all answers" ON public.user_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email LIKE '%admin%' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample quizzes only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = '550e8400-e29b-41d4-a716-446655440001'::UUID) THEN
    INSERT INTO public.quizzes (id, title, description, category, difficulty, time_limit, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'General Knowledge Quiz', 'Test your general knowledge with this fun quiz', 'General', 'medium', 30, null);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = '550e8400-e29b-41d4-a716-446655440002'::UUID) THEN
    INSERT INTO public.quizzes (id, title, description, category, difficulty, time_limit, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440002'::UUID, 'Science Basics', 'Basic science questions for students', 'Science', 'easy', 20, null);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = '550e8400-e29b-41d4-a716-446655440003'::UUID) THEN
    INSERT INTO public.quizzes (id, title, description, category, difficulty, time_limit, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440003'::UUID, 'Advanced Mathematics', 'Advanced math problems', 'Math', 'hard', 45, null);
  END IF;
END $$;

-- Insert sample questions only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id = '650e8400-e29b-41d4-a716-446655440001'::UUID) THEN
    INSERT INTO public.questions (id, quiz_id, type, question, points, order_index) VALUES
    ('650e8400-e29b-41d4-a716-446655440001'::UUID, '550e8400-e29b-41d4-a716-446655440001'::UUID, 'single', 'What is the capital of France?', 1, 1);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id = '650e8400-e29b-41d4-a716-446655440002'::UUID) THEN
    INSERT INTO public.questions (id, quiz_id, type, question, points, order_index) VALUES
    ('650e8400-e29b-41d4-a716-446655440002'::UUID, '550e8400-e29b-41d4-a716-446655440001'::UUID, 'single', 'Which planet is closest to the Sun?', 1, 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id = '650e8400-e29b-41d4-a716-446655440003'::UUID) THEN
    INSERT INTO public.questions (id, quiz_id, type, question, points, order_index) VALUES
    ('650e8400-e29b-41d4-a716-446655440003'::UUID, '550e8400-e29b-41d4-a716-446655440002'::UUID, 'truefalse', 'Water boils at 100°C at sea level', 1, 1);
  END IF;
END $$;

-- Insert sample question options only if they don't exist
DO $$
BEGIN
  -- Options for "What is the capital of France?"
  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440001'::UUID AND text = 'Paris') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440001'::UUID, 'Paris', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440001'::UUID AND text = 'London') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440001'::UUID, 'London', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440001'::UUID AND text = 'Berlin') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440001'::UUID, 'Berlin', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440001'::UUID AND text = 'Madrid') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440001'::UUID, 'Madrid', false);
  END IF;

  -- Options for "Which planet is closest to the Sun?"
  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440002'::UUID AND text = 'Mercury') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440002'::UUID, 'Mercury', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440002'::UUID AND text = 'Venus') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440002'::UUID, 'Venus', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440002'::UUID AND text = 'Earth') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440002'::UUID, 'Earth', false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440002'::UUID AND text = 'Mars') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440002'::UUID, 'Mars', false);
  END IF;

  -- Options for "Water boils at 100°C at sea level"
  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440003'::UUID AND text = 'True') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440003'::UUID, 'True', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE question_id = '650e8400-e29b-41d4-a716-446655440003'::UUID AND text = 'False') THEN
    INSERT INTO public.question_options (question_id, text, is_correct) VALUES
    ('650e8400-e29b-41d4-a716-446655440003'::UUID, 'False', false);
  END IF;
END $$;