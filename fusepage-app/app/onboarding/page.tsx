"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

import { useAuth } from "@/lib/store";
import { SparklesIcon } from "@/components/ui/Icon";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, page, upsertPage, loading } = useAuth();

  const handleCreateFirstPage = () => {
    if (!user || !page) return;
    upsertPage({
      ...page,
      profile: { ...page.profile, name: user.name || page.profile.name, username: user.username },
      published: false,
      updatedAt: new Date().toISOString(),
    });
    router.replace("/dashboard");
    router.refresh();
  };

  const handleSkip = () => {
    router.replace("/dashboard");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-[var(--muted)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
            onClick={(e) => {
              e.preventDefault();
              handleSkip();
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to dashboard
          </a>
          <span className="text-xs text-[var(--muted)]">Onboarding</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-5">
        <div className="mx-auto max-w-lg text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--color-brand-soft)] p-4">
            <SparklesIcon size={28} className="text-[var(--brand)]" />
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Your Fusepage is ready</h1>
            <p className="mt-3 text-[var(--muted)] leading-relaxed">
              {user?.name ? `Hi ${user.name}, ` : "Hi there, "}
              you now have a free Fusepage. Customize your profile, add links, and share it everywhere.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button variant="primary" size="lg" onClick={handleCreateFirstPage} className="min-w-[200px]">
              Set up my page
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Button>
            <Button variant="ghost" size="md" onClick={handleSkip} className="text-[var(--muted)]">
              Skip and go to dashboard
            </Button>
          </div>

          <p className="mt-8 text-xs text-[var(--muted)]">
            You can always finish setup later from the editor.
          </p>
        </div>
      </main>
    </div>
  );
}