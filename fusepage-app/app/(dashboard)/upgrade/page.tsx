"use client";

import { useAuth } from "@/lib/store";
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon } from "@/components/ui/Icon";
import { TIER_FEATURES } from "@/lib/billing";

export default function UpgradePage() {
  const { user } = useAuth();
  const isSignedIn = !!user;

  const free = TIER_FEATURES.free;
  const pro = TIER_FEATURES.pro;

  const featureRows = [
    { label: "Published Fusepages", free: String(free.limits.pages), pro: String(pro.limits.pages) },
    { label: "Links per page", free: String(free.limits.links), pro: String(pro.limits.links) },
    { label: "Themes", free: `${free.limits.themes.length} themes`, pro: "All themes" },
    { label: "Analytics", free: free.limits.analytics, pro: pro.limits.analytics },
    { label: "Branding", free: free.limits.branding, pro: pro.limits.branding },
    { label: "Custom domain", free: free.limits.customDomain ? "Yes" : "Coming soon", pro: "Yes" },
    { label: "Support", free: free.limits.support, pro: pro.limits.support },
  ];

  const arrowRight =
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-1">
      <polyline points="9 18 15 12 9 6" />
    </svg>;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Upgrade to Pro</h1>
        <p className="mt-2 text-[var(--muted)]">
          {isSignedIn
            ? "Unlock more pages, themes, links, and a cleaner look for your Fusepage."
            : "Get more pages, themes, and a cleaner look for your Fusepage."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_2fr]">
        {/* plan summary */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Pro plan</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-[var(--ink)]">$12</span>
              <span className="text-[var(--muted)]">/month</span>
            </div>
            <p className="text-sm text-[var(--muted)]">or $120/year ($10/month equivalent)</p>
            <ul className="space-y-2 text-sm">
              {pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[var(--ink)]">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="pt-2">
              {isSignedIn && user?.tier === "pro" ? (
                <Badge variant="accent" dot>Pro member</Badge>
              ) : (
                <Badge variant="info" dot>Most popular</Badge>
              )}
            </div>
          </CardBody>
          <CardFooter>
            {isSignedIn ? (
              <Button variant="primary" className="w-full" onClick={() => window.location.href = "/dashboard"}>
                Go to dashboard
              </Button>
            ) : (
              <Button variant="primary" className="w-full" onClick={() => window.location.href = "/sign-up"}>
                Start free, upgrade later{arrowRight}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* comparison */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Free vs Pro</CardTitle>
          </CardHeader>
          <CardBody>
            <table className="w-full text-sm">
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="py-3 pr-3 text-[var(--muted)]">{row.label}</td>
                    <td className="py-3 pr-3 text-[var(--ink)]">{row.free}</td>
                    <td className="py-3 text-[var(--ink)] font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-4 text-sm text-[var(--brand)]">
              <p className="font-semibold">Note</p>
              <p>Checkout is not wired to a live payment provider in this demo. Upgrade UX and Stripe integration are ready to connect.</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* FAQ-like summary */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Why upgrade?</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 text-sm text-[var(--ink)]">
          <p>Pro gives you more room to grow: more pages, more links, premium themes, and analytics that help you understand what people click.</p>
          <p>You keep your current page. Upgrading unlocks Pro features without changing what already works.</p>
        </CardBody>
      </Card>
    </div>
  );
}
