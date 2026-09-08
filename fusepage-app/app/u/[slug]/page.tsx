"use client";

import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { PublicPage } from "@/components/public/PublicPage";

export default function PublicPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user, page, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  const targetPage = page ?? user?.page ?? null;

  if (!user || !targetPage || targetPage.slug !== slug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg)] p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-2xl font-semibold text-[var(--brand)]">
          F
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[var(--ink)]">
            Page not found
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            This Fusepage does not exist or has not been published yet.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <PublicPage page={targetPage} user={user} />;
}