"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/dashboard/Avatar";
import {
  LayoutDashboardIcon,
  PencilIcon,
  BarChartIcon,
  SettingsIcon,
} from "@/components/ui/Icon";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { href: "/editor", label: "Editor", icon: PencilIcon },
  { href: "/analytics", label: "Analytics", icon: BarChartIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, page, logout, loading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isOnboarding = pathname === "/onboarding";

  const callbackUrl = (searchParams.get("callbackUrl") ?? "/dashboard").replace(/^\/+/, "") || "dashboard";

  useEffect(() => {
    if (!loading && user && !page && !isAuthRoute) {
      router.replace(`/${callbackUrl}`);
      router.refresh();
    }
  }, [loading, user, page, isAuthRoute, callbackUrl, router]);

  useEffect(() => {
    const safe =
      typeof window !== "undefined" && document && document.body
        ? document.body
        : null;
    if (safe) safe.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      if (safe) safe.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !userMenuOpen) return;
    const menu = mobileOpen ? mobileRef.current : userMenuRef.current;
    if (!menu) return;
    const node = menu.contains(document.activeElement);
    if (!node) {
      setMobileOpen(false);
      setUserMenuOpen(false);
    }
  }, [mobileOpen, userMenuOpen]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
          <div className="text-sm">Loading dashboard…</div>
        </div>
      );
    }
    if (!user) {
      if (isAuthRoute || isOnboarding) {
        return <>{children}</>;
      }
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">Please sign in to continue.</p>
            <div className="mt-4">
              <Link href="/sign-in">
                <Button variant="primary" size="md">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {/* top nav */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3" aria-label="Dashboard">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden rounded-full p-1.5 text-[var(--ink)] transition-colors hover:bg-[var(--color-brand-soft)]"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]" aria-label="Fusepage dashboard">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white text-sm font-semibold">F</span>
              <span>Fusepage</span>
            </Link>

            <nav className="hidden items-center gap-1 text-sm font-medium text-[var(--muted)] md:flex" aria-label="Sections">
              {NAV_ITEMS.map((item) => {
                const isActive = item.end ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 transition-colors ${isActive ? "bg-[var(--color-brand-soft)] text-[var(--brand)] font-semibold" : "hover:bg-[var(--color-brand-soft)] hover:text-[var(--ink)]"}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon size={16} className="mr-1.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-2 py-1 text-left transition-colors hover:bg-[var(--color-brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  aria-label={`Account menu for ${user.name}`}
                  onClick={() => setUserMenuOpen((v) => !v)}
                >
                  <Avatar user={user} size={30} />
                  <span className="hidden text-sm font-medium text-[var(--ink)] md:block">{user.name}</span>
                  {userMenuOpen ? (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden md:block rotate-180" aria-hidden="true">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  ) : (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:hidden" aria-hidden="true">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-40 mt-2 min-w-[220px] rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-[var(--border)] px-4 py-3">
                      <p className="text-sm font-semibold text-[var(--ink)]">{user.name}</p>
                      <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--color-brand-soft)]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <SettingsIcon size={16} />
                        Settings
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          router.replace("/");
                          router.refresh();
                        }}
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-white" ref={mobileRef}>
            <nav className="flex flex-col gap-1 px-5 py-3" aria-label="Mobile sections">
              {NAV_ITEMS.map((item) => {
                const isActive = item.end ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[var(--color-brand-soft)] text-[var(--brand)] font-semibold" : "text-[var(--ink)] hover:bg-[var(--color-brand-soft)]"}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 border-t border-[var(--border)] pt-3">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <Avatar user={user} size={34} />
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* page content */}
      <main className="flex flex-1">{renderContent()}</main>
    </div>
  );
}
