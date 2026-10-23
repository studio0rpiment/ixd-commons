import { Suspense } from "react";
import { NavList } from "./NavList";
import { CurrentNav } from "./CurrentNav";

export function SiteHeader() {
  return (
    <header className="wrap" style={{ paddingBlock: "1.25rem 2rem" }}>
      <nav className="nav" style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "baseline" }}>
        {/* The current page is only known per request; the fallback is the same nav with nothing marked. */}
        <Suspense fallback={<NavList path={null} />}>
          <CurrentNav />
        </Suspense>
      </nav>
    </header>
  );
}
