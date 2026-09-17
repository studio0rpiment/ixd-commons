import type { Metadata } from "next";
import { HANDSHAKE_URL } from "@/lib/links";

export const metadata: Metadata = { title: "Post an opportunity" };

/**
 * Employers submit through a Notion form that writes straight into the
 * listings database with status "Needs review" — the same queue the email
 * pipeline feeds. Set NEXT_PUBLIC_SUBMIT_FORM_URL to the form's public link.
 */
export default function SubmitPage() {
  const url = process.env.NEXT_PUBLIC_SUBMIT_FORM_URL;
  return (
    <>
      <h1>Post an opportunity</h1>
      <p>
        We list internships, jobs, freelance briefs, and research roles that fit GW Design
        students: graphic design, typography, branding, editorial and motion work, interfaces,
        prototyping, UX research, spatial and AR work, sound, physical computing, service
        design. Faculty review every listing before it goes up.
      </p>
      {url ? (
        <p>
          <a href={url}>Open the submission form ↗</a>
        </p>
      ) : (
        <p className="muted">Submission form link not configured yet.</p>
      )}
      <p className="muted small">
        For a formal posting visible to all GW students, also post on{" "}
        <a href={HANDSHAKE_URL}>Handshake</a>, the university&apos;s career platform.
      </p>
      <p className="muted small">
        Prefer email? Send the details to a GW Design faculty member and we&apos;ll add it for you.
      </p>
    </>
  );
}
