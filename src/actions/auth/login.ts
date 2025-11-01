'use server'

import { createSupabaseServer } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServer()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createSupabaseServer()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/sign-in?message=Check your email to confirm your account')
}

export async function signOut() {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

export async function getUser() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
