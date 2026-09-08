import Image from "next/image";
import { type Page, type DemoUser } from "@/types";
import { appearanceTokens, buttonAppearanceStyle } from "@/hooks/use-appearance";
import { SocialIcon as SocialIconComp } from "@/components/ui/Icon";

export function PublicPage({ page, user }: { page: Page; user: DemoUser }) {
  const tokens = appearanceTokens(page.appearance);
  const buttonStyle = buttonAppearanceStyle(page.appearance, tokens);
  const initials = page.profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "??";

  const profileName = page.profile.name || user.name || "Your name";
  const profileHeadline = page.profile.headline || "Creator, maker, freelancer.";
  const profileBio = page.profile.bio || "Building things that matter.";

  return (
    <article
      className="mx-auto min-h-screen max-w-md px-4 py-6 sm:px-6"
      style={{ background: tokens.bg, color: tokens.text }}
      aria-label={`${profileName}'s Fusepage`}
    >
      <header className="flex flex-col items-center pb-6 pt-2 text-center">
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold text-white shadow-sm ring-1 ring-white/30"
          style={{ background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accent}99)`, boxShadow: `0 8px 24px ${tokens.accent}22` }}
        >
          {page.profile.avatarUrl ? (
            <Image src={page.profile.avatarUrl} alt="" width={96} height={96} unoptimized className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <h1 className="mt-4 text-xl font-semibold leading-tight" style={{ color: tokens.text }}>{profileName}</h1>
        {page.profile.headline && <p className="mt-1 text-sm" style={{ color: tokens.muted }}>{profileHeadline}</p>}
        {page.profile.bio && <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: tokens.muted }}>{profileBio}</p>}
        {(page.profile.location || page.profile.role) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-xs" style={{ color: tokens.muted }}>
            {page.profile.location && <span>{page.profile.location}</span>}
            {page.profile.location && page.profile.role && <span>·</span>}
            {page.profile.role && <span>{page.profile.role}</span>}
          </div>
        )}
      </header>

      <nav className="flex flex-col gap-2" aria-label="Links">
        {page.links.filter((link) => link.visible).map((link) => (
          <a
            key={link.id}
            href={link.url || "#"}
            className="block border px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            style={{ ...buttonStyle, borderRadius: tokens.radius }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.type === "featured" && <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider" style={{ color: tokens.accent }}>Featured</span>}
            <span className="block text-sm font-semibold">{link.title || "Link"}</span>
            {link.description && <span className="mt-0.5 block text-xs" style={{ color: tokens.muted }}>{link.description}</span>}
          </a>
        ))}
      </nav>

      {page.socialLinks.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-4 border-t py-4" style={{ borderColor: tokens.border, color: tokens.muted }}>
          {page.socialLinks.slice(0, 6).map((social) => (
            <a
              key={social.id}
              href={social.url || "#"}
              className="transition-transform hover:-translate-y-0.5"
              aria-label={`${social.platform}: ${social.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: tokens.accent }}
            >
              <SocialIconComp platform={social.platform} size={20} />
            </a>
          ))}
        </div>
      )}

      {page.tier === "free" && (
        <footer className="mt-6 border-t pt-4 text-center text-xs font-medium" style={{ borderColor: tokens.border, color: tokens.accent }}>
          Published with Fusepage
        </footer>
      )}
    </article>
  );
}
