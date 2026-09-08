import { type ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Pill({ children, variant = "default", size = "sm", className = "" }: PillProps) {
  const base = "inline-flex items-center rounded-full font-semibold tracking-tight";
  const variants: Record<string, string> = {
    default: "bg-[var(--color-brand-soft)] text-[var(--brand)]",
    accent: "bg-[var(--accent)] text-white",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };
  return <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
}

interface TierPillProps {
  tier: "free" | "pro";
  className?: string;
}

export function TierPill({ tier, className = "" }: TierPillProps) {
  return (
    <Pill variant={tier === "pro" ? "accent" : "default"} size="sm" className={className}>
      {tier === "pro" ? "Pro" : "Free"}
    </Pill>
  );
}
