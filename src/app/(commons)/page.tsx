import { Suspense } from "react";
import { Board } from "@/components/Board";
import { HANDSHAKE_URL } from "@/lib/links";

export default function Home() {
  return (
    <>
      <h1>For Student Designers at the Corcoran School of the Arts and Design @ GWU</h1>
      <p style={{ fontSize: "var(--step-1)", maxWidth: "36rem" }}>
        A hand-picked board of internships, jobs, and research roles for Graphic Design and
        Interaction Design students at GW.
      </p>
      <p className="muted">
        Reviewed by GW Design faculty. Closed listings stay up, dimmed. For the university-wide
        board, see <a href={HANDSHAKE_URL}>Handshake</a>.
      </p>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Board />
      </Suspense>
    </>
  );
}
