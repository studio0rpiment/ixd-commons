/**
 * The corner switch cycles three slots. The "light" slot is paper until a
 * custom pair is saved, then it is that pair. The square button beneath the
 * icon opens the two-colour form at any time.
 */
export const SLOTS = ["mono", "light", "rfc"] as const;
export type Slot = (typeof SLOTS)[number];

/** What actually goes on <html data-theme>. */
export const THEMES = ["mono", "paper", "custom", "rfc"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "gwdc-theme";
export const CUSTOM_KEY = "gwdc-custom";

export type CustomPair = { bg: string; fg: string };

export function isTheme(v: unknown): v is Theme {
  return typeof v === "string" && (THEMES as readonly string[]).includes(v);
}

export function slotOf(t: Theme): Slot {
  return t === "paper" || t === "custom" ? "light" : t;
}

export function nextSlot(s: Slot): Slot {
  return SLOTS[(SLOTS.indexOf(s) + 1) % SLOTS.length];
}

const HEX = /^#[0-9a-f]{6}$/i;
export function isPair(v: unknown): v is CustomPair {
  return !!v && typeof v === "object" && HEX.test((v as CustomPair).bg ?? "") && HEX.test((v as CustomPair).fg ?? "");
}

/** Apply a theme to <html>: the attribute, plus inline --bg/--fg only for custom. */
export function applyTheme(t: Theme, pair: CustomPair | null) {
  const el = document.documentElement;
  el.setAttribute("data-theme", t);
  if (t === "custom" && pair) {
    el.style.setProperty("--bg", pair.bg);
    el.style.setProperty("--fg", pair.fg);
  } else {
    el.style.removeProperty("--bg");
    el.style.removeProperty("--fg");
  }
}

/** The page's current two colours, as the CSS tokens resolve right now. */
export function currentPair(): CustomPair {
  const cs = getComputedStyle(document.documentElement);
  const hex = (v: string, fallback: string) => (/^#[0-9a-f]{6}$/i.test(v.trim()) ? v.trim().toLowerCase() : fallback);
  return { bg: hex(cs.getPropertyValue("--bg"), "#000000"), fg: hex(cs.getPropertyValue("--fg"), "#ffffff") };
}

/** Live preview: paint a pair without remembering it. */
export function previewPair(pair: CustomPair) {
  applyTheme("custom", pair);
}

/**
 * Runs before first paint so a chosen theme never flashes. Mirrors applyTheme
 * without imports. With nothing stored, CSS renders the default (mono).
 */
export const themeInitScript = `(function(){try{
var el=document.documentElement,t=localStorage.getItem(${JSON.stringify(THEME_KEY)});
if(t==="custom"){var p=JSON.parse(localStorage.getItem(${JSON.stringify(CUSTOM_KEY)})||"null");
if(p&&/^#[0-9a-f]{6}$/i.test(p.bg)&&/^#[0-9a-f]{6}$/i.test(p.fg)){el.style.setProperty("--bg",p.bg);el.style.setProperty("--fg",p.fg);}else{t="paper";}}
if(t&&${JSON.stringify(THEMES)}.indexOf(t)>-1)el.setAttribute("data-theme",t);}catch(e){}})();`;
