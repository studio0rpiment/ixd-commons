import Link from "next/link";
import { sections } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <h1>For GW Design Students</h1>
      <p style={{ fontSize: "var(--step-1)", maxWidth: "36rem" }}>
        A hand-picked board of internships, jobs, and research roles for Graphic Design and
        Interaction Design students at GW, plus the advising notes we keep repeating in office
        hours.
      </p>
      <dl style={{ marginTop: "2.5rem" }}>
        {sections.map((s) => (
          <div key={s.href} style={{ paddingBlock: "1rem", borderTop: "1px solid var(--line)" }}>
            <dt style={{ fontWeight: 700 }}>
              <Link href={s.href}>{s.label}</Link>
            </dt>
            <dd className="muted" style={{ margin: "0.25rem 0 0" }}>
              {s.blurb}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
