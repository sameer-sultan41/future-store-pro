"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signUp } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function SignUpPage() {
  const t = useTranslations("Auth.signUp");
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
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
            <CardDescription className="text-sm">{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("accountCreated")}</h3>
                  <p className="text-muted-foreground">{t("checkEmail")}</p>
                </div>
                <Link href="/sign-in">
                  <Button className="mt-4">{t("goToSignIn")}</Button>
                </Link>
              </div>
            ) : (
              <>
                <form action={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t("fullName")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t("fullNamePlaceholder")}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("password")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("passwordPlaceholder")}
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
                      <div className="mt-3 p-3 rounded-md bg-gray-100">
                        <p className="text-xs font-medium mb-2">{t("passwordStrength")}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <PasswordRequirement met={passwordStrength.hasMinLength} text={t("characters")} />
                          <PasswordRequirement met={passwordStrength.hasUpperCase} text={t("uppercase")} />
                          <PasswordRequirement met={passwordStrength.hasLowerCase} text={t("lowercase")} />
                          <PasswordRequirement met={passwordStrength.hasNumber} text={t("number")} />
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
                      <span className="flex items-center gap-2">{t("creatingAccount")}</span>
                    ) : (
                      t("createAccount")
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">{t("alreadyHaveAccount")} </span>
                  <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                    {t("signIn")}
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-red-600" />}
      <span className={met ? "text-green-600 font-medium" : "text-red-600"}>{text}</span>
    </div>
  );
}
