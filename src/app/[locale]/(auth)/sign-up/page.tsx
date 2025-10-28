import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServer } from "@/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

// Server component: checks session and renders the client form
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Await searchParams as it's now a Promise in Next.js 15
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/";

  if (session) {
    return redirect(callbackUrl);
  }
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
