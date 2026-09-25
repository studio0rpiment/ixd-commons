import type { Metadata } from "next";
import { AlumniForm } from "@/components/form/AlumniForm";

// Shared by direct link only: not in the nav, not indexed.
export const metadata: Metadata = {
  title: "Alumni catch-up",
  robots: { index: false, follow: false },
};

export default function AlumniCatchupPage() {
  return (
    <>
      <h1>What are you up to?</h1>
      <p>
        We&apos;d love to hear where GW Design has taken you — the work, the path, what stuck. Your answers
        help current students see where this can lead, and help us shape the program. It takes about five
        minutes, and most questions are optional.
      </p>
      <AlumniForm />
    </>
  );
}
