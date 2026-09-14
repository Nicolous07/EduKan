import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://odlcgmijuksvedphtzct.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Q2TfuqO_gmJU0PpqN-4szA_L_1u7Uak';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('posts').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase remote query note:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connection check:', err);
    return false;
  }
};
