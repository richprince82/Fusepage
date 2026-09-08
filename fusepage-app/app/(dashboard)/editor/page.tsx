"use client";

import { useState } from "react";
import { useAuth } from "@/lib/store";
import { useEditorState } from "@/hooks/use-editor-state";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Pill } from "@/components/ui/Pill";
import { FeaturedPreview } from "@/components/marketing/FeaturedPreview";
import { LookTab } from "./look-tab";
void undefined;
import {
  LinkIcon,
  SocialIcon as SocialIconComp,
  FeaturedIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@/components/ui/Icon";
import { socialPlatforms, linkTypeOptions } from "@/lib/demo-data";

export default function EditorPage() {
  const { user } = useAuth();
  const editor = useEditorState();
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [expandedSocial, setExpandedSocial] = useState<string | null>(null);

  if (!user) return null;

  const tabs = [
    { key: "links" as const, label: "Links", count: editor.links.length },
    { key: "social" as const, label: "Social", count: editor.socialLinks.length },
    { key: "look" as const, label: "Look & feel", count: null },
  ];

  const chevronRight =
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>;

  void chevronRight;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Edit page</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update your profile, links, and appearance. Changes save automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* editor panel */}
        <div className="flex flex-col gap-6">
          {/* publish bar */}
          <Card variant="elevated">
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--brand)]">
                  <SparklesIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{editor.published ? "Page is live" : "Draft"}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {editor.published
                      ? `Published at fusepage.app/${editor.slug}`
                      : "Publish to make this page visible"}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-2 sm:ml-auto">
                <Button
                  variant={editor.published ? "secondary" : "primary"}
                  className="flex-1"
                  onClick={() => editor.setPublished((v) => !v)}
                  left={editor.published ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                >
                  {editor.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  variant="ghost"
                  disabled={editor.saving}
                  className="flex items-center justify-center gap-1"
                >
                  {editor.saving ? (
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : editor.saved ? (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : chevronRight}
                  {editor.saving ? "Saving…" : editor.saved ? "Saved" : "Unsaved"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* tabs */}
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  tab.key === "links"
                    ? "border-[var(--accent)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {tab.label}
                {tab.count != null && (
                  <span className="rounded-full bg-[var(--color-brand-soft)] px-1.5 py-0.5 text-xs text-[var(--brand)]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* profile */}
          <ProfileSection editor={editor} />

          {/* links */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <Button variant="ghost" size="sm" left={<PlusIcon size={16} />} onClick={() => editor.addLink()}>
                Add link
              </Button>
            </CardHeader>
            <CardBody className="space-y-2">
              {editor.links.length === 0 ? (
                <div className="border border-dashed border-[var(--border)] rounded-xl py-8 text-center text-sm text-[var(--muted)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)]">
                    <LinkIcon size={20} />
                  </div>
                  <p>No links yet. Add your first link to get started.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {editor.links.map((link) => (
                    <LinkBlockItem
                      key={link.id}
                      link={link}
                      expanded={expandedLink === link.id}
                      onToggle={() => setExpandedLink((v) => (v === link.id ? null : link.id))}
                      onUpdate={(patch) => editor.updateLink(link.id, patch)}
                      onRemove={() => editor.removeLink(link.id)}
                      onMove={(to) => editor.moveLink(link.id, to)}
                    />
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* social */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Social profiles</CardTitle>
              <div className="flex gap-1">
                {socialPlatforms.slice(0, 6).map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                    onClick={() => editor.addSocial(p.value)}
                    aria-label={`Add ${p.label}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {editor.socialLinks.length === 0 ? (
                <div className="border border-dashed border-[var(--border)] rounded-xl py-8 text-center text-sm text-[var(--muted)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--brand)]">
                    <SocialIconComp platform="twitter" size={20} />
                  </div>
                  <p>Connect social profiles so visitors can follow you.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {editor.socialLinks.map((social) => (
                    <SocialBlockItem
                      key={social.id}
                      social={social}
                      expanded={expandedSocial === social.id}
                      onToggle={() => setExpandedSocial((v) => (v === social.id ? null : social.id))}
                      onUpdate={(patch) => editor.updateSocial(social.id, patch)}
                      onRemove={() => editor.removeSocial(social.id)}
                    />
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        {/* preview and look */}
        <div className="flex flex-col gap-6">
          {/* look & feel */}
          <LookTab
            appearance={editor.appearance}
            onAppearanceChange={(patch) => editor.setAppearance((prev) => ({ ...prev, ...patch }))}
          />

          {/* preview */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <div className="flex gap-2">
                <Pill variant={editor.tier === "pro" ? "accent" : "default"}>
                  {editor.tier === "pro" ? "Pro · no branding" : "Free · branding"}
                </Pill>
              </div>
            </CardHeader>
            <CardBody className="flex justify-center">
              <FeaturedPreview />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ editor }: { editor: ReturnType<typeof useEditorState> }) {
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xl font-semibold shadow-sm">
            {editor.profile.avatarUrl ? (
              <img src={editor.profile.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span>
                {editor.profile.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s[0]?.toUpperCase() ?? "")
                  .join("") ?? "??"}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              label="Display name"
              value={editor.profile.name}
              onChange={(e) => editor.setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
            <Input
              label="Username"
              value={editor.profile.username}
              onChange={(e) => editor.setSlug(e.target.value)}
              placeholder="username"
              hint="Used in your public page URL."
            />
          </div>
        </div>

        <Input
          label="Headline"
          value={editor.profile.headline}
          onChange={(e) => editor.setProfile((p) => ({ ...p, headline: e.target.value }))}
          placeholder="What you do in one line"
        />
        <Input
          label="Bio"
          value={editor.profile.bio}
          onChange={(e) => editor.setProfile((p) => ({ ...p, bio: e.target.value }))}
          placeholder="A short bio for your visitors"
          hint="Appears under your name on your public page."
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Location"
            value={editor.profile.location ?? ""}
            onChange={(e) => editor.setProfile((p) => ({ ...p, location: e.target.value || undefined }))}
            placeholder="City, country"
          />
          <Input
            label="Role"
            value={editor.profile.role ?? ""}
            onChange={(e) => editor.setProfile((p) => ({ ...p, role: e.target.value || undefined }))}
            placeholder="Role or title"
          />
        </div>
        <Input
          label="Avatar URL"
          type="url"
          value={editor.profile.avatarUrl ?? ""}
          onChange={(e) => editor.setProfile((p) => ({ ...p, avatarUrl: e.target.value || undefined }))}
          placeholder="https://example.com/avatar.jpg"
          hint="Optional. Leave blank to show initials."
        />
      </CardBody>
    </Card>
  );
}

function LinkBlockItem({
  link,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
  onMove,
}: {
  link: { id: string; type: "link" | "social" | "featured"; title: string; url?: string; description?: string; visible: boolean; order: number };
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<typeof link>) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
}) {
  const [localType, setLocalType] = useState<typeof link.type>(link.type);
  const [localTitle, setLocalTitle] = useState(link.title);
  const [localUrl, setLocalUrl] = useState(link.url ?? "");
  const [localDescription, setLocalDescription] = useState(link.description ?? "");

  const typeIcon =
    localType === "featured"
      ? FeaturedIcon
      : localType === "social"
        ? SocialIconComp
        : LinkIcon;

  const chevron = (
    <ChevronDownIcon
      size={16}
      className={`shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
    />
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <button
          type="button"
          className="cursor-grab shrink-0 rounded-full border border-transparent p-0.5 transition-colors hover:border-[var(--border)] hover:bg-[var(--color-brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon size={16} />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted)]">
          <typeIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--ink)]">
            {localTitle || "Untitled link"}
          </p>
          {localDescription && <p className="truncate text-xs text-[var(--muted)]">{localDescription}</p>}
        </div>              <Badge variant={localType === "featured" ? "warning" : localType === "social" ? "info" : "default"}>
          {localType}
        </Badge>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`rounded-full p-1 text-[var(--muted)] transition-colors hover:text-[var(--ink)] hover:bg-[var(--color-brand-soft)] ${link.visible ? "" : "opacity-50"}`}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ visible: !link.visible });
            }}
            aria-label={link.visible ? "Hide link" : "Show link"}
            aria-pressed={!link.visible}
          >
            {link.visible ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
          </button>
          <button
            type="button"
            className="rounded-full p-1 text-[var(--muted)] transition-colors hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove link"
          >
            <TrashIcon size={16} />
          </button>
          {chevron}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] px-4 py-4 space-y-4">
          <Select
            label="Link type"
            value={localType}
            options={linkTypeOptions.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(e) => {
              const next = e.target.value as typeof link.type;
              setLocalType(next);
              onUpdate({ type: next });
            }}
          />
          <Input
            label="Title"
            value={localTitle}
            onChange={(e) => {
              setLocalTitle(e.target.value);
              onUpdate({ title: e.target.value });
            }}
            placeholder="Link title"
          />
          <Input
            label="URL"
            type="url"
            value={localUrl}
            onChange={(e) => {
              setLocalUrl(e.target.value);
              onUpdate({ url: e.target.value || undefined });
            }}
            placeholder="https://..."
            hint="The link visitors will open."
          />
          <Input
            label="Description"
            value={localDescription}
            onChange={(e) => {
              setLocalDescription(e.target.value);
              onUpdate({ description: e.target.value || undefined });
            }}
            placeholder="Short description"
          />

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--muted)]"
              onClick={() => {
                const total = 5;
                const current = Math.max(0, Math.min(total, link.order));
                onMove(current > 0 ? current - 1 : 0);
              }}
            >
              Move up
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--muted)]"
              onClick={() => {
                const total = 5;
                const current = Math.max(0, Math.min(total, link.order));
                onMove(current < total ? current + 1 : total);
              }}
            >
              Move down
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SocialBlockItem({
  social,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
}: {
  social: { id: string; platform: string; handle: string; url?: string };
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<typeof social>) => void;
  onRemove: () => void;
}) {
  const [localHandle, setLocalHandle] = useState(social.handle);
  const chevron = (
    <ChevronDownIcon size={16} className={`shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} />
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted)]">
          <SocialIconComp platform={social.platform} size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--ink)] capitalize">{social.platform}</p>
          <p className="truncate text-xs text-[var(--muted)]">{localHandle || `@ handle`}</p>
        </div>
        {chevron}
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] px-4 py-4 space-y-4">
          <Input
            label="Handle"
            value={localHandle}
            onChange={(e) => {
              setLocalHandle(e.target.value);
              onUpdate({ handle: e.target.value });
            }}
            placeholder={`@${social.platform}`}
          />
          <Input
            label="Profile URL"
            type="url"
            value={social.url ?? ""}
            onChange={(e) => onUpdate({ url: e.target.value || undefined })}
            placeholder="https://..."
            hint="Optional custom link."
          />
          <div className="flex justify-end border-t border-[var(--border)] pt-3">
            <Button variant="danger" size="sm" onClick={onRemove}>Remove</Button>
          </div>
        </div>
      )}
    </div>
  );
}
