"use client";
import { redirect, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { login } from "@/actions/auth/login";

const signInDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        email: "sameer@gmail.com",
        password: "sameer",
      }
    : {
        email: "",
        password: "",
      };

export interface IUserSignIn {
  email: string;
  password: string;
}

export const UserSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function CredentialsSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    setIsLoading(true);
    try {
      const res = await login(data);
      console.log("error signin", res);
      const { error } = res;

      if (error) {
        // Handle email not confirmed error specifically
        if (error.message.includes("Email not confirmed")) {
          toast.error("Email not verified", {
            description: "Please check your email and click the verification link before signing in.",
            action: {
              label: "Resend Email",
              onClick: () => handleResendConfirmation(data.email),
            },
          });
        } else {
          toast.error("Sign in failed", {
            description: error.message,
            action: {
              label: "Retry",
              onClick: () => console.log("Retry"),
            },
          });
        }
        return;
      }

      redirect(callbackUrl);
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      const { createSupabaseClient } = await import("@/supabase/client");
      const supabase = await createSupabaseClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        toast.error("Failed to resend confirmation email", {
          description: error.message,
        });
      } else {
        toast.success("Confirmation email sent!", {
          description: "Please check your email for the verification link.",
        });
      }
    } catch (error) {
      toast.error("An error occurred while resending the email.");
    }
  };

  return (
    <Form {...form}>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
          <div className="text-sm">
            <Link href="/page/conditions-of-use">Conditions of Use</Link> and{" "}
            <Link href="/page/privacy-policy">Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
