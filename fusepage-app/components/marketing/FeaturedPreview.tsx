"use client";

import { useState } from "react";
import { useAuth } from "@/lib/store";
import { appearanceTokens } from "@/hooks/use-appearance";
import { SocialIcon as SocialIconComp } from "@/components/ui/Icon";
import { type LinkBlock, type SocialLink } from "@/types";

export function FeaturedPreview() {
  const { user, page } = useAuth();

  const target = page ?? {
    profile: {
      name: user?.name ?? "Your Name",
      headline: "Creator, maker, freelancer.",
      bio: "Building things that matter. Sharing work, links, and what I'm up to next.",
      avatarUrl: user?.avatarUrl ?? undefined,
    },
    links: [
      { id: "1", type: "link", title: "Portfolio", url: "#", description: "A selection of recent work", visible: true, order: 0 },
      { id: "2", type: "link", title: "Contact", url: "#", description: "Get in touch", visible: true, order: 1 },
      { id: "3", type: "social", title: "Instagram", url: "#", description: "Behind the scenes", visible: true, order: 2 },
      { id: "4", type: "featured", title: "Featured project", url: "#", description: "A recent launch", visible: true, order: 3 },
    ],
    socialLinks: [
      { id: "s1", platform: "twitter", handle: "@creator", url: "#" },
      { id: "s2", platform: "instagram", handle: "@creator", url: "#" },
      { id: "s3", platform: "linkedin", handle: "creator", url: "#" },
    ],
    appearance: {
      theme: "clean",
      style: "rounded-soft",
      background: "solid",
      accentColor: "#0ea5e9",
      textColor: "#0f172a",
      buttonStyle: "filled",
    },
    tier: "free",
    slug: "preview",
    published: true,
    createdAt: "",
    updatedAt: "",
  };

  const tokens = appearanceTokens(target.appearance);
  const isPro = target.tier === "pro";
  const initials = target.profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") ?? "??";

  const pill = (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: isPro ? "var(--accent)" : "var(--color-brand-soft)",
        color: isPro ? "white" : "var(--brand)",
      }}
    >
      {isPro ? "Pro · no branding" : "Free tier branding"}
    </span>
  );

  return (
    <div className="relative flex flex-col items-start gap-3">
      {/* phone frame */}
      <div
        className="relative w-[320px] max-w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]"
        style={{ aspectRatio: "9 / 19.5", maxHeight: "640px" }}
        role="img"
        aria-label="Preview of a public Fusepage mini-site"
      >
        <div style={{ background: tokens.bg, minHeight: "100%" }} className="flex flex-col">
          {/* status bar */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted)]">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34c759]" />
              <span className="inline-block h-1.5 w-[16px] rounded-sm bg-[#007aff]" />
              <span className="inline-block h-1.5 w-1.5 rounded-sm bg-[#ff9500]" />
            </div>
          </div>

          {/* profile card */}
          <div className="flex flex-col items-center p-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xl font-semibold shadow-sm">
              {target.profile.avatarUrl ? (
                <img src={target.profile.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-[15px] font-semibold text-[var(--ink)] leading-tight">{target.profile.name || "Your Name"}</h3>
              {target.profile.headline && <p className="mt-0.5 text-[12px] text-[var(--muted)]">{target.profile.headline}</p>}
            </div>
            {target.profile.bio && (
              <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-[var(--muted)]">{target.profile.bio}</p>
            )}
          </div>

          {/* links */}
          <div className="flex flex-1 flex-col px-4 pb-3 pt-2">
            {target.links.filter((l: LinkBlock) => l.visible).map((link: LinkBlock) => {
              const accent = tokens.accent;
              if (link.type === "featured") {
                return (
                  <div key={link.id} className="mb-3 rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Featured</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{link.title || "Featured project"}</p>
                    {link.description && <p className="mt-0.5 text-xs text-[var(--muted)]">{link.description}</p>}
                    <a
                      href={link.url || "#"}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link.title || "View"} <span className="text-xs">→</span>
                    </a>
                  </div>
                );
              }
              return (
                <a
                  key={link.id}
                  href={link.url || "#"}
                  className="group flex flex-1 items-center gap-3 rounded-xl bg-white border border-[var(--border)] px-4 py-3.5 text-left shadow-sm transition-colors hover:border-[var(--border-strong)] hover:shadow-sm"
                  onClick={(e) => e.preventDefault()}
                  style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors group-hover:bg-[var(--color-brand-soft)] group-hover:text-[var(--accent)]"
                    style={{ color: accent }}
                  >
                    {link.type === "social" ? (
                      <SocialIconComp platform="twitter" size={18} />
                    ) : (
                      <span className="text-sm font-semibold">{link.title?.[0]?.toUpperCase() ?? "#"}</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">{link.title || "Link"}</p>
                    {link.description && <p className="truncate text-xs text-[var(--muted)]">{link.description}</p>}
                  </div>
                  <span className="text-[var(--muted)] group-hover:hidden opacity-0 group-hover:opacity-100">→</span>
                </a>
              );
            })}
          </div>

          {/* social footer */}
          {target.socialLinks.length > 0 && (
            <div className="border-t border-[var(--border)] px-4 py-3">
              <div className="flex items-center justify-center gap-3 text-[var(--muted)]">
                {target.socialLinks.slice(0, 4).map((s: SocialLink) => (
                  <a
                    key={s.id}
                    href={s.url || "#"}
                    className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    onClick={(e) => e.preventDefault()}
                    aria-label={`${s.platform}: ${s.handle}`}
                  >
                    <SocialIconComp platform={s.platform} size={20} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* branding bar for free tier */}
          {!isPro && (
            <div className="border-t border-[var(--border)] bg-[var(--color-brand-soft)] px-4 py-2 text-center text-[11px] font-medium text-[var(--brand)]">
              Published with Fusepage
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <span>Live preview</span>
        {pill}
      </div>
    </div>
  );
}
