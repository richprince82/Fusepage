

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <nav aria-label="Progress" className={`flex items-center gap-0 rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm ${className}`}>
      {steps.map((step, index) => {
        const active = index === current;
        const done = index < current;
        const href = `#step-${index}`;
        return (
          <div key={index} className="flex items-center gap-3">
            <a
              href={href}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${done ? "bg-[var(--accent)] text-white" : active ? "bg-[var(--accent)] text-white" : "bg-white border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"} focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
              aria-current={active ? "step" : undefined}
            >
              {done ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="text-center leading-none">{index + 1}</span>
              )}
            </a>
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${active ? "text-[var(--ink)]" : done ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                {step.title}
              </p>
              {step.description && (
                <p className={`text-xs truncate ${active ? "text-[var(--muted)]" : "text-[var(--muted)] opacity-60"}`}>
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex h-0.5 flex-1 self-center transition-colors ${done ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
