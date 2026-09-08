export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly";
export const STRIPE_PRICE_PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY ?? "price_pro_yearly";

export const BILLING_PROVISIONED = Boolean(STRIPE_SECRET_KEY);

export const PRO_PRICE_MONTHLY = 12;
export const PRO_PRICE_YEARLY = 120;
export const PRO_PRICE_YEARLY_MONTHLY_EQUIV = 10;

export const TIER_FEATURES = {
  free: {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    mostPopular: false,
    badge: null as string | null,
    limits: {
      pages: 1,
      links: 12,
      themes: ["minimal", "clean", "soft"],
      analytics: "basic",
      branding: "fusepage",
      customDomain: false,
      support: "community",
    },
    features: [
      "1 published Fusepage",
      "Core themes",
      "Up to 12 links",
      "Basic analytics",
      "Fusepage branding",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    priceMonthly: PRO_PRICE_MONTHLY,
    priceYearly: PRO_PRICE_YEARLY,
    mostPopular: true,
    badge: "Most popular",
    limits: {
      pages: 5,
      links: 50,
      themes: ["minimal", "clean", "bold", "soft", "dark", "warm", "vivid", "mono"],
      analytics: "advanced",
      branding: "none",
      customDomain: true,
      support: "priority",
    },
    features: [
      "Up to 5 published Fusepages",
      "All themes including premium",
      "Up to 50 links",
      "Advanced analytics & top links",
      "No Fusepage branding",
      "Custom domain architecture (ready)",
      "Richer content blocks",
      "Priority support",
    ],
  },
};

export const canUpgradeTo = (fromTier: "free" | "pro", toTier: "free" | "pro"): boolean => {
  if (fromTier === toTier) return false;
  return true;
};
