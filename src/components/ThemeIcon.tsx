import type { Theme } from "@/lib/theme";

const common = {
  width: "1.25rem",
  height: "1.25rem",
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Outline glyph for a theme: moon (mono), sun (paper), bolt (custom), blue moon (rfc). */
export function ThemeIcon({ theme }: { theme: Theme }) {
  switch (theme) {
    case "paper":
      return (
        <svg {...common} stroke="currentColor">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "custom":
      return (
        <svg {...common} stroke="currentColor">
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    default:
      return (
        <svg {...common} stroke={theme === "rfc" ? "var(--accent)" : "currentColor"}>
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        </svg>
      );
  }
}

/** Three wavy lines. */
export function WavesIcon() {
  return (
    <svg {...common} stroke="currentColor">
      <path d="M3 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}
