import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Design at GW, and where it goes next.</h1>
      <p style={{ fontSize: "var(--step-1)", maxWidth: "36rem" }}>
        A hand-picked board of internships, jobs, and research roles for Graphic Design and
        Interaction Design students at GW, plus the advising notes we keep repeating in office
        hours.
      </p>
      <p>
        <Link href="/opportunities">See current opportunities →</Link>
      </p>
      <p className="muted small">
        Hiring? <Link href="/submit">Post an opportunity</Link> and we&apos;ll review it within a
        few days.
      </p>
    </>
  );
}
