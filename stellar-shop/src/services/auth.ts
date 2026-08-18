import { supabase } from '@/lib/supabase';

export async function signInWithSupabase(email: string, password: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithSupabase(input: { email: string; password: string; name: string; mobile?: string }) {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, mobile: input.mobile ?? '' } },
  });
  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
  if (supabase) await supabase.auth.signOut();
}
