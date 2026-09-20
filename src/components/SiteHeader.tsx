import Link from "next/link";

const nav = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/advising", label: "Advising" },
  { href: "/submit", label: "Post an opportunity" },
];

export function SiteHeader() {
  return (
    <header className="wrap" style={{ paddingBlock: "1.25rem 2rem" }}>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "baseline" }}>
        <Link href="/" style={{ fontWeight: 600, textDecoration: "none" }}>
          GW Design Commons
        </Link>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="muted" style={{ textDecoration: "none" }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
