import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cachedListings } from "@/lib/notion/cache";
import { ListingMeta } from "@/components/ListingMeta";

type Params = Promise<{ slug: string }>;

export default function ListingPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Params }) {
  const { slug } = await params;
  const listing = (await cachedListings()).find((l) => l.slug === slug);
  if (!listing) notFound();

  return (
    <article>
      <p className="small">
        <Link href="/opportunities">← All opportunities</Link>
      </p>
      <h1>{listing.role}</h1>
      <p style={{ fontSize: "var(--step-1)", margin: 0 }}>{listing.organization}</p>
      <ListingMeta listing={listing} />
      <p style={{ marginTop: "1.5rem" }}>{listing.summary}</p>

      <h2>How to apply</h2>
      {listing.applyUrl ? (
        <p>
          <a href={listing.applyUrl} rel="noopener noreferrer" target="_blank">
            Apply at {new URL(listing.applyUrl).hostname} ↗
          </a>
        </p>
      ) : listing.contactEmail ? (
        <p>
          Email {listing.contactName ?? "the contact"} at{" "}
          <a href={`mailto:${listing.contactEmail}`}>{listing.contactEmail}</a>.
        </p>
      ) : (
        <p className="muted">Ask IxD faculty for the contact.</p>
      )}
    </article>
  );
}
