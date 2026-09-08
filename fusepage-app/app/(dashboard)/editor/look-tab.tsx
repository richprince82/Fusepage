"use client";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { PaletteIcon } from "@/components/ui/Icon";
import { pageThemes, pageStyles } from "@/lib/demo-data";
import { type PageAppearance } from "@/types";
import { themePreset } from "@/hooks/use-appearance";

interface LookTabProps {
  appearance: PageAppearance;
  onAppearanceChange: (patch: Partial<PageAppearance>) => void;
}

export function LookTab({ appearance, onAppearanceChange }: LookTabProps) {
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Look & feel</CardTitle>
      </CardHeader>
      <CardBody className="space-y-6">
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]"><PaletteIcon size={16} />Theme</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pageThemes.map((theme) => {
              const preset = themePreset(theme.value);
              const active = appearance.theme === theme.value;
              return (
                <button
                  key={theme.value}
                  type="button"
                  className={`rounded-xl border text-left transition focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${active ? "ring-2 ring-[var(--accent)]/20" : "hover:-translate-y-0.5"}`}
                  style={{ background: preset.bg, color: preset.text, borderColor: active ? preset.accent : preset.border }}
                  onClick={() => onAppearanceChange({ theme: theme.value, accentColor: preset.accent, textColor: preset.text })}
                  aria-pressed={active}
                >
                  <div className="p-3">
                    <div className="h-8 rounded-lg" style={{ background: preset.surface, border: `1px solid ${preset.border}` }} />
                    <p className="mt-2 text-xs font-medium">{theme.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Page shape</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pageStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                className={`min-h-20 border bg-white p-3 text-left text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${appearance.style === style.value ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-[var(--border)]"}`}
                style={{ borderRadius: style.value === "sharp-modern" ? 6 : style.value === "card-elegant" ? 24 : style.value === "list-minimal" ? 0 : 18 }}
                onClick={() => onAppearanceChange({ style: style.value })}
                aria-pressed={appearance.style === style.value}
              >
                {style.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Accent color</h3>
            <div className="flex flex-wrap gap-2">
              {["#2563eb", "#7c3aed", "#ec4899", "#f97316", "#10b981", "#06b6d4", "#e11d48", "#65a30d"].map((color) => (
                <button key={color} type="button" className={`h-9 w-9 rounded-full border-2 border-white shadow-sm ${appearance.accentColor === color ? "ring-2 ring-offset-1 ring-[var(--ink)]" : ""}`} style={{ backgroundColor: color }} onClick={() => onAppearanceChange({ accentColor: color })} aria-label={`Accent color ${color}`} aria-pressed={appearance.accentColor === color} />
              ))}
              <input type="color" value={appearance.accentColor} onChange={(e) => onAppearanceChange({ accentColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded-full border border-[var(--border)]" aria-label="Custom accent color" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Text color</h3>
            <div className="flex flex-wrap gap-2">
              {["#111827", "#0f172a", "#292524", "#000000", "#ffffff"].map((color) => (
                <button key={color} type="button" className={`h-9 w-9 rounded-full border border-[var(--border)] ${appearance.textColor === color ? "ring-2 ring-offset-1 ring-[var(--ink)]" : ""}`} style={{ backgroundColor: color }} onClick={() => onAppearanceChange({ textColor: color })} aria-label={`Text color ${color}`} aria-pressed={appearance.textColor === color} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Background"
            value={appearance.background}
            options={[{ value: "solid", label: "Solid" }, { value: "gradient", label: "Gradient" }, { value: "image", label: "Image" }]}
            onChange={(e) => onAppearanceChange({ background: e.target.value as PageAppearance["background"] })}
          />
          <Select
            label="Button style"
            value={appearance.buttonStyle}
            options={[{ value: "filled", label: "Filled" }, { value: "outlined", label: "Outlined" }, { value: "ghost", label: "Ghost" }]}
            onChange={(e) => onAppearanceChange({ buttonStyle: e.target.value as PageAppearance["buttonStyle"] })}
          />
        </section>

        {appearance.background === "image" && (
          <Input
            label="Background image URL"
            type="url"
            value={appearance.backgroundImageUrl ?? ""}
            onChange={(e) => onAppearanceChange({ backgroundImageUrl: e.target.value || undefined })}
            placeholder="https://images.example.com/background.jpg"
            hint="Use a direct image URL. The public page uses it as a cover background."
          />
        )}
      </CardBody>
    </Card>
  );
}
