import type { Metadata } from "next";
import { HANDSHAKE_URL } from "@/lib/links";
import { SubmitForm } from "@/components/form/SubmitForm";

export const metadata: Metadata = { title: "Post an opportunity" };

export default function SubmitPage() {
  return (
    <>
      <h1>Post an opportunity</h1>
      <p>
        We list internships, jobs, freelance briefs, and research roles that fit GW Design students:
        graphic design, typography, branding, editorial and motion work, interfaces, prototyping, UX
        research, spatial and AR work, sound, physical computing, service design. Faculty review every
        listing before it goes up.
      </p>
      <p className="muted small">
        For a formal posting visible to all GW students, also post on{" "}
        <a href={HANDSHAKE_URL}>Handshake</a>, the university&apos;s career platform.
      </p>
      <SubmitForm />
    </>
  );
}
