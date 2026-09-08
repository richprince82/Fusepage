export function slugify(str: string) {
  return str
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 32);
}

export function safeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    return undefined;
  }
  return undefined;
}

export function socialUrl(platform: string, handle: string): string | undefined {
  const map: Record<string, (h: string) => string> = {
    twitter: (h) => `https://twitter.com/${h}`,
    instagram: (h) => `https://instagram.com/${h}`,
    linkedin: (h) => `https://linkedin.com/in/${h}`,
    github: (h) => `https://github.com/${h}`,
    youtube: (h) => `https://youtube.com/${h}`,
    tiktok: (h) => `https://tiktok.com/@${h}`,
    threads: (h) => `https://threads.net/@${h}`,
    dribbble: (h) => `https://dribbble.com/${h}`,
  };
  const fn = map[platform];
  return fn ? fn(handle) : undefined;
}

export function defaultAvatar() {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=fusepage&backgroundColor=0d9488`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") ?? "??";
}
