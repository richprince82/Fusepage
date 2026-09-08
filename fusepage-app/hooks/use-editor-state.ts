"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/store";
import { type Page, type Profile, type LinkBlock, type SocialLink, type PageAppearance, type Tier } from "@/types";
import { createEmptyPage, DEFAULT_APPEARANCE } from "@/lib/demo-data";

const AUTOSAVE_MS = 1200;

export function useEditorState() {
  const { user, page: currentPage, upsertPage, loading } = useAuth();
  const userId = user?.id ?? "";
  const username = user?.username ?? "";

  const [profile, setProfile] = useState<Profile>(() =>
    currentPage?.profile ?? { name: "", username: "", headline: "", bio: "", avatarUrl: undefined, location: undefined, role: undefined }
  );
  const [links, setLinks] = useState<LinkBlock[]>(() => currentPage?.links ?? []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => currentPage?.socialLinks ?? []);
  const [appearance, setAppearance] = useState<PageAppearance>(() => currentPage?.appearance ?? { ...DEFAULT_APPEARANCE });
  const [published, setPublished] = useState<boolean>(currentPage?.published ?? false);
  const [tier] = useState<Tier>(currentPage?.tier ?? (user?.tier ?? "free"));
  const [slug, setSlug] = useState<string>(currentPage?.slug ?? username);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(currentPage));

  const pageIdentityRef = useRef({
    id: currentPage?.id ?? "",
    createdAt: currentPage?.createdAt ?? new Date().toISOString(),
  });
  const lastPersistedRef = useRef<Page | null>(currentPage ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((next: Page) => {
    lastPersistedRef.current = next;
    upsertPage(next);
    setSaved(true);
    setSaving(false);
  }, [upsertPage]);

  const assemble = useCallback((): Page | null => {
    if (!userId) return null;
    return {
      id: pageIdentityRef.current.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      slug: slug.trim() || username,
      profile: { ...profile, username: slug.trim() || profile.username || username },
      links: [...links].sort((a, b) => a.order - b.order),
      socialLinks,
      appearance,
      tier,
      published,
      createdAt: pageIdentityRef.current.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }, [userId, username, slug, profile, links, socialLinks, appearance, tier, published]);

  const commit = useCallback(() => {
    const next = assemble();
    if (!next) return null;
    if (!pageIdentityRef.current.id) pageIdentityRef.current.id = next.id;
    persist(next);
    return next;
  }, [assemble, persist]);

  useEffect(() => {
    if (loading || !userId || !pageIdentityRef.current.id) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaving(true);
      commit();
    }, AUTOSAVE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [profile, links, socialLinks, appearance, slug, published, tier, commit, loading, userId]);

  const addLink = useCallback((type: LinkBlock["type"] = "link") => {
    setLinks((prev) => {
      const order = prev.length ? Math.max(...prev.map((link) => link.order)) + 1 : 0;
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
    setSaved(false);
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id).map((link, index) => ({ ...link, order: index })));
    setSaved(false);
  }, []);

  const updateLink = useCallback((id: string, patch: Partial<LinkBlock>) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...patch } : link)));
    setSaved(false);
  }, []);

  const moveLink = useCallback((from: string, to: number) => {
    setLinks((prev) => {
      const item = prev.find((link) => link.id === from);
      if (!item) return prev;
      const filtered = prev.filter((link) => link.id !== from);
      const clampedTo = Math.max(0, Math.min(to, filtered.length));
      filtered.splice(clampedTo, 0, item);
      return filtered.map((link, index) => ({ ...link, order: index }));
    });
    setSaved(false);
  }, []);

  const addSocial = useCallback((platform: string) => {
    setSocialLinks((prev) => {
      if (prev.some((social) => social.platform === platform)) return prev;
      return [...prev, {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        platform,
        handle: "",
        url: undefined,
      }];
    });
    setSaved(false);
  }, []);

  const updateSocial = useCallback((id: string, patch: Partial<SocialLink>) => {
    setSocialLinks((prev) => prev.map((social) => (social.id === id ? { ...social, ...patch } : social)));
    setSaved(false);
  }, []);

  const removeSocial = useCallback((id: string) => {
    setSocialLinks((prev) => prev.filter((social) => social.id !== id));
    setSaved(false);
  }, []);

  const resetTo = useCallback(() => {
    const base = lastPersistedRef.current ?? currentPage ?? createEmptyPage(userId || "demo", slug, tier);
    setProfile(base.profile);
    setLinks(base.links);
    setSocialLinks(base.socialLinks);
    setAppearance(base.appearance);
    setPublished(base.published);
    setSlug(base.slug);
    setSaved(true);
  }, [currentPage, userId, slug, tier]);

  return {
    profile,
    setProfile,
    links,
    socialLinks,
    appearance,
    setAppearance,
    published,
    setPublished,
    tier,
    slug,
    setSlug,
    saving,
    saved,
    setSaved,
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
