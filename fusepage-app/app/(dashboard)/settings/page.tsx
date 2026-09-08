"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/dashboard/Avatar";
import { TIER_FEATURES } from "@/lib/billing";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const tierInfo = TIER_FEATURES[user.tier];

  const saveProfile = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    updateUser({ name: name.trim() || user.name, email: email.trim() || user.email });
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const clearDemoSession = () => {
    const confirmed = window.confirm("Clear the local Fusepage demo session and sign out?");
    if (!confirmed) return;
    logout();
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Settings</h1>
        <p className="mt-1 text-[var(--muted)]">Manage your local demo account, plan and session.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="bordered">
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar user={user} size={56} />
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--ink)]">{user.name}</p><p className="truncate text-xs text-[var(--muted)]">{user.email}</p></div>
            </div>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" hint="Used only by this local demo session." />
            <CardFooter className="flex items-center gap-3">
              <Button loading={saving} disabled={saved} onClick={saveProfile}>{saved ? "Saved" : "Save profile"}</Button>
              {saved && <span className="text-xs font-medium text-emerald-700" role="status">Changes saved locally.</span>}
            </CardFooter>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-[var(--ink)]">{tierInfo.name}</p><p className="text-xs text-[var(--muted)]">Current local/demo tier</p></div><Badge variant={user.tier === "pro" ? "accent" : "default"} dot>{tierInfo.name}</Badge></div>
            <div className="space-y-2 text-sm text-[var(--ink)]">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Pages</span><span>{tierInfo.limits.pages}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Links/page</span><span>{tierInfo.limits.links}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Analytics</span><span>{tierInfo.limits.analytics}</span></div>
            </div>
            {user.tier === "free" ? (
              <Button className="w-full" onClick={() => router.push("/upgrade")}>Explore Pro</Button>
            ) : (
              <Button variant="secondary" className="w-full" disabled>Pro active</Button>
            )}
            <p className="rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-3 text-xs leading-relaxed text-[var(--brand)]">Live payment is intentionally not connected in this MVP. The upgrade screen explains the provider boundary instead of pretending checkout succeeded.</p>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader><CardTitle>Session</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-[var(--ink)]">Browser-local demo</p><p className="text-xs text-[var(--muted)]">Stored with localStorage on this device</p></div><Badge variant="info" dot>Demo</Badge></div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">No Fusepage account data is sent to a backend yet. Clearing site data or this session removes the local demo account.</p>
            <Button variant="danger" onClick={clearDemoSession}>Clear demo session</Button>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader><CardTitle>Product status</CardTitle></CardHeader>
          <CardBody className="space-y-3 text-sm text-[var(--muted)]">
            <p><strong className="text-[var(--ink)]">Auth:</strong> local demo abstraction, backend-ready.</p>
            <p><strong className="text-[var(--ink)]">Billing:</strong> integration boundary documented, checkout not live.</p>
            <p><strong className="text-[var(--ink)]">Analytics:</strong> sample data clearly labeled as demo/local.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
