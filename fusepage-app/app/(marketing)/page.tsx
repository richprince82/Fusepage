"use client";

import { useAuth } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FeaturedPreview } from "@/components/marketing/FeaturedPreview";
import {
  ArrowRightIcon,
  CheckIcon,
} from "@/components/ui/Icon";

const FEATURES = [
  {
    title: "A mini-site that gets attention",
    description:
      "Turn a link into a beautiful page with your portrait, bio, and the links you actually want people to click.",
  },
  {
    title: "Choose your vibe in seconds",
    description:
      "Pick a theme, set an accent, and toggle button styles. Your page reflects you without fighting a design tool.",
  },
  {
    title: "Link blocks that matter",
    description:
      "Add links, social profiles, and featured highlights. Reorder them, hide drafts, and publish when you're ready.",
  },
  {
    title: "Track what clicks",
    description:
      "See views, clicks, top links, and daily trends. Understand what your audience cares about most.",
  },
  {
    title: "Pro polish when you need it",
    description:
      "More pages, more links, richer themes, and no Fusepage branding. Made for creators who are serious about their presence.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I replaced three separate links with one Fusepage. My audience actually stays on the page now.",
    name: "Mia Tran",
    role: "Independent designer",
  },
  {
    quote:
      "The themes are subtle but make a real difference. It feels like my site, not a template.",
    name: "Jordi Ferreira",
    role: "Freelance writer",
  },
  {
    quote:
      "Analytics that I can read in a minute. Finally, a link page that tells me something useful.",
    name: "Priya Anand",
    role: "Small business owner",
  },
];

const FAQ = [
  {
    question: "Is Fusepage free?",
    answer:
      "Yes. The free plan includes one published Fusepage, core themes, up to 12 links, and basic analytics.",
  },
  {
    question: "Can I change the look later?",
    answer:
      "Absolutely. Themes, accents, backgrounds, and button styles can be updated anytime from the editor.",
  },
  {
    question: "What happens if I upgrade to Pro?",
    answer:
      "Pro unlocks all themes, more pages, more links, advanced analytics, no Fusepage branding, and priority support.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Custom domain support is part of the Pro architecture. Connect your domain once your page is ready.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card variant="bordered" className="h-full">
      <CardBody>
        <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{description}</p>
      </CardBody>
    </Card>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <Card variant="bordered">
      <CardBody>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{quote}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)] font-semibold text-sm">
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">{name}</p>
            <p className="text-xs text-[var(--muted)]">{role}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="group rounded-xl border border-[var(--border)] bg-white" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 select-none text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
        <span className="text-sm font-semibold text-[var(--ink)]">{question}</span>
        <ArrowRightIcon
          size={16}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </summary>
      <div className="border-t border-[var(--border)] px-5 pb-4 pt-2 text-sm text-[var(--muted)] leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

export default function MarketingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const signedIn = !!user;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* top bar */}
      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Primary">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]" aria-label="Fusepage home">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white text-sm font-semibold">F</span>
            Fusepage
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            <Link href="#features" className="hover:text-[var(--ink)]">Features</Link>
            <Link href="#pricing" className="hover:text-[var(--ink)]">Pricing</Link>
            <Link href="#faq" className="hover:text-[var(--ink)]">FAQ</Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {signedIn ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="md">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="md">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="md">Get started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-[var(--ink)]">
              {mobileMenuOpen ? (
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </span>
          </button>
        </nav>

        {/* mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-[var(--border)] bg-white px-5 pb-5 pt-3">
            <nav className="flex flex-col gap-3 text-sm font-medium text-[var(--ink)]" aria-label="Mobile">
              <Link href="#features" className="block rounded-lg py-2 hover:bg-[var(--color-brand-soft)]" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#pricing" className="block rounded-lg py-2 hover:bg-[var(--color-brand-soft)]" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="#faq" className="block rounded-lg py-2 hover:bg-[var(--color-brand-soft)]" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <div className="mt-2 flex flex-col gap-2">
                {signedIn ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="md" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="md" className="w-full">Get started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* hero */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <Badge variant="default" className="mb-4">Link in bio, leveled up</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
              One page that says who you are
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
              Build a polished mini-site and link-in-bio page from one dashboard. Share it everywhere,
              track what matters, and keep your audience moving toward the links you care about.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {signedIn ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Go to your dashboard
                    <ArrowRightIcon size={16} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Start for free
                      <ArrowRightIcon size={16} />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">No credit card required. Free tier includes one published page.</p>
          </div>
        </div>
      </section>

      {/* preview */}
      <section className="bg-[var(--color-brand-soft)]/30 border-y border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Live preview"
              title="The page your links deserve"
              subtitle="A real Fusepage preview, styled in a clean theme with accent borders and social links."
            />
          </div>
          <div className="mt-8 flex justify-center">
            <FeaturedPreview />
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Features"
              title="Everything a link page needs"
              subtitle="No clutter. No code. Just a page you can publish, share, and improve."
            />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="bg-[var(--color-brand-soft)]/20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="From the community"
              title="What creators say"
            />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Plans"
              title="Simple pricing, clear limits"
              subtitle="Start free. Upgrade when you need more pages, themes, or a cleaner look."
            />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {["free", "pro"].map((tier) => {
              const plan = tier === "free" ? {
                name: "Free",
                price: "$0",
                period: "/month",
                badge: null,
                mostPopular: false,
                limit: "1 published page",
                accent: false,
              } : {
                name: "Pro",
                price: "$12",
                period: "/month or $120/year",
                badge: "Most popular",
                mostPopular: true,
                limit: "Up to 5 pages",
                accent: true,
              };
              return (
                <Card key={tier} variant={plan.mostPopular ? "elevated" : "bordered"} className={plan.mostPopular ? "ring-1 ring-[var(--accent)]" : ""}>
                  {plan.badge && <div className="mb-3"><Badge variant={plan.accent ? "info" : "default"} dot>{plan.badge}</Badge></div>}
                  <CardBody>
                    <div className="text-3xl font-semibold text-[var(--ink)]">{plan.price}</div>
                    <p className="mt-1 text-sm text-[var(--muted)]">{plan.period}</p>
                    <h3 className="mt-6 text-lg font-semibold text-[var(--ink)]">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{plan.limit}</p>
                    <ul className="mt-6 space-y-2 text-sm">
                      {tier === "free" ? (
                        <>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>1 published Fusepage</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Core themes</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Up to 12 links</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Basic analytics</span></li>
                          <li className="flex items-start gap-2 text-[var(--muted)]"><span className="mt-0.5 shrink-0">Fusepage branding</span></li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Up to 5 published Fusepages</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>All themes, including premium</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Up to 50 links</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>Advanced analytics & top links</span></li>
                          <li className="flex items-start gap-2 text-[var(--ink)]"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" /> <span>No Fusepage branding</span></li>
                        </>
                      )}
                    </ul>
                    <div className="mt-6">
                      {signedIn && user?.tier === tier ? (
                        <Link href="/dashboard">
                          <Button variant="secondary" size="md" className="w-full">Go to dashboard</Button>
                        </Link>
                      ) : (
                        <Link href={tier === "free" ? "/sign-up" : "/upgrade"}>
                          <Button variant={plan.mostPopular ? "primary" : "secondary"} size="md" className="w-full">
                            {tier === "free" ? "Start free" : "Upgrade to Pro"}
                            <ArrowRightIcon size={16} />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[var(--color-brand-soft)]/20 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
            />
          </div>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-[var(--muted)] sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-semibold">F</span>
              <span className="font-semibold text-[var(--ink)]">Fusepage</span>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
              <Link href="/sign-up" className="hover:text-[var(--ink)]">Start free</Link>
              <Link href="/sign-in" className="hover:text-[var(--ink)]">Sign in</Link>
              <Link href="/dashboard" className="hover:text-[var(--ink)]">Dashboard</Link>
              <Link href="/terms" className="hover:text-[var(--ink)]">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--ink)]">Privacy</Link>
            </nav>
            <p className="text-xs">© {new Date().getFullYear()} Fusepage. Demo app.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
