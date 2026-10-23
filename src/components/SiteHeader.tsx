import Link from "next/link";

/** The site's sections. The blurbs explain each one on the homepage. */
export const sections = [
  {
    href: "/opportunities",
    label: "Opportunities",
    blurb: "Internships, jobs, and research roles, checked by faculty before they go up.",
  },
  {
    href: "/advising",
    label: "Advising",
    blurb: "Degree paths, thesis timelines, and portfolio expectations. Coming soon.",
  },
  {
    href: "/submit",
    label: "Post an opportunity",
    blurb: "For employers: tell us about a role and we'll review it within a few days.",
  },
];

export function SiteHeader() {
  return (
    <header className="wrap" style={{ paddingBlock: "1.25rem 2rem" }}>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "baseline" }}>
        <Link href="/" style={{ fontWeight: 600, textDecoration: "none" }}>
          GW Design Commons
        </Link>
        {sections.map((n) => (
          <Link key={n.href} href={n.href} className="muted" style={{ textDecoration: "none" }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
