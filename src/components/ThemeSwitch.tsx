"use client";

import { useSyncExternalStore } from "react";
import { THEMES, THEME_KEY, isTheme, type Theme } from "@/lib/theme";

const EVENT = "gwdc-theme-change";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb); // another tab changed it
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const read = (): Theme | null => {
  const t = document.documentElement.getAttribute("data-theme");
  return isTheme(t) ? t : null;
};
const readServer = () => null;

function choose(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Three-way theme picker. The <html data-theme> attribute is the store; clicks are the events. */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, read, readServer);

  return (
    <span role="group" aria-label="Theme" style={{ display: "inline-flex", gap: "0.25rem", marginLeft: "auto" }}>
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => choose(t)}
          aria-pressed={theme === t}
          style={{
            font: "inherit",
            fontSize: "var(--step--1)",
            padding: "0.2rem 0.5rem",
            border: "1px solid var(--line)",
            background: theme === t ? "var(--fg)" : "transparent",
            color: theme === t ? "var(--bg)" : "var(--muted)",
            cursor: "pointer",
          }}
        >
          {t}
        </button>
      ))}
    </span>
  );
}
