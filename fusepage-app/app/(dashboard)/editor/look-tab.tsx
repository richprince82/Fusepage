"use client";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
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
      <CardBody className="space-y-5">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Theme
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pageThemes.map((theme) => {
              const preset = themePreset(theme.value);
              return (
                <button
                  key={theme.value}
                  type="button"
                  className={`rounded-xl border text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                    appearance.theme === theme.value
                      ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                  style={{
                    background: preset.bg,
                    color: preset.text,
                    borderColor:
                      appearance.theme === theme.value
                        ? preset.accent
                        : preset.border,
                  }}
                  onClick={() => onAppearanceChange({ theme: theme.value })}
                  aria-pressed={appearance.theme === theme.value}
                  aria-label={`Theme ${theme.label}`}
                >
                  <div className="p-3">
                    <div
                      className="rounded-lg h-6 w-full"
                      style={{
                        background: preset.surface,
                        border: `1px solid ${preset.border}`,
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                      }}
                    />
                  </div>
                  <p className="px-3 pb-2 text-xs font-medium">{theme.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Style
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pageStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                className={`rounded-xl border text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  appearance.style === style.value
                    ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
                onClick={() => onAppearanceChange({ style: style.value })}
                aria-pressed={appearance.style === style.value}
                aria-label={`Style ${style.label}`}
              >
                <div className="p-3 flex items-center justify-center bg-white rounded-lg border border-[var(--border)]">
                  <span className="text-xs font-semibold" style={{ color: appearance.textColor }}>
                    {style.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Accent color
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "#2563eb",
              "#7c3aed",
              "#ec4899",
              "#f97316",
              "#10b981",
              "#06b6d4",
              "#e11d48",
              "#65a30d",
            ].map((color) => (
              <button
                key={color}
                type="button"
                className={`h-9 w-9 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${appearance.accentColor === color ? "ring-2 ring-offset-2 ring-[var(--ink)] scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: color }}
                onClick={() => onAppearanceChange({ accentColor: color })}
                aria-pressed={appearance.accentColor === color}
                aria-label={`Accent color ${color}`}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={appearance.accentColor}
                onChange={(e) => onAppearanceChange({ accentColor: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded-full border border-[var(--border)] p-0.5"
                aria-label="Custom accent color"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Text color
          </h3>
          <div className="flex flex-wrap gap-2">
            {["#111827", "#0f172a", "#292524", "#000000"].map((color) => (
              <button
                key={color}
                type="button"
                className={`h-9 w-9 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${appearance.textColor === color ? "ring-2 ring-offset-2 ring-[var(--ink)] scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: color }}
                onClick={() => onAppearanceChange({ textColor: color })}
                aria-pressed={appearance.textColor === color}
                aria-label={`Text color ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Background
          </h3>
          <Select
            value={appearance.background}
            options={[
              { value: "solid", label: "Solid" },
              { value: "gradient", label: "Gradient" },
              { value: "image", label: "Image" },
            ]}
            onChange={(e) =>
              onAppearanceChange({ background: e.target.value as "solid" | "gradient" | "image" })
            }
          />
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <PaletteIcon size={16} />
            Button style
          </h3>
          <Select
            value={appearance.buttonStyle}
            options={[
              { value: "filled", label: "Filled" },
              { value: "outlined", label: "Outlined" },
              { value: "ghost", label: "Ghost" },
            ]}
            onChange={(e) =>
              onAppearanceChange({
                buttonStyle: e.target.value as "filled" | "outlined" | "ghost",
              })
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
