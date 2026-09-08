import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm shadow-blue-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-semibold tracking-tight text-[var(--ink)] transition-all hover:bg-[var(--color-brand-soft)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-tight text-[var(--ink)] transition-all hover:bg-[var(--color-brand-soft)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight text-red-700 transition-all hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
  link:
    "inline-flex items-center justify-center gap-2 rounded-none p-0 text-sm font-semibold tracking-tight text-[var(--accent)] transition-all hover:underline active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
};

const sizeStyles = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = "primary", size = "md", loading = false, left, right, className = "", disabled, ...rest },
  ref
) {
  return (
    <button ref={ref} disabled={disabled || loading} className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...rest}>
      {loading ? <Spinner /> : left}
      {children}
      {!loading && right}
    </button>
  );
});

interface AnchorButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function AnchorButton({ children, variant = "primary", size = "md", left, right, className = "", ...rest }: AnchorButtonProps) {
  return (
    <a className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...rest}>
      {left}
      {children}
      {right}
    </a>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
