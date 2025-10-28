"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signUp } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, XCircle, Truck, CreditCard, ShoppingCart } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = {
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordStrength).filter(Boolean).length >= 3;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: marketing / benefits */}
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">Create your account — shop faster.</h2>
            <p className="text-lg text-muted-foreground">
              Sign up to get exclusive offers, faster checkout, and order tracking.
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">One-click checkout</p>
                  <p className="text-sm text-muted-foreground">
                    Save your addresses and payment methods for quick purchases.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Fast, reliable shipping</p>
                  <p className="text-sm text-muted-foreground">Track your orders and receive updates in real-time.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Secure payments</p>
                  <p className="text-sm text-muted-foreground">PCI-compliant payments with saved cards option.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription className="text-sm">Quick and secure registration</CardDescription>
                </CardHeader>
                <CardContent>
                  {success ? (
                    <div className="text-center space-y-4 py-8">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Account Created!</h3>
                        <p className="text-muted-foreground">
                          Check your email to verify your account before signing in.
                        </p>
                      </div>
                      <Link href="/sign-in">
                        <Button className="mt-4">Go to Sign In</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <form action={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={loading} />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              required
                              minLength={6}
                              disabled={loading}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>

                          {password && (
                            <div className="mt-3 p-3 rounded-md bg-muted/50">
                              <p className="text-xs font-medium mb-2">Password strength</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <PasswordRequirement met={passwordStrength.hasMinLength} text="6+ characters" />
                                <PasswordRequirement met={passwordStrength.hasUpperCase} text="Uppercase" />
                                <PasswordRequirement met={passwordStrength.hasLowerCase} text="Lowercase" />
                                <PasswordRequirement met={passwordStrength.hasNumber} text="Number" />
                              </div>
                            </div>
                          )}
                        </div>

                        {error && (
                          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full h-11 text-base font-medium"
                          disabled={loading || !isPasswordStrong}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">Creating account...</span>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>

                      <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                          Sign in
                        </Link>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3 w-3 text-green-600" />
      ) : (
        <XCircle className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={met ? "text-green-600 font-medium" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}
