import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "bordered" | "elevated" | "outlined";
  className?: string;
}

export function Card({ children, variant = "default", className = "" }: CardProps) {
  const variants: Record<string, string> = {
    default: "bg-white rounded-2xl border border-[var(--border)] shadow-sm",
    bordered: "bg-white rounded-2xl border border-[var(--border)]",
    elevated: "bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)]",
    outlined: "bg-transparent rounded-2xl border border-[var(--border)]",
  };
  return (
    <div className={`${variants[variant]} p-5 ${className}`}>{children}</div>
  );
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardSectionProps) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardSectionProps) {
  return <h3 className={`text-lg font-semibold tracking-tight text-[var(--ink)] ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: CardSectionProps) {
  return <p className={`text-sm text-[var(--muted)] ${className}`}>{children}</p>;
}

export function CardBody({ children, className = "" }: CardSectionProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardSectionProps) {
  return <div className={`flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[var(--border)] ${className}`}>{children}</div>;
}
