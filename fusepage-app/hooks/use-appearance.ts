import { type PageTheme, type PageAppearance } from "@/types";

const THEME_TOKENS: Record<
  PageTheme,
  { bg: string; surface: string; text: string; muted: string; accent: string; border: string }
> = {
  minimal: { bg: "#ffffff", surface: "#ffffff", text: "#111827", muted: "#6b7280", accent: "#2563eb", border: "#e5e7eb" },
  clean: { bg: "#f8fafc", surface: "#ffffff", text: "#0f172a", muted: "#64748b", accent: "#0ea5e9", border: "#e2e8f0" },
  bold: { bg: "#0b0f1a", surface: "#111827", text: "#ffffff", muted: "#94a3b8", accent: "#f97316", border: "#1f2937" },
  soft: { bg: "#f4f6fb", surface: "#ffffff", text: "#1f2937", muted: "#6b7280", accent: "#7c3aed", border: "#e5e7eb" },
  dark: { bg: "#020617", surface: "#0f172a", text: "#f8fafc", muted: "#94a3b8", accent: "#3b82f6", border: "#1e293b" },
  warm: { bg: "#fbf7f0", surface: "#ffffff", text: "#292524", muted: "#78716c", accent: "#c2410c", border: "#e7e2d8" },
  vivid: { bg: "#0a0a0a", surface: "#141414", text: "#ffffff", muted: "#a1a1aa", accent: "#ec4899", border: "#27272a" },
  mono: { bg: "#fafafa", surface: "#ffffff", text: "#000000", muted: "#525252", accent: "#18181b", border: "#e4e4e7" },
};

export function appearanceTokens(appearance: PageAppearance) {
  const base = THEME_TOKENS[appearance.theme] ?? THEME_TOKENS.clean;
  return {
    ...base,
    accent: appearance.accentColor,
    text: appearance.textColor,
    bg: appearance.background === "gradient"
      ? `linear-gradient(135deg, ${appearance.accentColor}11, ${appearance.textColor}08)`
      : base.bg,
    surface: appearance.background === "gradient" ? "#ffffff" : base.surface,
    border: appearance.background === "gradient" ? "#e5e7eb" : base.border,
  };
}

export function themePreset(theme: PageTheme) {
  return THEME_TOKENS[theme] ?? THEME_TOKENS.clean;
}
