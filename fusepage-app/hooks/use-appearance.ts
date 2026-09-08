import { type PageTheme, type PageAppearance, type PageStyle } from "@/types";

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

const STYLE_RADIUS: Record<PageStyle, string> = {
  "rounded-soft": "18px",
  "sharp-modern": "6px",
  "card-elegant": "24px",
  "list-minimal": "0px",
};

export function appearanceTokens(appearance: PageAppearance) {
  const base = THEME_TOKENS[appearance.theme] ?? THEME_TOKENS.clean;
  const safeImage = appearance.backgroundImageUrl?.trim();

  let bg = base.bg;
  if (appearance.background === "gradient") {
    bg = `linear-gradient(135deg, ${appearance.accentColor}24, ${appearance.textColor}0d), ${base.bg}`;
  } else if (appearance.background === "image" && safeImage) {
    bg = `linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)), url("${safeImage.replace(/"/g, "%22")}") center / cover fixed`;
  }

  return {
    ...base,
    accent: appearance.accentColor,
    text: appearance.textColor,
    bg,
    surface: base.surface,
    border: base.border,
    radius: STYLE_RADIUS[appearance.style] ?? STYLE_RADIUS["rounded-soft"],
  };
}

export function buttonAppearanceStyle(appearance: PageAppearance, tokens: ReturnType<typeof appearanceTokens>) {
  if (appearance.buttonStyle === "outlined") {
    return { background: "transparent", color: tokens.text, borderColor: tokens.accent };
  }
  if (appearance.buttonStyle === "ghost") {
    return { background: "transparent", color: tokens.accent, borderColor: "transparent" };
  }
  return { background: tokens.surface, color: tokens.text, borderColor: tokens.border };
}

export function themePreset(theme: PageTheme) {
  return THEME_TOKENS[theme] ?? THEME_TOKENS.clean;
}
