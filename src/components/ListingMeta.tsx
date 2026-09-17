import type { Listing } from "@/lib/listing/schema";
import { Tag } from "./Tag";

/** The row of facts under a listing title. Shared by card and detail page. */
export function ListingMeta({ listing }: { listing: Listing }) {
  const items = [
    listing.type,
    listing.locationMode,
    listing.location,
    listing.compensation,
    listing.deadline ? `due ${formatDate(listing.deadline)}` : "rolling",
  ].filter((x): x is string => Boolean(x));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
