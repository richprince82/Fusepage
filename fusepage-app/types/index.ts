export type Role = "creator" | "freelancer" | "business" | "professional";

export type PageTheme =
  | "minimal"
  | "clean"
  | "bold"
  | "soft"
  | "dark"
  | "warm"
  | "vivid"
  | "mono";

export type PageStyle =
  | "rounded-soft"
  | "sharp-modern"
  | "card-elegant"
  | "list-minimal";

export type Tier = "free" | "pro";

export type LinkType = "link" | "social" | "featured";

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

export interface LinkBlock {
  id: string;
  type: LinkType;
  title: string;
  url?: string;
  description?: string;
  icon?: string;
  visible: boolean;
  order: number;
}

export interface Profile {
  name: string;
  username: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  location?: string;
  role?: string;
}

export interface PageAppearance {
  theme: PageTheme;
  style: PageStyle;
  background: "solid" | "gradient" | "image";
  backgroundImageUrl?: string;
  accentColor: string;
  textColor: string;
  buttonStyle: "filled" | "outlined" | "ghost";
}

export interface Page {
  id: string;
  userId: string;
  profile: Profile;
  links: LinkBlock[];
  socialLinks: SocialLink[];
  appearance: PageAppearance;
  tier: Tier;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "view" | "click" | "visit" | "signup";
  url?: string;
  pageId?: string;
  createdAt: string;
}

export interface AnalyticsPeriod {
  label: string;
  days: number;
  totalViews: number;
  totalClicks: number;
  topLinks: { label: string; clicks: number; pct: number }[];
  daily: { day: string; views: number; clicks: number }[];
}

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string;
  tier: Tier;
  page?: Page;
}

export interface TenantSettings {
  user: DemoUser;
  pages: Page[];
}

export interface BillingState {
  status: "unknown" | "authenticated" | "not_authenticated";
  customerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "incomplete" | "trialing" | "unpaid";
  currentPeriodEnd?: string;
}
