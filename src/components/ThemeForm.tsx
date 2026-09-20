"use client";

import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import type { CustomPair } from "@/lib/theme";

/** Two open pickers, no words. Every change is reported live; the caller decides keep or reset. */
export function ThemeForm({ initial, onChange }: { initial: CustomPair; onChange: (pair: CustomPair) => void }) {
  const [pair, setPair] = useState(initial);
  const update = (next: CustomPair) => {
    setPair(next);
    onChange(next);
  };
  return (
    <div style={{ display: "grid", gap: "0.35rem", padding: "0.35rem", border: "1px solid var(--line)", background: "var(--bg)" }}>
      <ColorPicker value={pair.bg} onChange={(bg) => update({ ...pair, bg })} />
      <ColorPicker value={pair.fg} onChange={(fg) => update({ ...pair, fg })} />
    </div>
  );
}
