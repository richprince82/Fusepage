"use client";

import Image from "next/image";
import { useAuth } from "@/lib/store";
import { appearanceTokens, buttonAppearanceStyle } from "@/hooks/use-appearance";
import { SocialIcon as SocialIconComp } from "@/components/ui/Icon";
import { type Page } from "@/types";

export function FeaturedPreview({ pageOverride }: { pageOverride?: Page | null }) {
  const { user, page } = useAuth();

  const target: Page = pageOverride ?? page ?? {
    id: "preview",
    userId: "preview",
    profile: {
      name: user?.name ?? "Your Name",
      username: "preview",
      headline: "Creator, maker, freelancer.",
      bio: "Building things that matter. Sharing work, links, and what comes next.",
      avatarUrl: user?.avatarUrl,
    },
    links: [
      { id: "1", type: "link", title: "Portfolio", url: "#", description: "A selection of recent work", visible: true, order: 0 },
      { id: "2", type: "link", title: "Contact", url: "#", description: "Get in touch", visible: true, order: 1 },
      { id: "3", type: "featured", title: "Featured project", url: "#", description: "A recent launch", visible: true, order: 2 },
    ],
    socialLinks: [
      { id: "s1", platform: "twitter", handle: "@creator", url: "#" },
      { id: "s2", platform: "instagram", handle: "@creator", url: "#" },
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
  const buttonStyle = buttonAppearanceStyle(target.appearance, tokens);
  const isPro = target.tier === "pro";
  const initials = target.profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "??";

  return (
    <div className="relative flex flex-col items-start gap-3">
      <div
        className="relative w-[320px] max-w-full overflow-hidden border shadow-[var(--shadow-lg)]"
        style={{ aspectRatio: "9 / 19.5", maxHeight: 640, borderRadius: 30, borderColor: tokens.border, background: tokens.bg }}
        role="img"
        aria-label="Live preview of the public Fusepage"
      >
        <div className="flex min-h-full flex-col" style={{ background: tokens.bg, color: tokens.text }}>
          <div className="flex items-center justify-between px-4 py-2 text-[11px]" style={{ borderBottom: `1px solid ${tokens.border}`, color: tokens.muted }}>
            <span className="font-medium">9:41</span>
            <span>Fusepage preview</span>
          </div>

          <div className="flex flex-col items-center p-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-xl font-semibold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accent}99)` }}>
              {target.profile.avatarUrl ? (
                <Image src={target.profile.avatarUrl} alt="" width={80} height={80} unoptimized className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <h3 className="mt-3 text-[15px] font-semibold" style={{ color: tokens.text }}>{target.profile.name || "Your Name"}</h3>
            {target.profile.headline && <p className="mt-1 text-[12px]" style={{ color: tokens.muted }}>{target.profile.headline}</p>}
            {target.profile.bio && <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed" style={{ color: tokens.muted }}>{target.profile.bio}</p>}
          </div>

          <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
            {target.links.filter((link) => link.visible).map((link) => (
              <a
                key={link.id}
                href={link.url || "#"}
                onClick={(event) => event.preventDefault()}
                className="block border px-4 py-3 text-left shadow-sm transition"
                style={{ ...buttonStyle, borderRadius: tokens.radius }}
              >
                {link.type === "featured" && <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider" style={{ color: tokens.accent }}>Featured</span>}
                <span className="block text-sm font-semibold">{link.title || "Untitled link"}</span>
                {link.description && <span className="mt-0.5 block text-xs" style={{ color: tokens.muted }}>{link.description}</span>}
              </a>
            ))}
          </div>

          {target.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3 px-4 py-3" style={{ borderTop: `1px solid ${tokens.border}`, color: tokens.muted }}>
              {target.socialLinks.slice(0, 4).map((social) => (
                <span key={social.id} aria-label={`${social.platform}: ${social.handle}`}><SocialIconComp platform={social.platform} size={20} /></span>
              ))}
            </div>
          )}

          {!isPro && (
            <div className="px-4 py-2 text-center text-[11px] font-medium" style={{ borderTop: `1px solid ${tokens.border}`, color: tokens.accent }}>
              Published with Fusepage
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <span>Live preview</span>
        <span className="rounded-full border border-[var(--border)] bg-white px-2 py-0.5">{isPro ? "Pro · no branding" : "Free · branding"}</span>
      </div>
    </div>
  );
}
