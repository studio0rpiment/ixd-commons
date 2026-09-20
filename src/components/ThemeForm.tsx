"use client";

import { useState } from "react";
import type { CustomPair } from "@/lib/theme";

const square: React.CSSProperties = {
  font: "inherit",
  fontSize: "var(--step--1)",
  padding: "0.4rem 0.7rem",
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
        gap: "0.5rem",
        padding: "0.75rem",
        border: "1px solid var(--line)",
        background: "var(--bg)",
        color: "var(--fg)",
        fontSize: "var(--step--1)",
      }}
    >
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        Color 1
        <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: "2.5rem", height: "1.75rem", padding: 0, border: "1px solid var(--line)", background: "transparent" }} />
      </label>
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        Color 2
        <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} style={{ width: "2.5rem", height: "1.75rem", padding: 0, border: "1px solid var(--line)", background: "transparent" }} />
      </label>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
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
