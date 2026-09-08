"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/store";
import { type Page, type Profile, type LinkBlock, type SocialLink, type PageAppearance, type Tier } from "@/types";
import { createEmptyPage, DEFAULT_APPEARANCE } from "@/lib/demo-data";

const AUTOSAVE_MS = 1200;

export function useEditorState() {
  const { user, page: currentPage, upsertPage, loading } = useAuth();
  const [profile, setProfile] = useState<Profile>(() =>
    currentPage?.profile ?? { name: "", username: "", headline: "", bio: "", avatarUrl: undefined, location: undefined, role: undefined }
  );
  const [links, setLinks] = useState<LinkBlock[]>(() => currentPage?.links ?? []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => currentPage?.socialLinks ?? []);
  const [appearance, setAppearance] = useState<PageAppearance>(() => currentPage?.appearance ?? { ...DEFAULT_APPEARANCE });
  const [published, setPublished] = useState<boolean>(currentPage?.published ?? false);
  const [tier, setTier] = useState<Tier>(currentPage?.tier ?? (user?.tier ?? "free"));
  const [slug, setSlug] = useState<string>(currentPage?.slug ?? (user?.username ?? ""));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const lastPersistedRef = useRef<Page | null>(currentPage ?? null);
  const hydratedPageIdRef = useRef<string | null>(currentPage?.id ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate local editor state exactly once when the persisted page becomes available.
  // Subsequent autosaves keep the same page id, so they do not clobber in-progress edits.
  useEffect(() => {
    if (!currentPage || hydratedPageIdRef.current === currentPage.id) return;
    hydratedPageIdRef.current = currentPage.id;
    lastPersistedRef.current = currentPage;
    setProfile(currentPage.profile);
    setLinks(currentPage.links);
    setSocialLinks(currentPage.socialLinks);
    setAppearance(currentPage.appearance);
    setPublished(currentPage.published);
    setTier(currentPage.tier);
    setSlug(currentPage.slug);
    setSaved(true);
  }, [currentPage]);

  const persist = useCallback((next: Page) => {
    lastPersistedRef.current = next;
    upsertPage(next);
    setSaved(true);
    setSaving(false);
  }, [upsertPage]);

  const assemble = useCallback((): Page | null => {
    if (!user) return null;
    return {
      id: currentPage?.id ?? crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId: user.id,
      slug: slug.trim() || user.username,
      profile: { ...profile, username: slug.trim() || profile.username || user.username },
      links: [...links].sort((a, b) => a.order - b.order),
      socialLinks,
      appearance,
      tier,
      published,
      createdAt: currentPage?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [user, currentPage, slug, profile, links, socialLinks, appearance, tier, published]);

  const commit = useCallback(() => {
    const next = assemble();
    if (!next) return null;
    persist(next);
    return next;
  }, [assemble, persist]);

  useEffect(() => {
    if (loading || !user || !hydratedPageIdRef.current) return;
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaving(true);
      commit();
    }, AUTOSAVE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [profile, links, socialLinks, appearance, slug, published, tier, commit, loading, user]);

  const addLink = useCallback((type: LinkBlock["type"] = "link") => {
    setLinks((prev) => {
      const order = prev.length ? Math.max(...prev.map((l) => l.order)) + 1 : 0;
      return [...prev, {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        title: "",
        url: undefined,
        description: undefined,
        icon: undefined,
        visible: true,
        order,
      }];
    });
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })));
  }, []);

  const updateLink = useCallback((id: string, patch: Partial<LinkBlock>) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const moveLink = useCallback((from: string, to: number) => {
    setLinks((prev) => {
      const item = prev.find((l) => l.id === from);
      if (!item) return prev;
      const filtered = prev.filter((l) => l.id !== from);
      const clampedTo = Math.max(0, Math.min(to, filtered.length));
      filtered.splice(clampedTo, 0, item);
      return filtered.map((l, i) => ({ ...l, order: i }));
    });
  }, []);

  const addSocial = useCallback((platform: string) => {
    setSocialLinks((prev) => {
      const existing = prev.find((s) => s.platform === platform);
      if (existing) return prev;
      return [...prev, {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        platform,
        handle: "",
        url: undefined,
      }];
    });
  }, []);

  const updateSocial = useCallback((id: string, patch: Partial<SocialLink>) => {
    setSocialLinks((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeSocial = useCallback((id: string) => {
    setSocialLinks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resetTo = useCallback(() => {
    const base = lastPersistedRef.current ?? currentPage ?? createEmptyPage(user?.id ?? "demo", slug, tier);
    setProfile(base.profile);
    setLinks(base.links);
    setSocialLinks(base.socialLinks);
    setAppearance(base.appearance);
    setPublished(base.published);
    setTier(base.tier);
    setSlug(base.slug);
    setSaved(true);
  }, [currentPage, slug, tier, user]);

  return {
    profile,
    setProfile,
    links,
    setLinks,
    socialLinks,
    setSocialLinks,
    appearance,
    setAppearance,
    published,
    setPublished,
    tier,
    slug,
    setSlug,
    saving,
    saved,
    addLink,
    removeLink,
    updateLink,
    moveLink,
    addSocial,
    updateSocial,
    removeSocial,
    resetTo,
    assemble,
    commit,
  };
}
