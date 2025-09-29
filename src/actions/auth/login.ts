
import { createClient } from '@/supabase/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

