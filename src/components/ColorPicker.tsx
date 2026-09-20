"use client";

import { useState, type PointerEvent } from "react";
import { hexToHsv, hsvToHex, type Hsv } from "@/lib/color";

/**
 * Saturation/value square with a hue bar along its bottom edge. Nothing else.
 * Pointer events only; no sliders, no fields.
 */
export function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));

  const commit = (next: Hsv) => {
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const drag = (handler: (x: number, y: number) => void) => (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const move = (ev: globalThis.PointerEvent) => {
      const r = el.getBoundingClientRect();
      handler(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)));
    };
    move(e.nativeEvent);
    el.setPointerCapture(e.pointerId);
    el.onpointermove = move;
    el.onpointerup = () => {
      el.onpointermove = null;
      el.onpointerup = null;
    };
  };

  const hue = `hsl(${hsv.h} 100% 50%)`;

  return (
    <div style={{ width: "8rem", border: "1px solid var(--line)" }}>
      <div
        role="slider"
        aria-label="saturation and brightness"
        aria-valuenow={Math.round(hsv.v * 100)}
        aria-valuetext={hsvToHex(hsv)}
        onPointerDown={drag((x, y) => commit({ ...hsv, s: x, v: 1 - y }))}
        style={{
          position: "relative",
          height: "6rem",
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hue})`,
          cursor: "crosshair",
          touchAction: "none",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            width: "0.5rem",
            height: "0.5rem",
            transform: "translate(-50%, -50%)",
            border: "1px solid #fff",
            outline: "1px solid #000",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        role="slider"
        aria-label="hue"
        aria-valuenow={Math.round(hsv.h)}
        onPointerDown={drag((x) => commit({ ...hsv, h: x * 360 }))}
        style={{
          position: "relative",
          height: "0.75rem",
          background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          cursor: "ew-resize",
          touchAction: "none",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${(hsv.h / 360) * 100}%`,
            top: 0,
            bottom: 0,
            width: "2px",
            transform: "translateX(-50%)",
            background: "#fff",
            outline: "1px solid #000",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
