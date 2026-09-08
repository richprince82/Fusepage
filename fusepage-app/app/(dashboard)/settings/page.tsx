"use client";

import { useState } from "react";
import { useAuth } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/dashboard/Avatar";
import { TIER_FEATURES } from "@/lib/billing";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);

  if (!user) return null;

  const tier = user.tier;
  const tierInfo = TIER_FEATURES[tier];
  const planLimit = tier === "pro" ? "5 pages" : "1 page";

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePlan = async () => {
    setSavingBilling(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingBilling(false);
  };

  const handleDelete = () => {
    if (window.confirm("This demo cannot permanently delete anything. Clearing your local session will sign you out.")) {
      logout();
      window.location.href = "/";
    }
  };

  const savedCheckmark = saved ? (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-[var(--ink)]">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );

  const trashIcon = (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Settings</h1>
        <p className="mt-1 text-[var(--muted)]">Manage your account, plan, and demo session.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* profile */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar user={user} size={56} />
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{user.name}</p>
                <p className="text-xs text-[var(--muted)]">{user.email}</p>
              </div>
            </div>

            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              hint="Email is used for local demo sessions only."
            />

            <div className="rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-3 text-xs text-[var(--brand)]">
              This demo stores your account locally in the browser. No data is sent to a server.
            </div>

            <CardFooter className="flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                loading={saving}
                disabled={saving || saved}
                left={savedCheckmark}
                onClick={handleSaveProfile}
              >
                {saved ? "Saved" : "Save profile"}
              </Button>
              <Button variant="ghost" size="md" disabled>
                Reset
              </Button>
            </CardFooter>
          </CardBody>
        </Card>

        {/* billing */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{tierInfo.name}</p>
                <p className="text-xs text-[var(--muted)]">Current plan</p>
              </div>
              <Badge variant={tier === "pro" ? "accent" : "default"} dot>
                {tierInfo.name}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Pages</span>
                <span className="text-[var(--ink)]">{planLimit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Links</span>
                <span className="text-[var(--ink)]">
                  {tier === "pro" ? "50 per page" : "12 per page"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Analytics</span>
                <span className="text-[var(--ink)]">{tierInfo.limits.analytics}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Branding</span>
                <span className="text-[var(--ink)]">{tierInfo.limits.branding}</span>
              </div>
            </div>

            {tier === "free" ? (
              <Button
                variant="primary"
                className="w-full"
                loading={savingBilling}
                onClick={handleChangePlan}
              >
                Upgrade to Pro
              </Button>
            ) : (
              <Button variant="secondary" className="w-full" disabled>
                Pro active
              </Button>
            )}

            <div className="rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-3 text-xs text-[var(--brand)]">
              Payment is not connected in this demo. Upgrade UX and Stripe integration are ready to wire.
            </div>
          </CardBody>
        </Card>

        {/* security */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Demo session</p>
                <p className="text-xs text-[var(--muted)]">Local demo account</p>
              </div>
              <Badge variant="info" dot>Demo</Badge>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-white p-3 text-sm text-[var(--muted)]">
              Your session is stored in this browser using localStorage. Clearing site data will sign you out.
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]" aria-hidden="true">
                  <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-sm text-[var(--ink)]">Session active</span>
              </div>
              <Badge variant="success" dot>Live</Badge>
            </div>
          </CardBody>
        </Card>

        {/* danger */}
        <Card variant="outlined" className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger zone</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-red-700">Clear demo session</p>
                <p className="text-xs text-red-600">Sign out and clear your local account.</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleDelete} left={trashIcon}>
                Sign out
              </Button>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              This does not delete anything permanently. It only clears the local demo session in this browser.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
