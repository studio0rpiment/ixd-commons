import Link from "next/link";
import { sections } from "@/lib/sections";

const isCurrent = (href: string, path: string | null) =>
  path != null && (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

/** The nav's links. Whichever matches `path` is marked current, and the bold follows it. */
export function NavList({ path }: { path: string | null }) {
  const link = (href: string, label: string, className?: string) => (
    <Link key={href} href={href} className={className} aria-current={isCurrent(href, path) ? "page" : undefined}>
      {label}
    </Link>
  );
  return (
    <>
      {link("/", "GW Design Commons", "brand")}
      {sections.map((s) => link(s.href, s.label))}
    </>
  );
}
