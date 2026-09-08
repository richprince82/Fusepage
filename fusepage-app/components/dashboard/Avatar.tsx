import { type DemoUser } from "@/types";
void undefined;
void undefined;


interface AvatarProps {
  user: DemoUser;
  size?: number;
  className?: string;
}

export function Avatar({ user, size = 36, className = "" }: AvatarProps) {
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") ?? "??";

  if (user.avatarUrl) {
    return (
      <img
        alt=""
        src={user.avatarUrl}
        className={`rounded-full object-cover ${className}`}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
        }}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)] font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.4),
      }}
      aria-label={user.name}
    >
      {initials}
    </span>
  );
}
