import type { Theme } from "@/lib/theme";

/** Outline glyph for the current theme: sun for paper, moon for mono, blue moon for rfc. */
export function ThemeIcon({ theme }: { theme: Theme }) {
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
  if (theme === "paper") {
    return (
      <svg {...common} stroke="currentColor">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  return (
    <svg {...common} stroke={theme === "rfc" ? "var(--accent)" : "currentColor"}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}
