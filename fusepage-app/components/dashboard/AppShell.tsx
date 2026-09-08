"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { Avatar } from "@/components/dashboard/Avatar";
import { LayoutDashboardIcon, PencilIcon, BarChartIcon, SettingsIcon } from "@/components/ui/Icon";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/editor", label: "Editor", icon: PencilIcon },
  { href: "/analytics", label: "Analytics", icon: BarChartIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--muted)]">Loading dashboard…</div>;
  }

  const signOut = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3" aria-label="Dashboard">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg p-2 text-[var(--ink)] md:hidden" aria-label="Open dashboard menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>
              {mobileOpen ? "✕" : "☰"}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">F</span>
              Fusepage
            </Link>
            <div className="ml-3 hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
            </div>
          </div>

          <div className="relative">
            <button type="button" className="flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-2 py-1" aria-haspopup="menu" aria-expanded={userMenuOpen} onClick={() => setUserMenuOpen((value) => !value)}>
              <Avatar user={user} size={30} />
              <span className="hidden max-w-32 truncate text-sm font-medium text-[var(--ink)] sm:block">{user.name}</span>
              <span aria-hidden="true" className="text-xs text-[var(--muted)]">⌄</span>
            </button>
            {userMenuOpen && (
              <div role="menu" className="absolute right-0 mt-2 min-w-56 rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-lg)]">
                <div className="border-b border-[var(--border)] px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                </div>
                <Link href="/settings" role="menuitem" className="mt-2 block rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--color-brand-soft)]" onClick={() => setUserMenuOpen(false)}>Settings</Link>
                <button type="button" role="menuitem" className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50" onClick={signOut}>Sign out</button>
              </div>
            )}
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-[var(--border)] bg-white md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3" aria-label="Mobile dashboard sections">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-[var(--color-brand-soft)] text-[var(--brand)]" : "text-[var(--ink)]"}`} aria-current={active ? "page" : undefined}>
                    <Icon size={18} />{item.label}
                  </Link>
                );
              })}
              <button type="button" className="mt-2 min-h-11 rounded-lg border-t border-[var(--border)] px-3 py-2.5 text-left text-sm font-medium text-red-600" onClick={signOut}>Sign out</button>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}

function NavLink({ item, pathname }: { item: (typeof NAV_ITEMS)[number]; pathname: string }) {
  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
  const Icon = item.icon;
  return (
    <Link href={item.href} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-[var(--color-brand-soft)] text-[var(--brand)]" : "text-[var(--muted)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--ink)]"}`} aria-current={active ? "page" : undefined}>
      <Icon size={16} />{item.label}
    </Link>
  );
}
