"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type DemoUser, type Page } from "@/types";
import { createEmptyPage } from "@/lib/demo-data";

const STORAGE_KEY = "fusepage.auth.demo.v1";

export interface AuthContextValue {
  user: DemoUser | null;
  page: Page | null;
  isDemo: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  upsertPage: (page: Page) => void;
  updateUser: (patch: Partial<Pick<DemoUser, "name" | "email" | "avatarUrl">>) => void;
  reset: () => void;
  loading: boolean;
}

const AuthContext: React.Context<AuthContextValue | null> = createContext<AuthContextValue | null>(null);

interface Session {
  user: DemoUser | null;
  page: Page | null;
}

interface SessionSnapshot {
  hydrated: boolean;
  session: Session;
}

const EMPTY_SESSION: Session = { user: null, page: null };
const EMPTY_SNAPSHOT: SessionSnapshot = { hydrated: false, session: EMPTY_SESSION };

function readSession(): Session {
  if (typeof window === "undefined") return EMPTY_SESSION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { user: DemoUser; page?: Page };
      return { user: parsed.user, page: parsed.page ?? null };
    }
  } catch {
    // ignore malformed storage
  }
  return EMPTY_SESSION;
}

// A tiny external store that mirrors the persisted demo session. React subscribes
// through useSyncExternalStore, so updates outside the component tree (and across
// tabs) re-render every consumer without calling setState from an effect.
let snapshot: SessionSnapshot = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = { hydrated: true, session: readSession() };
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = () => snapshot;

const hydrate = () => {
  snapshot = { hydrated: true, session: readSession() };
  emit();
};

const persist = (session: Session) => {
  snapshot = { hydrated: true, session };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota / privacy-mode errors
  }
  emit();
};

const clearSession = () => {
  snapshot = { hydrated: true, session: EMPTY_SESSION };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  emit();
};

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const { session, hydrated } = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);

  useEffect(() => {
    hydrate();
  }, []);

  const login = useCallback((email: string, name: string) => {
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
      page: createEmptyPage("demo", firstWord.toLowerCase() ?? "creator", "free"),
    };
    const pageForDemo: Page = demoUser.page as Page;
    persist({ user: demoUser, page: pageForDemo });
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const upsertPage = useCallback((nextPage: Page) => {
    const current = getSnapshot().session;
    const nextUser = current.user ? { ...current.user, page: nextPage } : current.user;
    persist({ user: nextUser, page: nextPage });
  }, []);

  const updateUser = useCallback(
    (patch: Partial<Pick<DemoUser, "name" | "email" | "avatarUrl">>) => {
      const current = getSnapshot().session;
      if (!current.user) return;
      const nextUser: DemoUser = { ...current.user, ...patch };
      persist({ user: nextUser, page: current.page });
    },
    []
  );

  const reset = useCallback(() => {
    clearSession();
  }, []);

  const value: AuthContextValue = {
    user: session.user,
    page: session.page,
    isDemo: true,
    login,
    logout,
    upsertPage,
    updateUser,
    reset,
    loading: !hydrated,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}