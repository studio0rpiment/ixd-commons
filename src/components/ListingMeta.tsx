import type { Listing } from "@/lib/listing/schema";
import { isClosed } from "@/lib/listing/closed";
import { formatPlace } from "@/lib/listing/place";
import { Tag } from "./Tag";

/** The row of facts under a listing title. Shared by card and detail page. */
export function ListingMeta({ listing }: { listing: Listing }) {
  const items = [
    ...listing.programs,
    listing.type,
    listing.locationMode,
    formatPlace(listing.location),
    listing.compensation,
    deadlineTag(listing),
  ].filter((x): x is string => Boolean(x));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

function deadlineTag(l: Listing): string {
  if (isClosed(l)) return l.deadline ? `closed ${formatDate(l.deadline)}` : "closed";
  return l.deadline ? `due ${formatDate(l.deadline)}` : "rolling";
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
