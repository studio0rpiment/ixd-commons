import localFont from "next/font/local";

/**
 * IBM Plex Sans, self-hosted. Exposed as --font-sans; globals.css picks it up.
 * Weights present: 100, 200, 400, 700. Add a file + entry here to extend.
 */
export const plexSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./IBMPlexSans-Thin.woff2", weight: "100", style: "normal" },
    { path: "./IBMPlexSans-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "./IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./IBMPlexSans-Bold.woff2", weight: "700", style: "normal" },
  ],
});
