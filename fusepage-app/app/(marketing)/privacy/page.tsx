import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
};

const SECTIONS = [
  {
    title: "1. Local-first demo",
    body: "Fusepage is a demonstration app. Your account details, pages, links, and appearance settings are stored locally in your browser using localStorage. Nothing is sent to a server.",
  },
  {
    title: "2. Data we do not collect",
    body: "We do not collect, store, or process personal data on a backend. Clearing your browser site data removes your demo account and pages from that browser.",
  },
  {
    title: "3. Third-party content",
    body: "Pages may load images from third-party services (for example avatar images you provide by URL). Those services may log requests according to their own policies.",
  },
  {
    title: "4. Your control",
    body: "Because all data lives in your browser, you are always in control. Sign out from Settings clears your local session at any time.",
  },
  {
    title: "5. Changes",
    body: "We may update this policy from time to time. Continued use of the service after changes means you accept the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white text-sm font-semibold">F</span>
            Fusepage
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
            Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="mt-8 space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-[var(--ink)]">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}