import { notion, listingsDataSource } from "./client";
import { P } from "./properties";
import { read } from "./read";
import { write, props } from "./write";
import {
  Listing,
  ListingDraft,
  ListingStatus,
  ListingType,
  LocationMode,
  Source,
} from "@/lib/listing/schema";
import { slugify } from "@/lib/listing/slug";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Page = { id: string; properties: Record<string, any> };

function toListing(page: Page): Listing | null {
  const p = page.properties;
  const role = read.title(p, P.role);
  const organization = read.text(p, P.organization);
  if (!role || !organization) return null;

  const parsed = Listing.safeParse({
    id: page.id,
    slug: read.text(p, P.slug) ?? slugify(organization, role),
    status: read.status(p, P.status) ?? "Needs review",
    source: read.select(p, P.source) ?? "faculty",
    publishedAt: read.date(p, P.publishedAt),
    organization,
    role,
    type: read.select(p, P.type),
    locationMode: read.select(p, P.locationMode),
    location: read.text(p, P.location),
    compensation: read.text(p, P.compensation),
    deadline: read.date(p, P.deadline),
    applyUrl: read.url(p, P.applyUrl),
    contactEmail: read.email(p, P.contactEmail),
    contactName: read.text(p, P.contactName),
    summary: read.text(p, P.summary) ?? "",
    uncertain: [],
  });
  return parsed.success ? parsed.data : null;
}

/** Published listings, newest first. Expiry is enforced here, not in Notion. */
export async function getPublishedListings(): Promise<Listing[]> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await notion().dataSources.query({
    data_source_id: listingsDataSource(),
    filter: {
      and: [
        { property: P.status, status: { equals: "Published" satisfies ListingStatus } },
        {
          or: [
            { property: P.deadline, date: { is_empty: true } },
            { property: P.deadline, date: { on_or_after: today } },
          ],
        },
      ],
    },
    sorts: [{ property: P.publishedAt, direction: "descending" }],
  });
  return res.results.map((r) => toListing(r as Page)).filter((l): l is Listing => l !== null);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const all = await getPublishedListings();
  return all.find((l) => l.slug === slug) ?? null;
}

/** Create a Needs-review row. The original email body goes in the page content. */
export async function createDraftListing(
  draft: ListingDraft,
  meta: { source: Source; forwardedBy: string | null; rawBody: string | null },
): Promise<{ id: string; url: string }> {
  const page = await notion().pages.create({
    parent: { data_source_id: listingsDataSource() },
    properties: props({
      [P.role]: write.title(draft.role),
      [P.organization]: write.text(draft.organization),
      [P.type]: write.select(draft.type satisfies ListingType | null),
      [P.locationMode]: write.select(draft.locationMode satisfies LocationMode | null),
      [P.location]: write.text(draft.location),
      [P.compensation]: write.text(draft.compensation),
      [P.deadline]: write.date(draft.deadline),
      [P.applyUrl]: write.url(draft.applyUrl),
      [P.contactEmail]: write.email(draft.contactEmail),
      [P.contactName]: write.text(draft.contactName),
      [P.summary]: write.text(draft.summary),
      [P.uncertain]: write.text(draft.uncertain.join("; ") || null),
      [P.status]: write.status("Needs review" satisfies ListingStatus),
      [P.source]: write.select(meta.source),
      [P.slug]: write.text(slugify(draft.organization, draft.role)),
      [P.forwardedBy]: write.email(meta.forwardedBy),
    }),
    children: meta.rawBody
      ? [
          {
            object: "block",
            type: "heading_3",
            heading_3: { rich_text: [{ type: "text", text: { content: "Original message" } }] },
          },
          ...chunk(meta.rawBody).map((c) => ({
            object: "block" as const,
            type: "paragraph" as const,
            paragraph: { rich_text: [{ type: "text" as const, text: { content: c } }] },
          })),
        ]
      : [],
  });
  const url = "url" in page ? page.url : `https://notion.so/${page.id.replace(/-/g, "")}`;
  return { id: page.id, url };
}

/** Notion caps a rich_text segment at 2000 chars. */
function chunk(s: string, n = 1900): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length && out.length < 50; i += n) out.push(s.slice(i, i + n));
  return out;
}
