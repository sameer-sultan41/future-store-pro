import { createBrowserClient, createServerClient } from "@supabase/ssr";

export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const createSupabaseServer = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() {
          return undefined; // Will be handled by middleware
        },
        set() {
          // Will be handled by middleware
        },
        remove() {
          // Will be handled by middleware
        },
      },
    }
  );
};


