import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createSupabaseServer } from "@/supabase/server";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string; next?: string };
}) {
  const cookieStore = await cookies();

  const supabase = await createSupabaseServer();
  const { token_hash, type, next } = searchParams;

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      redirect(next ?? "/");
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Email Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Thank you for signing up! We've sent you a confirmation email.</p>
          <p className="text-sm text-gray-500">
            Please check your email and click the confirmation link to activate your account. After confirming your
            email, you'll be able to sign in.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up">Back to Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
