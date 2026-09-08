import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
};

const SECTIONS = [
  {
    title: "1. Demo service",
    body: "Fusepage is provided as a demonstration product. Accounts, pages, and analytics are stored locally in your browser and are not backed by a production service.",
  },
  {
    title: "2. Use of the service",
    body: "You may use Fusepage to create and share mini-sites and link-in-bio pages. You are responsible for the content you publish and for complying with applicable laws.",
  },
  {
    title: "3. No warranties",
    body: "The service is provided \"as is\" without warranties of any kind. We do not guarantee uninterrupted availability or that your locally stored data will survive browser data clearing.",
  },
  {
    title: "4. Liability",
    body: "To the maximum extent permitted by law, Fusepage is not liable for any damages arising from your use of the demonstration service.",
  },
  {
    title: "5. Changes",
    body: "We may update these terms from time to time. Continued use of the service after changes means you accept the updated terms.",
  },
];

export default function TermsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Terms of Service</h1>
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