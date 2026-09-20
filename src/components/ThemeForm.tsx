"use client";

import { useState } from "react";
import type { CustomPair } from "@/lib/theme";

const square: React.CSSProperties = {
  font: "inherit",
  fontSize: "var(--step--1)",
  padding: "0.25rem 0.5rem",
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--fg)",
  cursor: "pointer",
};

/** The simplest possible two-colour form. Enter installs; the other button restores paper. */
export function ThemeForm({
  initial,
  onEnter,
  onLight,
}: {
  initial: CustomPair;
  onEnter: (pair: CustomPair) => void;
  onLight: () => void;
}) {
  const [bg, setBg] = useState(initial.bg);
  const [fg, setFg] = useState(initial.fg);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onEnter({ bg, fg });
      }}
      style={{
        display: "grid",
        gap: "0.35rem",
        padding: "0.5rem",
        width: "9rem",
        border: "1px solid var(--line)",
        background: "var(--bg)",
        color: "var(--fg)",
        fontSize: "0.75rem",
      }}
    >
      <Row label="Color 1" id="theme-bg" value={bg} onChange={setBg} />
      <Row label="Color 2" id="theme-fg" value={fg} onChange={setFg} />
      <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.15rem" }}>
        <button type="submit" style={{ ...square, background: "var(--fg)", color: "var(--bg)" }}>
          Enter
        </button>
        <button type="button" onClick={onLight} style={square}>
          light theme
        </button>
      </div>
    </form>
  );
}

/** Label text is inert; only the swatch opens the picker. */
function Row({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
      <span aria-hidden="true">{label}</span>
      <input
        type="color"
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "1.75rem", height: "1.25rem", padding: 0, border: "1px solid var(--line)", background: "transparent", cursor: "pointer" }}
      />
    </div>
  );
}
