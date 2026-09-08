"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type DemoUser, type Page } from "@/types";
import { createDemoUser as createDemoUserFn, createEmptyPage } from "@/lib/demo-data";

const STORAGE_KEY = "fusepage.auth.demo.v1";

export interface AuthContextValue {
  user: DemoUser | null;
  page: Page | null;
  isDemo: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  upsertPage: (page: Page) => void;
  reset: () => void;
  loading: boolean;
}

const AuthContext: React.Context<AuthContextValue | null> = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { user: DemoUser; page?: Page };
        setUser(parsed.user);
        setPage(parsed.page ? parsed.page : null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback(
    (nextUser: DemoUser, nextPage: Page | null) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: nextUser, page: nextPage })
        );
      } catch {}
    },
    []
  );

  const login = useCallback(
    (email: string, name: string) => {
      const trimmed = name.trim();
      const firstWord = trimmed.split(" ")[0] ?? "creator";
      const demoUser: DemoUser = {
        id:
          crypto.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        email: email.toLowerCase().trim(),
        name: trimmed || "Creator",
        username: firstWord.toLowerCase() ?? "creator",
        avatarUrl: undefined,
        tier: "free",
        page: createEmptyPage("demo", "creator", "free"),
      };
      const pageForDemo: Page = demoUser.page as Page;
      setUser(demoUser);
      setPage(pageForDemo);
      persist(demoUser, pageForDemo);
    },
    [persist]
  );

  const logout = useCallback(() => {
    setUser(null);
    setPage(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const upsertPage = useCallback(
    (nextPage: Page) => {
      setPage(nextPage);
      setUser((prev: DemoUser | null) => {
        if (!prev) return prev;
        const updated = { ...prev, page: nextPage };
        persist(updated, nextPage);
        return updated;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    logout();
  }, [logout]);

  const value: AuthContextValue = {
    user,
    page,
    isDemo: true,
    login,
    logout,
    upsertPage,
    reset,
    loading,
  };

  const Provider: React.Provider<AuthContextValue | null> = AuthContext.Provider;
  return Provider.call(AuthContext, { value, children }) as React.ReactElement;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

let demoInitialized = false;
let demoSingleton: DemoUser | null = null;

export function getDemoUserOnce(): DemoUser {
  if (!demoInitialized) {
    demoInitialized = true;
    demoSingleton = createDemoUserFn();
  }
  return demoSingleton as DemoUser;
}
