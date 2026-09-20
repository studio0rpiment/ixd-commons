"use client";

import { useSyncExternalStore } from "react";
import { THEMES, THEME_KEY, isTheme, type Theme } from "@/lib/theme";
import { ThemeIcon } from "./ThemeIcon";

const EVENT = "gwdc-theme-change";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb); // another tab changed it
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const read = (): Theme => {
  const t = document.documentElement.getAttribute("data-theme");
  return isTheme(t) ? t : THEMES[0];
};
const readServer = (): Theme => THEMES[0];

function next(t: Theme): Theme {
  return THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
}

function choose(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/**
 * One quiet icon in the top-right corner showing the current theme; click to
 * cycle. The <html data-theme> attribute is the store; clicks are the events.
 */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, read, readServer);
  const label = `Theme: ${theme}. Switch to ${next(theme)}`;

  return (
    <button
      type="button"
      onClick={() => choose(next(theme))}
      aria-label={label}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 10,
        display: "grid",
        placeItems: "center",
        width: "2.25rem",
        height: "2.25rem",
        padding: 0,
        border: 0,
        background: "transparent",
        color: "var(--muted)",
        cursor: "pointer",
      }}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}
