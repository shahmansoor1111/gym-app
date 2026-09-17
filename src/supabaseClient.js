import { createClient } from '@supabase/supabase-js';

// Yeh dono keys aap ko Supabase ke Dashboard -> Project Settings -> API par mil jayengi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);