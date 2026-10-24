"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CUSTOM_KEY,
  applyTheme,
  currentPair,
  isPair,
  previewPair,
  isTheme,
  nextSlot,
  slotOf,
  type CustomPair,
  type Slot,
  type Theme,
} from "@/lib/theme";
import { ThemeIcon, WavesIcon } from "./ThemeIcon";
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
    // Only the pair is remembered; which slot shows is picked fresh on each load.
    if (pair) localStorage.setItem(CUSTOM_KEY, JSON.stringify(pair));
    else if (t !== "custom") localStorage.removeItem(CUSTOM_KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

const topRight: React.CSSProperties = {
  position: "fixed",
  top: "1rem",
  right: "1rem",
  zIndex: 10,
};
const bottomRight: React.CSSProperties = {
  position: "fixed",
  bottom: "1rem",
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
 * Top-right corner: one quiet icon showing the current theme (click cycles
 * mono → light → rfc), and beneath it a square wavy button that opens the
 * two-colour pickers. Dragging previews live. Closing with the same button
 * keeps the pair (it becomes the light slot, shown as a bolt); clicking
 * anywhere else puts the page back exactly as it was.
 */
export function ThemeSwitch() {
  const { t: theme, p: pair } = JSON.parse(useSyncExternalStore(subscribe, read, readServer)) as {
    t: Theme;
    p: CustomPair | null;
  };
  const [draft, setDraft] = useState<CustomPair | null>(null); // non-null = panel open
  const before = useRef<{ theme: Theme; pair: CustomPair | null } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const slot: Slot = slotOf(theme);

  const open = () => {
    before.current = { theme, pair };
    setDraft(currentPair());
  };
  const reset = () => {
    if (before.current) applyTheme(before.current.theme, before.current.pair);
    before.current = null;
    setDraft(null);
  };
  const keep = () => {
    if (draft) set("custom", draft);
    before.current = null;
    setDraft(null);
  };

  // Click anywhere outside the corner while open → reset. Event-driven, bound only while open.
  useEffect(() => {
    if (!draft) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) reset();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft !== null]);

  const goTo = (s: Slot) => {
    if (draft) reset();
    if (s === "light") set(pair ? "custom" : "paper", pair);
    else set(s, pair);
  };

  return (
    <div ref={box}>
      <div style={topRight}>
        <button type="button" onClick={() => goTo(nextSlot(slot))} aria-label={`Theme: ${theme}`} style={iconButton}>
          <ThemeIcon theme={theme} />
        </button>
      </div>
      <div style={bottomRight}>
        {draft && (
          <ThemeForm
            initial={draft}
            onChange={(p) => {
              setDraft(p);
              previewPair(p);
            }}
          />
        )}
        <button
          type="button"
          className="quiet"
          onClick={() => (draft ? keep() : open())}
          aria-label={draft ? "Keep these colours" : "Choose two colours"}
          aria-expanded={draft !== null}
          style={iconButton}
        >
          <WavesIcon />
        </button>
      </div>
    </div>
  );
}
