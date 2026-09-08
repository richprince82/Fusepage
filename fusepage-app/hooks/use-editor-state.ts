"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/store";
import { type Page, type Profile, type LinkBlock, type SocialLink, type PageAppearance, type Tier } from "@/types";
import { createEmptyPage, DEFAULT_APPEARANCE } from "@/lib/demo-data";

const AUTOSAVE_MS = 1200;

export function useEditorState() {
  const { user, page: currentPage, upsertPage } = useAuth();
  const [profile, setProfile] = useState<Profile>(() =>
    currentPage?.profile ?? { name: "", username: "", headline: "", bio: "", avatarUrl: undefined, location: undefined, role: undefined }
  );
  const [links, setLinks] = useState<LinkBlock[]>(() => currentPage?.links ?? []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => currentPage?.socialLinks ?? []);
  const [appearance, setAppearance] = useState<PageAppearance>(() => currentPage?.appearance ?? { ...DEFAULT_APPEARANCE });
  const [published, setPublished] = useState<boolean>(currentPage?.published ?? false);
  const [tier, setTier] = useState<Tier>(currentPage?.tier ?? (user?.tier ?? "free"));
  const [slug, setSlug] = useState<string>(currentPage?.slug ?? (user?.username ?? ""));

  const lastPersistedRef = useRef<Page | null>(currentPage ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    (next: Page) => {
      lastPersistedRef.current = next;
      upsertPage(next);
      setPublished(next.published);
      setTier(next.tier);
      setSlug(next.slug);
      setSaved(true);
      setSaving(false);
    },
    [upsertPage]
  );

  const commit = useCallback(() => {
    if (!user) return;
    const assembled: Page = {
      id: currentPage?.id ?? crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId: user.id,
      slug: slug || user.username,
      profile: profile,
      links: [...links].sort((a, b) => a.order - b.order),
      socialLinks: socialLinks,
      appearance: appearance,
      tier,
      published,
      createdAt: currentPage?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist(assembled);
    return assembled;
  }, [user, currentPage, slug, profile, links, socialLinks, appearance, tier, published, persist]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaving(true);
      commit();
    }, AUTOSAVE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [profile, links, socialLinks, appearance, slug, published, tier, commit]);

  const addLink = useCallback(
    (type: LinkBlock["type"] = "link") => {
      const order = links.length ? Math.max(...links.map((l) => l.order)) + 1 : 0;
      const newLink: LinkBlock = {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        title: "",
        url: undefined,
        description: undefined,
        icon: undefined,
        visible: true,
        order,
      };
      setLinks((prev) => [...prev, newLink]);
    },
    [links]
  );

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLink = useCallback(
    (id: string, patch: Partial<LinkBlock>) => {
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    },
    []
  );

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

  const addSocial = useCallback(
    (platform: string) => {
      const handle = "";
      const existing = socialLinks.find((s) => s.platform === platform);
      if (existing) {
        setSocialLinks((prev) => prev.map((s) => (s.platform === platform ? { ...s, handle: "", url: undefined } : s)));
        return;
      }
      const newSocial: SocialLink = {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        platform,
        handle,
        url: undefined,
      };
      setSocialLinks((prev) => [...prev, newSocial]);
    },
    [socialLinks]
  );

  const updateSocial = useCallback((id: string, patch: Partial<SocialLink>) => {
    setSocialLinks((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeSocial = useCallback((id: string) => {
    setSocialLinks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleLinkVisibility = useCallback((id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
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
  }, [currentPage, lastPersistedRef, slug, tier, user]);

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
    setPublished: setPublished,
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
    toggleLinkVisibility,
    resetTo,
    commit,
  };
}
