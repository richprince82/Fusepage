"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon } from "@/components/ui/Icon";
import { TIER_FEATURES } from "@/lib/billing";

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth();
  const free = TIER_FEATURES.free;
  const pro = TIER_FEATURES.pro;

  const rows = [
    ["Published pages", String(free.limits.pages), String(pro.limits.pages)],
    ["Links per page", String(free.limits.links), String(pro.limits.links)],
    ["Themes", `${free.limits.themes.length} core`, "All themes"],
    ["Analytics", free.limits.analytics, pro.limits.analytics],
    ["Branding", "Fusepage branding", "None"],
    ["Custom domain", "Not included", "Architecture ready"],
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-5">
      <div>
        <Badge variant="info">Pro</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Upgrade when the extra leverage matters</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">The MVP models the Pro product and billing boundary without pretending a live checkout exists before provider credentials and the server adapter are connected.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card variant="elevated">
          <CardHeader><CardTitle>Pro plan</CardTitle></CardHeader>
          <CardBody className="space-y-5">
            <div><span className="text-4xl font-semibold text-[var(--ink)]">$12</span><span className="text-[var(--muted)]">/month</span><p className="mt-1 text-sm text-[var(--muted)]">or $120/year</p></div>
            <ul className="space-y-2 text-sm text-[var(--ink)]">
              {pro.features.map((feature) => <li key={feature} className="flex items-start gap-2"><CheckIcon size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />{feature}</li>)}
            </ul>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Checkout is intentionally disabled in this demo.</p>
              <p className="mt-1 text-xs leading-relaxed">Connect a real Stripe server adapter and environment variables before accepting payment. No fake transaction is performed here.</p>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col gap-2">
            {user?.tier === "pro" ? <Button variant="secondary" className="w-full" disabled>Pro active</Button> : <Button className="w-full" disabled>Checkout unavailable in demo</Button>}
            <Button variant="ghost" className="w-full" onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
          </CardFooter>
        </Card>

        <Card variant="bordered">
          <CardHeader><CardTitle>Free vs Pro</CardTitle></CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead><tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]"><th className="py-3 pr-3">Feature</th><th className="py-3 pr-3">Free</th><th className="py-3">Pro</th></tr></thead>
                <tbody>{rows.map(([label, freeValue, proValue]) => <tr key={label} className="border-b border-[var(--border)] last:border-b-0"><td className="py-3 pr-3 text-[var(--muted)]">{label}</td><td className="py-3 pr-3 text-[var(--ink)]">{freeValue}</td><td className="py-3 font-medium text-[var(--ink)]">{proValue}</td></tr>)}</tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
