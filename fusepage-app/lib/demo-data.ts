import { type DemoUser, type Page, type PageTheme, type PageStyle, type LinkBlock, type AnalyticsPeriod, type Tier } from "@/types";

export const DEFAULT_APPEARANCE = {
  theme: "clean" as PageTheme,
  style: "rounded-soft" as PageStyle,
  background: "solid" as const,
  accentColor: "#2563eb",
  textColor: "#111827",
  buttonStyle: "filled" as const,
};

export const createEmptyPage = (userId: string, slug: string, userTier: Tier): Page => ({
  id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  userId,
  slug,
  profile: {
    name: "",
    username: slug,
    headline: "",
    bio: "",
    avatarUrl: undefined,
    location: undefined,
    role: undefined,
  },
  links: [],
  socialLinks: [],
  appearance: { ...DEFAULT_APPEARANCE },
  tier: userTier,
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createDemoUser = (): DemoUser => ({
  id: "demo-user",
  email: "creator@fusepage.demo",
  name: "Alex Rivera",
  username: "alexrivera",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=128&h=128&q=80",
  tier: "free",
  page: createEmptyPage("demo-user", "alexrivera", "free"),
});

export const demoPeriods: AnalyticsPeriod[] = [
  {
    label: "Today",
    days: 1,
    totalViews: 328,
    totalClicks: 84,
    topLinks: [
      { label: "Portfolio", clicks: 31, pct: 37 },
      { label: "Contact", clicks: 24, pct: 29 },
      { label: "Instagram", clicks: 18, pct: 21 },
      { label: "Resume", clicks: 11, pct: 13 },
    ],
    daily: [
      { day: "09:00", views: 42, clicks: 11 },
      { day: "12:00", views: 98, clicks: 24 },
      { day: "15:00", views: 114, clicks: 29 },
      { day: "18:00", views: 74, clicks: 20 },
    ],
  },
  {
    label: "This Week",
    days: 7,
    totalViews: 2140,
    totalClicks: 582,
    topLinks: [
      { label: "Portfolio", clicks: 221, pct: 38 },
      { label: "Contact", clicks: 148, pct: 25 },
      { label: "Instagram", clicks: 122, pct: 21 },
      { label: "Resume", clicks: 91, pct: 16 },
    ],
    daily: [
      { day: "Mon", views: 312, clicks: 84 },
      { day: "Tue", views: 298, clicks: 79 },
      { day: "Wed", views: 321, clicks: 91 },
      { day: "Thu", views: 336, clicks: 95 },
      { day: "Fri", views: 362, clicks: 104 },
      { day: "Sat", views: 254, clicks: 70 },
      { day: "Sun", views: 257, clicks: 59 },
    ],
  },
];

export const pageThemes: { value: PageTheme; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "clean", label: "Clean" },
  { value: "bold", label: "Bold" },
  { value: "soft", label: "Soft" },
  { value: "dark", label: "Dark" },
  { value: "warm", label: "Warm" },
  { value: "vivid", label: "Vivid" },
  { value: "mono", label: "Mono" },
];

export const pageStyles: { value: PageStyle; label: string }[] = [
  { value: "rounded-soft", label: "Rounded soft" },
  { value: "sharp-modern", label: "Sharp modern" },
  { value: "card-elegant", label: "Card elegant" },
  { value: "list-minimal", label: "List minimal" },
];

export const socialPlatforms: { value: string; label: string }[] = [
  { value: "twitter", label: "X / Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "threads", label: "Threads" },
  { value: "dribbble", label: "Dribbble" },
];

export const linkTypeOptions: { value: LinkBlock["type"]; label: string }[] = [
  { value: "link", label: "Link" },
  { value: "social", label: "Social" },
  { value: "featured", label: "Featured" },
];

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") ?? "??";
