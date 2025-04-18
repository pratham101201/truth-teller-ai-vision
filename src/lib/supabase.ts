
import { createClient } from '@supabase/supabase-js';

// Get these from Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

if (!supabaseUrl || !supabaseAnonKey) {
  if (!isDevelopment) {
    throw new Error('Missing Supabase credentials');
  }
  console.warn('Missing Supabase credentials. Using mock client for development.');
}

// Create the Supabase client, with mock values in development if needed
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key-for-development-only'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
