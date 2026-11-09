import Link from "next/link";
import type { Listing } from "@/lib/listing/schema";
import { ListingMeta } from "./ListingMeta";
import { isClosed } from "@/lib/listing/closed";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article
      style={{
        padding: "1rem 0",
        borderBottom: "1px solid var(--line)",
        opacity: isClosed(listing) ? 0.5 : 1, // closed listings stay up, dimmed
      }}
    >
      <h3 style={{ margin: 0, fontSize: "var(--step-1)", lineHeight: 1.2 }}>
        <Link href={`/opportunities/${listing.slug}`}>
          {listing.role}
        </Link>
      </h3>
      <div className="muted">{listing.organization}</div>
      <ListingMeta listing={listing} />
      {listing.summary && <p style={{ margin: "0.6rem 0 0" }}>{listing.summary}</p>}
    </article>
  );
}
