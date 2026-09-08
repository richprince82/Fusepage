"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/store";
import { AnchorButton } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FeaturedPreview } from "@/components/marketing/FeaturedPreview";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icon";

const FEATURES = [
  ["A mini-site that gets attention", "Put your identity, best links and featured work on one polished page."],
  ["Fast visual control", "Themes, colors, backgrounds and button styles update in the editor preview."],
  ["Links that stay organized", "Add, hide, reorder and feature content without rebuilding the page."],
  ["Useful analytics", "See demo/local views, clicks, CTR and top links today, with a backend-ready model for later."],
  ["Built to grow", "Start free, then connect billing, custom domains and richer analytics when the business is ready."],
];

const USE_CASES = [
  ["Creators", "Put videos, socials, shops and your newest launch behind one memorable link."],
  ["Freelancers", "Share portfolio work, availability, contact details and a clear route to hire you."],
  ["Small businesses", "Turn social traffic into calls, menus, bookings, offers and location information."],
  ["Professionals", "Package your profile, work history, writing and contact details into one shareable page."],
];

const TESTIMONIAL_EXAMPLES = [
  ["Example creator", "“I want one link where people can immediately find my newest work and the channels I care about.”"],
  ["Example freelancer", "“A clean page is more useful to me than sending five different links to every client.”"],
  ["Example small business", "“The ideal page should make the next action obvious: call, book, order or visit.”"],
];

const FAQ = [
  ["Is Fusepage free?", "Yes. The MVP Free plan includes one published page, core themes, up to 12 links and basic analytics UX."],
  ["Can I change the design later?", "Yes. Your theme, accent, background, page shape and button style remain editable."],
  ["Is payment live already?", "No. This MVP keeps billing in a safe integration boundary until real provider credentials are configured."],
  ["Can I connect my own domain?", "The Pro product model includes custom-domain architecture as a future integration point."],
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}

export default function MarketingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const signedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Primary">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">F</span>
            Fusepage
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            <Link href="#features" className="hover:text-[var(--ink)]">Features</Link>
            <Link href="#use-cases" className="hover:text-[var(--ink)]">Use cases</Link>
            <Link href="#pricing" className="hover:text-[var(--ink)]">Pricing</Link>
            <Link href="#faq" className="hover:text-[var(--ink)]">FAQ</Link>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {signedIn ? <AnchorButton href="/dashboard" variant="primary">Dashboard</AnchorButton> : <><AnchorButton href="/sign-in" variant="ghost">Sign in</AnchorButton><AnchorButton href="/sign-up" variant="primary">Get started</AnchorButton></>}
          </div>
          <button type="button" className="rounded-lg p-2 md:hidden" aria-label="Toggle menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((value) => !value)}>{mobileMenuOpen ? "✕" : "☰"}</button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-[var(--border)] bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              {[["#features", "Features"], ["#use-cases", "Use cases"], ["#pricing", "Pricing"], ["#faq", "FAQ"]].map(([href, label]) => <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>{label}</Link>)}
              <div className="mt-2 border-t border-[var(--border)] pt-3">{signedIn ? <AnchorButton href="/dashboard" className="w-full">Dashboard</AnchorButton> : <div className="grid gap-2"><AnchorButton href="/sign-in" variant="secondary" className="w-full">Sign in</AnchorButton><AnchorButton href="/sign-up" className="w-full">Get started</AnchorButton></div>}</div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1fr_420px] lg:items-center lg:py-24">
            <div>
              <Badge variant="default">Link in bio, upgraded</Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl">One shareable page for the work, links and identity that matter.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">Fusepage helps creators, freelancers, businesses and professionals build a polished mini-site, publish it and understand what visitors click.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AnchorButton href={signedIn ? "/dashboard" : "/sign-up"} variant="primary" size="lg" right={<ArrowRightIcon size={16} />}>{signedIn ? "Open dashboard" : "Create your page"}</AnchorButton>
                <AnchorButton href="#features" variant="secondary" size="lg">See how it works</AnchorButton>
              </div>
              <p className="mt-5 text-xs text-[var(--muted)]">No credit card required for the demo/local MVP.</p>
            </div>
            <div className="flex justify-center"><FeaturedPreview /></div>
          </div>
        </section>

        <section id="features" className="border-y border-[var(--border)] bg-[var(--color-brand-soft)]/30 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading eyebrow="Features" title="A focused product instead of another cluttered profile tool" subtitle="Every major action supports the core journey: set up, edit, preview, publish and learn." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(([title, description]) => <Card key={title} variant="bordered"><CardBody><h3 className="font-semibold text-[var(--ink)]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p></CardBody></Card>)}
            </div>
          </div>
        </section>

        <section id="use-cases" className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading eyebrow="Use cases" title="Built for people with something worth sharing" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {USE_CASES.map(([title, description], index) => (
                <Card key={title} variant="bordered"><CardBody><span className="text-xs font-semibold text-[var(--brand)]">0{index + 1}</span><h3 className="mt-3 text-lg font-semibold text-[var(--ink)]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p></CardBody></Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border)] bg-white py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading eyebrow="Example feedback" title="Illustrative testimonials, not customer claims" subtitle="These examples show the kind of problems Fusepage is designed to solve. They are placeholders until real customer feedback exists." />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {TESTIMONIAL_EXAMPLES.map(([name, quote]) => <Card key={name} variant="bordered"><CardBody><p className="text-sm leading-relaxed text-[var(--ink)]">{quote}</p><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{name} · illustrative example</p></CardBody></Card>)}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-5xl px-5">
            <SectionHeading eyebrow="Pricing" title="Start free, pay when the extra leverage matters" />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <PricingCard title="Free" price="$0" description="For a focused first page" features={["1 published Fusepage", "Up to 12 links", "Core themes", "Basic analytics UX", "Fusepage branding"]} href="/sign-up" cta="Start free" />
              <PricingCard title="Pro" price="$12/mo" description="For a more professional presence" features={["Up to 5 pages", "Up to 50 links", "All themes", "Advanced analytics architecture", "No Fusepage branding", "Custom-domain architecture"]} href="/upgrade" cta="Explore Pro" featured />
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-[var(--border)] bg-[var(--color-brand-soft)]/20 py-20">
          <div className="mx-auto max-w-3xl px-5">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
            <div className="mt-10 space-y-3">
              {FAQ.map(([question, answer], index) => (
                <div key={question} className="rounded-xl border border-[var(--border)] bg-white">
                  <button type="button" className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-[var(--ink)]" aria-expanded={openFaq === index} onClick={() => setOpenFaq((current) => current === index ? null : index)}><span>{question}</span><span aria-hidden="true">{openFaq === index ? "−" : "+"}</span></button>
                  {openFaq === index && <p className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">{answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-5">
            <div className="rounded-3xl bg-[var(--ink)] px-6 py-12 text-center text-white sm:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Ready when you are</p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Turn scattered links into one page you are proud to share.</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">Create the draft, shape the look, publish when it is ready and keep improving from one dashboard.</p>
              <div className="mt-7 flex justify-center"><AnchorButton href={signedIn ? "/dashboard" : "/sign-up"} variant="primary" size="lg">{signedIn ? "Continue building" : "Create your Fusepage"}</AnchorButton></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">F</span><span className="font-semibold text-[var(--ink)]">Fusepage</span></div>
          <nav className="flex flex-wrap gap-5"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/sign-in">Sign in</Link></nav>
          <p className="text-xs">© {new Date().getFullYear()} Fusepage · MVP demo</p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ title, price, description, features, href, cta, featured = false }: { title: string; price: string; description: string; features: string[]; href: string; cta: string; featured?: boolean }) {
  return (
    <Card variant={featured ? "elevated" : "bordered"} className={featured ? "ring-1 ring-[var(--accent)]" : ""}>
      <CardBody>
        {featured && <Badge variant="info">Most popular</Badge>}
        <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">{price}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        <ul className="mt-6 space-y-2 text-sm text-[var(--ink)]">{features.map((feature) => <li key={feature} className="flex items-start gap-2"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />{feature}</li>)}</ul>
        <div className="mt-6"><AnchorButton href={href} variant={featured ? "primary" : "secondary"} className="w-full">{cta}</AnchorButton></div>
      </CardBody>
    </Card>
  );
}
