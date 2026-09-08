"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { demoPeriods } from "@/lib/demo-data";

type Period = "today" | "week";

export default function AnalyticsPage() {
  const router = useRouter();
  const { page } = useAuth();
  const [period, setPeriod] = useState<Period>("week");

  const data = demoPeriods.find((item) => period === "today" ? item.label === "Today" : item.label === "This Week") ?? demoPeriods[1];
  const published = page?.published ?? false;
  const views = data.totalViews;
  const clicks = data.totalClicks;
  const ctr = views > 0 ? Math.round((clicks / views) * 100) : 0;
  const maxViews = Math.max(...data.daily.map((item) => item.views), 1);
  const maxClicks = Math.max(...data.daily.map((item) => item.clicks), 1);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Analytics</h1>
          <p className="mt-1 text-[var(--muted)]">See the analytics experience and data model prepared for a future backend.</p>
        </div>
        <Badge variant="warning" dot>Demo/local sample data</Badge>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">These numbers are illustrative.</p>
        <p className="mt-1 text-xs leading-relaxed">Publishing your page does not start real tracking yet. Views, clicks and CTR below come from bundled demo data until an analytics backend is connected.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Analytics period">
        <button type="button" role="tab" aria-selected={period === "today"} className={`min-h-10 rounded-xl border px-4 py-2 text-sm font-semibold ${period === "today" ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] bg-white text-[var(--ink)]"}`} onClick={() => setPeriod("today")}>Today</button>
        <button type="button" role="tab" aria-selected={period === "week"} className={`min-h-10 rounded-xl border px-4 py-2 text-sm font-semibold ${period === "week" ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] bg-white text-[var(--ink)]"}`} onClick={() => setPeriod("week")}>This week</button>
      </div>

      {!published && (
        <Card variant="bordered">
          <CardBody className="py-8 text-center">
            <h2 className="text-lg font-semibold text-[var(--ink)]">Your page is still a draft</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">Publish from the editor when the page is ready. The analytics below stay demo-only until a backend is connected.</p>
            <CardFooter className="mt-5 flex justify-center"><Button onClick={() => router.push("/editor")}>Open editor</Button></CardFooter>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <Metric label="Views" value={views.toLocaleString()} note="Demo page views" />
        <Metric label="Clicks" value={clicks.toLocaleString()} note="Demo link clicks" />
        <Metric label="CTR" value={`${ctr}%`} note="Demo clicks per view" />
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Daily trend</CardTitle>
          <p className="text-xs text-[var(--muted)]">Illustrative {period === "today" ? "hourly" : "daily"} distribution</p>
        </CardHeader>
        <CardBody>
          <div className="flex h-40 items-end gap-2" aria-label="Demo views and clicks chart">
            {data.daily.map((item) => {
              const viewHeight = Math.max(8, (item.views / maxViews) * 100);
              const clickHeight = Math.max(8, (item.clicks / maxClicks) * 100);
              return (
                <div key={item.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end justify-center gap-1">
                    <div className="w-3 rounded-t-sm bg-[var(--color-brand-soft)]" style={{ height: `${viewHeight}%` }} title={`${item.views} demo views`} />
                    <div className="w-3 rounded-t-sm bg-[var(--accent)]" style={{ height: `${clickHeight}%` }} title={`${item.clicks} demo clicks`} />
                  </div>
                  <span className="truncate text-[10px] text-[var(--muted)]">{item.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end gap-4 text-xs text-[var(--muted)]"><span>Light = views</span><span>Accent = clicks</span></div>
        </CardBody>
      </Card>

      <Card variant="bordered">
        <CardHeader><CardTitle>Top links</CardTitle><p className="text-xs text-[var(--muted)]">Demo ranking for this period</p></CardHeader>
        <CardBody>
          <ul className="space-y-4">
            {data.topLinks.map((link, index) => (
              <li key={link.label} className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
                <span className="text-center text-xs font-semibold text-[var(--muted)]">{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-medium text-[var(--ink)]">{link.label}</span><span className="text-xs text-[var(--muted)]">{link.pct}%</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(2, link.pct)}%` }} /></div>
                </div>
                <span className="text-sm font-semibold text-[var(--ink)]">{link.clicks}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card variant="elevated"><CardBody><p className="text-sm text-[var(--muted)]">{label}</p><p className="mt-1 text-3xl font-semibold text-[var(--ink)]">{value}</p><p className="mt-2 text-xs text-[var(--muted)]">{note}</p></CardBody></Card>
  );
}
