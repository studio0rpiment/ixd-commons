import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cachedListings, cachedListingBlocks } from "@/lib/notion/cache";
import { live } from "@/lib/notion/listings";
import { NotionBlocks } from "@/components/NotionBlocks";
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
  await connection();
  const listing = live(await cachedListings()).find((l) => l.slug === slug);
  if (!listing) notFound();
  const blocks = await cachedListingBlocks(listing.id);

  return (
    <article>
      <p className="small">
        <Link href="/opportunities">← All opportunities</Link>
      </p>
      <h1>{listing.role}</h1>
      <p style={{ fontSize: "var(--step-1)", margin: 0 }}>{listing.organization}</p>
      <ListingMeta listing={listing} />
      <p style={{ marginTop: "1.5rem" }}>{listing.summary}</p>

      {blocks.length > 0 && (
        <section style={{ marginTop: "1.5rem" }}>
          <NotionBlocks blocks={blocks} />
        </section>
      )}

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
        <p className="muted">Ask GW Design faculty for the contact.</p>
      )}
    </article>
  );
}
