export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`animate-pulse rounded-md bg-[var(--border)] ${className}`} aria-hidden="true" />;
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 w-full ${i === lines - 1 ? "w-3/4" : ""}`} />
      ))}
    </div>
  );
}
