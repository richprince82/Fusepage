"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/dashboard/Avatar";
import { PencilIcon } from "@/components/ui/Icon";

export default function DashboardPage() {
  const router = useRouter();
  const { user, page, upsertPage } = useAuth();

  if (!user) return null;

  const published = page?.published ?? false;
  const slug = page?.slug ?? (user.username ?? "your-page-slug");
  const publicUrl = `/u/${slug}`;
  const linkCount = page?.links?.filter((l) => l.visible).length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] p-5">
      <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
            {user.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Your dashboard"}
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Manage your Fusepage, track engagement, and upgrade when you are ready.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--brand)]">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--ink)]">{published ? "Live" : "Draft"}</p>
                  <p className="text-xs text-[var(--muted)]">Page status</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--brand)]">
                  <PencilIcon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--ink)]">{linkCount}</p>
                  <p className="text-xs text-[var(--muted)]">Visible links</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--brand)]">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--ink)]">
                    {page?.tier === "pro" ? "Pro" : "Free"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Current plan</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--brand)]">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22 6 12 13 2 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)] truncate max-w-[140px]">
                    fusepage.app/{slug}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Public page URL</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button
                variant="primary"
                left={<PencilIcon size={16} />}
                className="w-full"
                onClick={() => router.push("/editor")}
              >
                Edit my page
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={published ? "primary" : "secondary"}
                  className="flex-1"
                  onClick={() => {
                    if (page) {
                      upsertPage({ ...page, published: !published, updatedAt: new Date().toISOString() });
                    }
                  }}
                >
                  {published ? "Unpublish" : "Publish now"}
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => router.push("/analytics")}>
                  Analytics
                </Button>
              </div>
              {published && (
                <Button variant="secondary" size="sm" className="w-full" onClick={() => window.open(publicUrl, "_blank", "noopener,noreferrer")}>
                  Open public page
                </Button>
              )}
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              {page?.published && <Badge variant="success" dot>Live</Badge>}
            </CardHeader>
            <CardBody>
              {page && page.links.length > 0 ? (
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--accent)]" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[var(--ink)]">Page has {linkCount} visible link{linkCount === 1 ? "" : "s"}.</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--accent)]" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[var(--ink)]">
                      {user.name && `${user.name.split(" ")[0]}`} can edit profile, links, and theme.
                    </span>
                  </li>
                  {page.tier === "pro" ? (
                    <li className="flex items-center gap-3 text-sm">
                      <Badge variant="accent" size="md">Pro</Badge>
                      <span className="text-[var(--ink)]">No Fusepage branding on your page.</span>
                    </li>
                  ) : (
                    <li className="flex items-start gap-3 text-sm text-[var(--muted)]">
                      <span>Upgrade to Pro to remove Fusepage branding and unlock all themes.</span>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <Avatar user={user} size={48} />
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">Your page is empty</p>
                    <p className="text-xs text-[var(--muted)]">Add links and a bio from the editor.</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => router.push("/editor")}>
                    Edit now
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-brand-soft)] p-4 text-sm text-[var(--brand)]">
          <p className="font-semibold">Tip</p>
          <p className="mt-1">
            A good Fusepage has a clear name, a short bio, and links people actually want. Start with your most important link.
          </p>
        </div>
      </div>
    </div>
  );
}
