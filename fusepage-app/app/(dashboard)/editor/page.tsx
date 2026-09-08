"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/store";
import { useEditorState } from "@/hooks/use-editor-state";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { FeaturedPreview } from "@/components/marketing/FeaturedPreview";
import { LookTab } from "./look-tab";
import { PlusIcon, TrashIcon, EyeIcon, EyeOffIcon, LinkIcon, SocialIcon } from "@/components/ui/Icon";
import { linkTypeOptions, socialPlatforms } from "@/lib/demo-data";
import { TIER_FEATURES } from "@/lib/billing";
import { type LinkBlock, type SocialLink, type PageAppearance } from "@/types";

const normalizeSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

export default function EditorPage() {
  const { user } = useAuth();
  const editor = useEditorState();
  const [activeTab, setActiveTab] = useState<"links" | "social" | "look">("links");

  if (!user) return null;

  const previewPage = editor.assemble();
  const freeLinkLimit = TIER_FEATURES.free.limits.links;
  const atFreeLinkLimit = editor.tier === "free" && editor.links.length >= freeLinkLimit;
  const allowedFreeThemes = new Set(TIER_FEATURES.free.limits.themes);

  const updateAppearance = (patch: Partial<PageAppearance>) => {
    if (editor.tier === "free" && patch.theme && !allowedFreeThemes.has(patch.theme)) return;
    editor.setAppearance((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Edit page</h1>
          <p className="mt-1 text-[var(--muted)]">Profile, links and appearance save automatically.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]" aria-live="polite">
          <span className={`h-2 w-2 rounded-full ${editor.saving ? "bg-amber-500" : editor.saved ? "bg-emerald-500" : "bg-slate-300"}`} />
          {editor.saving ? "Saving…" : editor.saved ? "Saved" : "Waiting for changes"}
        </div>
      </div>

      <Card variant="elevated">
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">{editor.published ? "Your page is live" : "Your page is a draft"}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">/u/{editor.slug || user.username}</p>
          </div>
          <div className="flex gap-2">
            <Button variant={editor.published ? "secondary" : "primary"} onClick={() => editor.setPublished((value) => !value)}>
              {editor.published ? <><EyeOffIcon size={16} /> Unpublish</> : <><EyeIcon size={16} /> Publish</>}
            </Button>
            <Button variant="ghost" onClick={() => editor.resetTo()}>Reset unsaved</Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-3 border-b border-[var(--border)]" role="tablist" aria-label="Editor sections">
            {([
              ["links", `Links (${editor.links.length})`],
              ["social", `Social (${editor.socialLinks.length})`],
              ["look", "Look & feel"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setActiveTab(key)}
                className={`min-h-11 border-b-2 px-3 py-3 text-sm font-medium transition ${activeTab === key ? "border-[var(--accent)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "links" && (
            <>
              <ProfileEditor editor={editor} />

              <Card variant="bordered">
                <CardHeader>
                  <div>
                    <CardTitle>Links & featured content</CardTitle>
                    {editor.tier === "free" && <p className="mt-1 text-xs text-[var(--muted)]">Free plan: {editor.links.length}/{freeLinkLimit} links.</p>}
                  </div>
                  <Button variant="secondary" size="sm" disabled={atFreeLinkLimit} onClick={() => editor.addLink()} left={<PlusIcon size={16} />}>Add link</Button>
                </CardHeader>
                <CardBody className="space-y-3">
                  {editor.links.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)]"><LinkIcon size={18} /></div>
                      <p className="mt-3 text-sm font-semibold text-[var(--ink)]">No links yet</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">Add a link or featured block to build your page.</p>
                    </div>
                  ) : (
                    editor.links.map((link) => (
                      <LinkEditorItem
                        key={link.id}
                        link={link}
                        total={editor.links.length}
                        onUpdate={(patch) => editor.updateLink(link.id, patch)}
                        onRemove={() => editor.removeLink(link.id)}
                        onMove={(index) => editor.moveLink(link.id, index)}
                      />
                    ))
                  )}
                  {atFreeLinkLimit && <p className="text-xs text-amber-700">You reached the Free plan link limit. Upgrade to Pro for up to {TIER_FEATURES.pro.limits.links} links.</p>}
                </CardBody>
              </Card>
            </>
          )}

          {activeTab === "social" && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Social profiles</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {socialPlatforms.map((platform) => (
                    <Button key={platform.value} variant="secondary" size="sm" onClick={() => editor.addSocial(platform.value)}>{platform.label}</Button>
                  ))}
                </div>
                {editor.socialLinks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">Add the social profiles you want visitors to find.</div>
                ) : (
                  editor.socialLinks.map((social) => <SocialEditorItem key={social.id} social={social} onUpdate={(patch) => editor.updateSocial(social.id, patch)} onRemove={() => editor.removeSocial(social.id)} />)
                )}
              </CardBody>
            </Card>
          )}

          {activeTab === "look" && (
            <div className="space-y-3">
              {editor.tier === "free" && <p className="rounded-lg border border-[var(--border)] bg-[var(--color-brand-soft)] p-3 text-xs text-[var(--brand)]">Free includes Minimal, Clean and Soft themes. Premium themes remain visible in the product but require Pro.</p>}
              <LookTab appearance={editor.appearance} onAppearanceChange={updateAppearance} />
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card variant="bordered">
            <CardHeader><CardTitle>Live preview</CardTitle></CardHeader>
            <CardBody className="flex justify-center">
              <FeaturedPreview pageOverride={previewPage} />
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ProfileEditor({ editor }: { editor: ReturnType<typeof useEditorState> }) {
  const initials = editor.profile.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "??";
  return (
    <Card variant="bordered">
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-lg font-semibold text-white">
            {editor.profile.avatarUrl ? <Image src={editor.profile.avatarUrl} alt="" width={64} height={64} unoptimized className="h-full w-full object-cover" /> : initials}
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <Input label="Display name" value={editor.profile.name} onChange={(e) => editor.setProfile((current) => ({ ...current, name: e.target.value }))} placeholder="Your name" />
            <Input
              label="Username"
              value={editor.slug}
              onChange={(e) => {
                const next = normalizeSlug(e.target.value);
                editor.setSlug(next);
                editor.setProfile((current) => ({ ...current, username: next }));
              }}
              placeholder="username"
              hint="Controls your /u/username URL."
            />
          </div>
        </div>
        <Input label="Headline" value={editor.profile.headline} onChange={(e) => editor.setProfile((current) => ({ ...current, headline: e.target.value }))} placeholder="What you do in one line" />
        <Textarea label="Bio" value={editor.profile.bio} onChange={(e) => editor.setProfile((current) => ({ ...current, bio: e.target.value }))} placeholder="A short introduction" className="min-h-[110px]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Location" value={editor.profile.location ?? ""} onChange={(e) => editor.setProfile((current) => ({ ...current, location: e.target.value || undefined }))} placeholder="City, country" />
          <Input label="Role" value={editor.profile.role ?? ""} onChange={(e) => editor.setProfile((current) => ({ ...current, role: e.target.value || undefined }))} placeholder="Role or title" />
        </div>
        <Input label="Avatar URL" type="url" value={editor.profile.avatarUrl ?? ""} onChange={(e) => editor.setProfile((current) => ({ ...current, avatarUrl: e.target.value || undefined }))} placeholder="https://example.com/avatar.jpg" />
      </CardBody>
    </Card>
  );
}

function LinkEditorItem({ link, total, onUpdate, onRemove, onMove }: {
  link: LinkBlock;
  total: number;
  onUpdate: (patch: Partial<LinkBlock>) => void;
  onRemove: () => void;
  onMove: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white">
      <div className="flex items-center gap-2 p-3">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]" aria-expanded={open}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--brand)]"><LinkIcon size={17} /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[var(--ink)]">{link.title || "Untitled link"}</span>
            <span className="block truncate text-xs text-[var(--muted)]">{link.type}{link.url ? ` · ${link.url}` : ""}</span>
          </span>
        </button>
        <button type="button" onClick={() => onUpdate({ visible: !link.visible })} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--color-brand-soft)]" aria-label={link.visible ? "Hide link" : "Show link"}>{link.visible ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}</button>
        <button type="button" onClick={onRemove} className="rounded-full p-2 text-red-600 hover:bg-red-50" aria-label="Remove link"><TrashIcon size={16} /></button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-[var(--border)] p-4">
          <Select label="Block type" value={link.type} options={linkTypeOptions.map((item) => ({ value: item.value, label: item.label }))} onChange={(e) => onUpdate({ type: e.target.value as LinkBlock["type"] })} />
          <Input label="Title" value={link.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Portfolio" />
          <Input label="URL" type="url" value={link.url ?? ""} onChange={(e) => onUpdate({ url: e.target.value || undefined })} placeholder="https://example.com" />
          <Textarea label="Description" value={link.description ?? ""} onChange={(e) => onUpdate({ description: e.target.value || undefined })} placeholder="Optional description" />
          <div className="flex justify-between gap-2 border-t border-[var(--border)] pt-3">
            <Button variant="ghost" size="sm" disabled={link.order <= 0} onClick={() => onMove(link.order - 1)}>Move up</Button>
            <Button variant="ghost" size="sm" disabled={link.order >= total - 1} onClick={() => onMove(link.order + 1)}>Move down</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SocialEditorItem({ social, onUpdate, onRemove }: { social: SocialLink; onUpdate: (patch: Partial<SocialLink>) => void; onRemove: () => void }) {
  return (
    <div className="grid gap-3 rounded-xl border border-[var(--border)] bg-white p-4 sm:grid-cols-[160px_1fr_1fr_auto] sm:items-end">
      <div className="flex min-h-10 items-center gap-2 text-sm font-semibold capitalize text-[var(--ink)]"><SocialIcon platform={social.platform} size={18} />{social.platform}</div>
      <Input label="Handle" value={social.handle} onChange={(e) => onUpdate({ handle: e.target.value })} placeholder="@handle" />
      <Input label="Profile URL" type="url" value={social.url ?? ""} onChange={(e) => onUpdate({ url: e.target.value || undefined })} placeholder="https://..." />
      <Button variant="danger" size="sm" onClick={onRemove}>Remove</Button>
    </div>
  );
}
