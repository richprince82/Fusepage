"use client";

import { useState } from "react";
import { useAuth } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { demoPeriods } from "@/lib/demo-data";

type Period = "today" | "week";

export default function AnalyticsPage() {
  const { page } = useAuth();
  const [period, setPeriod] = useState<Period>("week");

  const data = demoPeriods.find((d) =>
    period === "today" ? d.label === "Today" : d.label === "This Week"
  ) ?? demoPeriods[1];

  const maxViews = Math.max(...data.daily.map((d) => d.views), 1);
  const maxClicks = Math.max(...data.daily.map((d) => d.clicks), 1);

  const published = page?.published ?? false;
  const views = data.totalViews;
  const clicks = data.totalClicks;
  const ctr = views > 0 ? Math.round((clicks / views) * 100) : 0;

  const chevronDown =
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Analytics</h1>
        <p className="mt-1 text-[var(--muted)]">
          {published
            ? "See how people are interacting with your live Fusepage."
            : "Publish your page to start collecting real analytics."}
        </p>
      </div>

      {/* period switcher */}
      <div className="flex gap-2" role="tablist" aria-label="Analytics period">
        <button
          type="button"
          role="tab"
          aria-selected={period === "today"}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
            period === "today"
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border)] text-[var(--ink)] hover:bg-[var(--color-brand-soft)]"
          }`}
          onClick={() => setPeriod("today")}
        >
          Today
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={period === "week"}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
            period === "week"
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border)] text-[var(--ink)] hover:bg-[var(--color-brand-soft)]"
          }`}
          onClick={() => setPeriod("week")}
        >
          This week
        </button>
      </div>

      {!published ? (
        <Card variant="bordered" className="text-center py-12">
          <CardBody>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)]">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Your page is not live yet</h2>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">
              Publish your page to see real views and clicks here. Until then, this dashboard shows demo data from a typical week.
            </p>
            <CardFooter className="mt-6 flex justify-center">
              <Button variant="primary" size="md" onClick={() => window.location.href = "/editor"} left={chevronDown}>
                Publish your page
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* summary */}
          <div className="grid gap-5 sm:grid-cols-3">
            <Card variant="elevated">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)]">Views</p>
                    <p className="text-3xl font-semibold text-[var(--ink)]">{views.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 p-2 text-emerald-700">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">Total page views</p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)]">Clicks</p>
                    <p className="text-3xl font-semibold text-[var(--ink)]">{clicks.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-sky-50 p-2 text-sky-700">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">Link clicks</p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)]">Click-through rate</p>
                    <p className="text-3xl font-semibold text-[var(--ink)]">{ctr}%</p>
                  </div>
                  <Badge variant={ctr >= 20 ? "success" : ctr >= 10 ? "info" : "muted"} dot>
                    {ctr >= 20 ? "Great" : ctr >= 10 ? "Good" : "Growing"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">Clicks per view</p>
              </CardBody>
            </Card>
          </div>

          {/* daily trend */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Daily trend</CardTitle>
              <p className="text-xs text-[var(--muted)]">
                {period === "today" ? "Views and clicks by hour" : "Views and clicks by day"}
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-1 sm:gap-2" style={{ height: "120px" }}>
                  {data.daily.map((d, i) => {
                    const h = Math.max(8, (d.views / maxViews) * 100);
                    const hc = Math.max(8, (d.clicks / maxClicks) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex items-end gap-0.5 h-full" style={{ height: "100%" }}>
                          <div
                            className="rounded-t-sm bg-[var(--color-brand-soft)]"
                            style={{ height: `${h}%`, minHeight: "4px" }}
                            title={`${d.views} views`}
                            aria-label={`${d.views} views`}
                          />
                          <div
                            className="rounded-t-sm bg-[var(--accent)] opacity-70"
                            style={{ height: `${hc}%`, minHeight: "4px" }}
                            title={`${d.clicks} clicks`}
                            aria-label={`${d.clicks} clicks`}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--muted)]">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end gap-4 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--color-brand-soft)]" />
                    Views
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--accent)] opacity-70" />
                    Clicks
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* top links */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Top links</CardTitle>
              <p className="text-xs text-[var(--muted)]">Most clicked links in this period</p>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {data.topLinks.map((link, i) => {
                  const pct = link.pct;
                  const pctWidth = Math.max(2, pct);
                  return (
                    <li key={link.label} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-center text-xs font-semibold text-[var(--muted)]">{i + 1}</span>
                      <span className="w-28 shrink-0 text-sm text-[var(--ink)]">{link.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${pctWidth}%` }}
                          role="presentation"
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-semibold text-[var(--ink)]">
                        {link.clicks}
                      </span>
                      <span className="w-10 text-right text-xs text-[var(--muted)]">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
