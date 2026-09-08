import { type Page, type DemoUser } from "@/types";
import { appearanceTokens } from "@/hooks/use-appearance";
void undefined;
void undefined;

import { SocialIcon as SocialIconComp } from "@/components/ui/Icon";

export function PublicPage({ page, user }: { page: Page; user: DemoUser }) {
  const tokens = appearanceTokens(page.appearance);
  const isPro = page.tier === "pro";
  const initials =
    page.profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") ?? "??";

  const profileName = page.profile.name || user.name || "Your name";
  const profileHeadline = page.profile.headline || "Creator, maker, freelancer.";
  const profileBio = page.profile.bio || "Building things that matter.";

  return (
    <article
      className="mx-auto max-w-md px-4 py-6 sm:px-6"
      style={{ background: tokens.bg, color: tokens.text, minHeight: "100vh" }}
      aria-label={`${profileName}'s Fusepage`}
    >
      {/* profile header */}
      <header className="flex flex-col items-center text-center pb-6 pt-2">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white text-2xl font-semibold shadow-sm ring-1 ring-white/30"
          style={{ boxShadow: `0 8px 24px ${tokens.accent}22` }}
        >
          {page.profile.avatarUrl ? (
            <img
              src={page.profile.avatarUrl}
              alt=""
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            initials
          )}
        </div>
        <h1 className="mt-4 text-xl font-semibold leading-tight" style={{ color: tokens.text }}>
          {profileName}
        </h1>
        {page.profile.headline && (
          <p className="mt-1 text-sm" style={{ color: tokens.muted }}>
            {profileHeadline}
          </p>
        )}
        {page.profile.bio && (
          <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: tokens.muted }}>
            {profileBio}
          </p>
        )}
        {(page.profile.location || page.profile.role) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-xs" style={{ color: tokens.muted }}>
            {page.profile.location && <span>{page.profile.location}</span>}
            {page.profile.location && page.profile.role && <span>·</span>}
            {page.profile.role && <span>{page.profile.role}</span>}
          </div>
        )}
      </header>

      {/* links */}
      <nav className="flex flex-col gap-2" aria-label="Links">
        {page.links.filter((l) => l.visible).map((link) => {
          const accent = tokens.accent;
          if (link.type === "featured") {
            return (
              <div key={link.id} className="mb-3 overflow-hidden rounded-xl border" style={{ borderColor: `${tokens.border}`, background: tokens.surface }}>
                <p className="px-4 pb-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: tokens.muted }}>
                  Featured
                </p>
                <div className="px-4 py-3">
                  <p className="text-base font-semibold" style={{ color: tokens.text }}>
                    {link.title || "Featured"}
                  </p>
                  {link.description && (
                    <p className="mt-1 text-xs" style={{ color: tokens.muted }}>
                      {link.description}
                    </p>
                  )}
                  <a
                    href={link.url || "#"}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                    style={{ color: accent }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title || "View"}
                    <span style={{ color: tokens.muted }}>→</span>
                  </a>
                </div>
              </div>
            );
          }

          return (
            <a
              key={link.id}
              href={link.url || "#"}
              className="group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors hover:border-[var(--border-strong)] hover:shadow-sm"
              style={{
                background: tokens.surface,
                borderColor: `${tokens.border}`,
                borderLeftColor: accent,
                borderLeftWidth: 4,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors text-[var(--muted)] group-hover:bg-[var(--color-brand-soft)] group-hover:text-[var(--accent)]"
                style={{ color: accent }}
              >
                {link.icon === "social" ? (
                  <SocialIconComp platform="twitter" size={18} />
                ) : (
                  <span className="text-sm font-semibold" style={{ color: accent }}>
                    {link.title?.[0]?.toUpperCase() ?? "#"}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: tokens.text }}>
                  {link.title || "Link"}
                </p>
                {link.description && (
                  <p className="truncate text-xs" style={{ color: tokens.muted }}>
                    {link.description}
                  </p>
                )}
              </div>
              <span className="text-[var(--muted)] group-hover:hidden opacity-0 group-hover:opacity-100">→</span>
            </a>
          );
        })}
      </nav>

      {/* social links */}
      {page.socialLinks.length > 0 && (
        <div className="mt-4 border-t py-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center justify-center gap-3 text-[var(--muted)]">
            {page.socialLinks.slice(0, 4).map((s) => (
              <a
                key={s.id}
                href={s.url || "#"}
                className="transition-colors hover:text-[var(--accent)]"
                aria-label={`${s.platform}: ${s.handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIconComp platform={s.platform} size={20} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* branding */}
      <footer className="mt-6 border-t text-center text-xs font-medium" style={{ borderColor: tokens.border, color: tokens.muted }}>
        {isPro ? (
          <span>Shared with Fusepage</span>
        ) : (
          <span style={{ color: tokens.accent }}>
            Published with Fusepage
          </span>
        )}
      </footer>
    </article>
  );
}
