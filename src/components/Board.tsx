import { connection } from "next/server";
import { cachedListings } from "@/lib/notion/cache";
import { openFirst } from "@/lib/listing/closed";
import { ListingCard } from "./ListingCard";

/** The listings, open first and closed after. Render inside <Suspense>. */
export async function Board() {
  await connection(); // render per request so "today" is today, not build day
  const listings = openFirst(await cachedListings());
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
