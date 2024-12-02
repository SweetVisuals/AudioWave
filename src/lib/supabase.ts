import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
export const supabase = createClient(
  'https://your-project-url.supabase.co',
  'your-anon-key'
);

// User profile type
export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}