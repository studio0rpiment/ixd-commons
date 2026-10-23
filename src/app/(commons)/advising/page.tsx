import type { Metadata } from "next";

export const metadata: Metadata = { title: "Advising" };

/**
 * Program-level advising only (paths, timelines, portfolio expectations).
 * Nothing student-specific lives here. Content will come from a Notion
 * "Advising" database in the same way listings do.
 */
export default function AdvisingPage() {
  return (
    <>
      <h1>Advising</h1>
      <p className="muted">Coming soon: degree paths for Graphic Design and Interaction Design, thesis timelines,
        portfolio expectations.</p>
    </>
  );
}
