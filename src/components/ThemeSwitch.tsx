"use client";

import { useEffect, useState } from "react";
import { THEMES, THEME_KEY, isTheme, type Theme } from "@/lib/theme";

/** Three-way theme picker. Writes data-theme on <html> and remembers per browser. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Sync with what the init script already applied (event: mount).
  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (isTheme(t)) setTheme(t);
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {}
  };

  return (
    <span role="group" aria-label="Theme" style={{ display: "inline-flex", gap: "0.25rem", marginLeft: "auto" }}>
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => choose(t)}
          aria-pressed={theme === t}
          className="small"
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
