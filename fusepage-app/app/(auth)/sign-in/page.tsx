"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle, CardDescription, CardBody, CardFooter } from "@/components/ui/Card";

import { useAuth } from "@/lib/store";
import { ArrowLeftIcon } from "@/components/ui/Icon";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading: authLoading } = useAuth();

  const callbackUrl = (searchParams.get("callbackUrl") ?? "/dashboard").replace(/^\/+/, "") || "dashboard";
  const isHomeReturning = searchParams.get("return") === "home";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; name?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (submitted) {
        router.replace(`/${callbackUrl}`);
        router.refresh();
      }
    }
  }, [authLoading, submitted, callbackUrl, router]);

  useEffect(() => {
    if (!authLoading) emailRef.current?.focus();
  }, [authLoading]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!name.trim()) next.name = "Name is required.";
    else if (name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      login(email.trim(), name.trim());
      setSubmitted(true);
    } catch {
      setErrors((prev) => ({ ...prev, general: "Something went wrong. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href={isHomeReturning ? "/" : "/"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeftIcon size={16} />
            {isHomeReturning ? "Back to Fusepage" : "Back to home"}
          </Link>
          <span className="text-xs text-[var(--muted)]">Sign in to your account</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Welcome back</h1>
            <p className="mt-2 text-[var(--muted)]">Sign in to edit your Fusepage and see your analytics.</p>
          </div>

          <Card variant="elevated">
            <form onSubmit={handleSubmit} noValidate>
              <CardBody>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Use any email and name to create a demo account on this device.</CardDescription>

                {errors.general && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <Input
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onBlur={validate}
                    error={errors.email}
                    placeholder="you@example.com"
                    autoFocus
                    required
                    id="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <Input
                    label="Name"
                    type="text"
                    autoComplete="name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onBlur={validate}
                    error={errors.name}
                    placeholder="Your name"
                    required
                    id="name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting || authLoading}
                  disabled={authLoading || submitted}
                  className="w-full"
                >
                  {submitted ? "Signing in…" : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            No account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
              Create one
            </Link>
          </p>

          <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-4 text-xs text-[var(--brand)]">
            This is a local demo. Your session is stored in this browser only and is not sent to any server.
          </p>
        </div>
      </main>
    </div>
  );
}
