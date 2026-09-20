"use client";

import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import type { CustomPair } from "@/lib/theme";

const plain: React.CSSProperties = {
  font: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  padding: 0,
  border: 0,
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
        justifyItems: "start",
        border: "1px solid var(--line)",
        background: "var(--bg)",
        color: "var(--fg)",
        fontSize: "0.75rem",
      }}
    >
      <Row label="color1" value={bg} onChange={setBg} />
      <Row label="color2" value={fg} onChange={setFg} />
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem" }}>
        <button type="submit" style={plain}>
          enter
        </button>
        <button type="button" onClick={onLight} style={{ ...plain, color: "var(--muted)" }}>
          light
        </button>
      </div>
    </form>
  );
}

/** Label text is inert; only the swatch opens the picker. */
function Row({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: "2px", justifyItems: "start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <span aria-hidden="true">{label}</span>
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{ width: "1.75rem", height: "1.25rem", padding: 0, border: "1px solid var(--line)", background: value, cursor: "pointer" }}
        />
      </div>
      {open && <ColorPicker value={value} onChange={onChange} />}
    </div>
  );
}
