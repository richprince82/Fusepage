import { type ReactNode } from "react";

type StatusVariant = "default" | "success" | "warning" | "info" | "muted" | "accent";
interface BadgeProps {
  children: ReactNode;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", className = "", dot = false, size = "sm" }: BadgeProps) {
  const variants: Record<StatusVariant, string> = {
    default: "bg-[var(--color-brand-soft)] text-[var(--brand)]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-sky-50 text-sky-700",
    muted: "bg-zinc-100 text-zinc-600",
    accent: "bg-[var(--accent)] text-white",
  };
  const dotColors: Record<StatusVariant, string> = {
    default: "bg-[var(--brand)]",
    success: "bg-emerald-500",
    warning: "bg-amber-400",
    info: "bg-sky-500",
    muted: "bg-zinc-400",
    accent: "bg-white",
  };
  const sizeClasses = size === "md" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizeClasses} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
