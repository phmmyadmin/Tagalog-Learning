-- Supabase SQL Schema for Tagalog Learning Multi-Device Sync (including FSRS SRS Suite & AI Saved Quizzes)

-- 1. Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  mastered_items JSONB DEFAULT '[]'::jsonb,
  study_dates JSONB DEFAULT '[]'::jsonb,
  activity_results JSONB DEFAULT '{}'::jsonb,
  quiz_history JSONB DEFAULT '{}'::jsonb,
  mistakes_bank JSONB DEFAULT '[]'::jsonb,
  srs_cards_v2 JSONB DEFAULT '{}'::jsonb,
  srs_review_log_v2 JSONB DEFAULT '[]'::jsonb,
  srs_gamification_v2 JSONB DEFAULT '{}'::jsonb,
  srs_settings_v2 JSONB DEFAULT '{}'::jsonb,
  saved_quizzes JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist for users migrating from older schema versions
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS srs_cards_v2 JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS srs_review_log_v2 JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS srs_gamification_v2 JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS srs_settings_v2 JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS saved_quizzes JSONB DEFAULT '[]'::jsonb;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. RLS Security Policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);
