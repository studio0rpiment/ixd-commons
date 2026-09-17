import { Suspense } from "react";
import type { Metadata } from "next";
import { cachedListings } from "@/lib/notion/cache";
import { ListingCard } from "@/components/ListingCard";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <>
      <h1>Opportunities</h1>
      <p className="muted">
        Reviewed by IxD faculty. Listings disappear on their deadline. For the university-wide
        board, see Handshake.
      </p>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Board />
      </Suspense>
    </>
  );
}

async function Board() {
  const listings = await cachedListings();
  if (listings.length === 0) {
    return <p className="muted">Nothing open right now. Check back soon.</p>;
  }
  return (
    <section>
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </section>
  );
}
