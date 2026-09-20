export const THEMES = ["paper", "ink", "rfc"] as const;
export type Theme = (typeof THEMES)[number];
export const THEME_KEY = "gwdc-theme";

export function isTheme(v: unknown): v is Theme {
  return typeof v === "string" && (THEMES as readonly string[]).includes(v);
}

/**
 * Runs before first paint so a chosen theme never flashes. Reads localStorage
 * only; with nothing stored, CSS falls back to the system preference.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t&&${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
