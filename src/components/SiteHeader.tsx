import Link from "next/link";

/** One page for now: the header is just the site title. /advising and /submit still work, unlisted. */
export function SiteHeader() {
  return (
    <header className="wrap" style={{ paddingBlock: "1.25rem 2rem" }}>
      <nav className="nav">
        <Link href="/" className="brand">
          Corcoran Design Commons
        </Link>
      </nav>
    </header>
  );
}
