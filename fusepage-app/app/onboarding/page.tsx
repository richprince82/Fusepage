"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { pageThemes } from "@/lib/demo-data";
import { type DemoUser, type LinkBlock, type Page, type PageTheme } from "@/types";

const STEPS = ["Username", "Profile", "Theme", "Links", "Preview"];

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default function OnboardingPage() {
  const router = useRouter();
  const { user, page, upsertPage, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">Loading onboarding…</div>;
  }

  if (!user || !page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Sign in to continue</h1>
        <p className="text-sm text-[var(--muted)]">Onboarding belongs to your local Fusepage account.</p>
        <Button onClick={() => router.replace("/sign-in")}>Go to sign in</Button>
      </div>
    );
  }

  return <OnboardingFlow key={page.id} user={user} page={page} onSave={upsertPage} />;
}

function OnboardingFlow({ user, page, onSave }: { user: DemoUser; page: Page; onSave: (next: Page) => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState(page.slug || user.username);
  const [name, setName] = useState(page.profile.name || user.name);
  const [headline, setHeadline] = useState(page.profile.headline);
  const [bio, setBio] = useState(page.profile.bio);
  const [theme, setTheme] = useState<PageTheme>(page.appearance.theme);
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>(
    page.links.length > 0
      ? page.links.slice(0, 4).map((item) => ({ title: item.title, url: item.url ?? "" }))
      : [{ title: "", url: "" }]
  );
  const [error, setError] = useState<string | null>(null);

  const validLinks = useMemo(
    () => links.filter((item) => item.title.trim() || item.url.trim()),
    [links]
  );

  const validateCurrentStep = () => {
    setError(null);
    if (step === 0 && normalizeSlug(slug).length < 3) {
      setError("Choose a username with at least 3 letters or numbers.");
      return false;
    }
    if (step === 1 && name.trim().length < 2) {
      setError("Add the name you want visitors to see.");
      return false;
    }
    if (step === 3 && validLinks.some((item) => item.title.trim() && !/^https?:\/\//i.test(item.url.trim()))) {
      setError("Link URLs must start with http:// or https://.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateCurrentStep()) return;
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  };

  const finish = () => {
    if (!validateCurrentStep()) return;
    const now = new Date().toISOString();
    const nextLinks: LinkBlock[] = validLinks.map((item, index) => ({
      id: crypto.randomUUID?.() ?? `${Date.now()}-${index}`,
      type: "link",
      title: item.title.trim() || `Link ${index + 1}`,
      url: item.url.trim() || undefined,
      visible: true,
      order: index,
    }));

    const normalized = normalizeSlug(slug);
    onSave({
      ...page,
      slug: normalized,
      profile: {
        ...page.profile,
        name: name.trim(),
        username: normalized,
        headline: headline.trim(),
        bio: bio.trim(),
      },
      links: nextLinks,
      appearance: { ...page.appearance, theme },
      published: false,
      updatedAt: now,
    });
    router.replace("/editor");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <button type="button" className="text-sm font-semibold text-[var(--ink)]" onClick={() => router.push("/")}>Fusepage</button>
          <span className="text-xs text-[var(--muted)]">Setup {step + 1} of {STEPS.length}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <div className="mb-8 overflow-x-auto pb-1" aria-label="Onboarding progress">
          <ol className="grid min-w-[620px] grid-cols-5 gap-2">
            {STEPS.map((label, index) => {
              const active = index === step;
              const done = index < step;
              return (
                <li key={label} className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${active || done ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted)]"}`}>
                    {done ? "✓" : index + 1}
                  </span>
                  <span className={`text-xs font-medium ${active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-5">
              {step === 0 && (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--ink)]">Choose your public URL</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Keep it short and easy to remember. You can change it later.</p>
                  </div>
                  <Input label="Username" value={slug} onChange={(event) => setSlug(normalizeSlug(event.target.value))} placeholder="your-name" hint={`Your page will live at /u/${normalizeSlug(slug) || "your-name"}`} autoFocus />
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--ink)]">Introduce yourself</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Give visitors enough context to know who you are and why your links matter.</p>
                  </div>
                  <Input label="Display name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name or brand" />
                  <Input label="Headline" value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Designer, developer, photographer…" />
                  <Textarea label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="A short introduction" className="min-h-[120px]" />
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--ink)]">Pick a starting theme</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Choose the direction now; colors and details stay editable later.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {pageThemes.map((option) => (
                      <button key={option.value} type="button" onClick={() => setTheme(option.value)} aria-pressed={theme === option.value} className={`min-h-24 rounded-xl border p-3 text-left transition ${theme === option.value ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-[var(--border)] hover:border-[var(--border-strong)]"}`}>
                        <span className="text-sm font-semibold text-[var(--ink)]">{option.label}</span>
                        <span className="mt-6 block h-3 rounded-full bg-[var(--color-brand-soft)]" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--ink)]">Add your first links</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Start with the one or two destinations you most want visitors to open.</p>
                  </div>
                  <div className="space-y-4">
                    {links.map((item, index) => (
                      <div key={index} className="grid gap-3 rounded-xl border border-[var(--border)] p-4 sm:grid-cols-[1fr_1.4fr_auto]">
                        <Input label={`Link ${index + 1} title`} value={item.title} onChange={(event) => setLinks((prev) => prev.map((value, i) => i === index ? { ...value, title: event.target.value } : value))} placeholder="Portfolio" />
                        <Input label="URL" type="url" value={item.url} onChange={(event) => setLinks((prev) => prev.map((value, i) => i === index ? { ...value, url: event.target.value } : value))} placeholder="https://example.com" />
                        <Button variant="ghost" size="sm" className="self-end" disabled={links.length === 1} onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}>Remove</Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" onClick={() => setLinks((prev) => [...prev, { title: "", url: "" }])}>Add another link</Button>
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--ink)]">Ready to customize</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Your draft is ready. Finish setup and continue in the full editor before publishing.</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--color-brand-soft)] p-4 text-sm">
                    <p className="font-semibold text-[var(--ink)]">/u/{normalizeSlug(slug)}</p>
                    <p className="mt-1 text-[var(--muted)]">{name || "Your name"} · {headline || "Your headline"}</p>
                    <p className="mt-2 text-[var(--muted)]">{validLinks.length} link{validLinks.length === 1 ? "" : "s"} · {theme} theme · starts as draft</p>
                  </div>
                </>
              )}

              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-between">
                <Button variant="ghost" disabled={step === 0} onClick={() => { setError(null); setStep((value) => Math.max(0, value - 1)); }}>Back</Button>
                {step < STEPS.length - 1 ? <Button onClick={next}>Continue</Button> : <Button onClick={finish}>Finish and open editor</Button>}
              </div>
            </CardBody>
          </Card>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
              <div className="mx-auto max-w-[260px] rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-xl font-semibold text-white">{(name || user.name || "F")[0]?.toUpperCase()}</div>
                <h2 className="mt-4 font-semibold text-[var(--ink)]">{name || user.name || "Your name"}</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">{headline || "Your headline appears here"}</p>
                <div className="mt-5 space-y-2">
                  {(validLinks.length ? validLinks : [{ title: "Your first link", url: "" }]).slice(0, 3).map((item, index) => <div key={index} className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-medium text-[var(--ink)]">{item.title || "Untitled link"}</div>)}
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-[var(--muted)]">Preview updates as you set up your page.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
