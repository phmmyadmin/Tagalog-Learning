import { createClient } from '@supabase/supabase-js';

const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('tagalog_supabase_url');
  const localKey = localStorage.getItem('tagalog_supabase_anon_key');

  const supabaseUrl = envUrl || localUrl || '';
  const supabaseKey = envKey || localKey || '';

  return { supabaseUrl, supabaseKey };
};

const { supabaseUrl, supabaseKey } = getSupabaseCredentials();

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;
