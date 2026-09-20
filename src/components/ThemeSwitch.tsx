"use client";

import { useState, useSyncExternalStore } from "react";
import {
  CUSTOM_KEY,
  THEME_KEY,
  applyTheme,
  isPair,
  isTheme,
  nextSlot,
  slotOf,
  type CustomPair,
  type Slot,
  type Theme,
} from "@/lib/theme";
import { ThemeIcon, ReturnIcon, WavesIcon } from "./ThemeIcon";
import { ThemeForm } from "./ThemeForm";

const EVENT = "gwdc-theme-change";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const readTheme = (): Theme => {
  const t = document.documentElement.getAttribute("data-theme");
  return isTheme(t) ? t : "mono";
};
const readPair = (): CustomPair | null => {
  try {
    const p = JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "null");
    return isPair(p) ? p : null;
  } catch {
    return null;
  }
};
// Snapshot as a string so useSyncExternalStore sees a stable value.
const read = () => JSON.stringify({ t: readTheme(), p: readPair() });
const readServer = () => JSON.stringify({ t: "mono", p: null });

function set(t: Theme, pair: CustomPair | null) {
  applyTheme(t, pair);
  try {
    localStorage.setItem(THEME_KEY, t);
    if (pair) localStorage.setItem(CUSTOM_KEY, JSON.stringify(pair));
    else if (t !== "custom") localStorage.removeItem(CUSTOM_KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

const corner: React.CSSProperties = {
  position: "fixed",
  top: "1rem",
  right: "1rem",
  zIndex: 10,
  display: "grid",
  justifyItems: "end",
  gap: "0.5rem",
};
const iconButton: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "2.25rem",
  height: "2.25rem",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "var(--muted)",
  cursor: "pointer",
};

/**
 * One quiet icon in the top-right corner showing the current theme; click to
 * cycle mono → light → rfc → input. The "input" stop shows a return arrow
 * (back to mono) and a square wavy button that opens the two-colour form.
 */
export function ThemeSwitch() {
  const { t: theme, p: pair } = JSON.parse(useSyncExternalStore(subscribe, read, readServer)) as {
    t: Theme;
    p: CustomPair | null;
  };
  const [formOpen, setFormOpen] = useState(false);
  const slot: Slot = slotOf(theme);

  const goTo = (s: Slot) => {
    setFormOpen(false);
    if (s === "light") set(pair ? "custom" : "paper", pair);
    else set(s, pair);
  };

  if (slot !== "input") {
    return (
      <div style={corner}>
        <button type="button" onClick={() => goTo(nextSlot(slot))} aria-label={`Theme: ${theme}`} style={iconButton}>
          <ThemeIcon theme={theme} />
        </button>
      </div>
    );
  }

  return (
    <div style={corner}>
      <button type="button" onClick={() => goTo("mono")} aria-label="Back to default theme" style={iconButton}>
        <ReturnIcon />
      </button>
      <button
        type="button"
        onClick={() => setFormOpen((o) => !o)}
        aria-label="Choose two colours"
        aria-expanded={formOpen}
        style={{ ...iconButton, border: "1px solid var(--line)" }}
      >
        <WavesIcon />
      </button>
      {formOpen && (
        <ThemeForm
          initial={pair ?? { bg: "#f5f4ed", fg: "#2b1810" }}
          onEnter={(p) => {
            setFormOpen(false);
            set("custom", p);
          }}
          onLight={() => {
            setFormOpen(false);
            set("paper", null);
          }}
        />
      )}
    </div>
  );
}
