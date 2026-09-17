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
  Program,
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
    status: read.select(p, P.status) ?? "Needs review",
    source: read.select(p, P.source) ?? "faculty",
    publishedAt: read.date(p, P.publishedAt),
    organization,
    role,
    type: read.select(p, P.type),
    programs: read.multiSelect(p, P.programs).filter((n): n is Program => Program.safeParse(n).success),
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
        { property: P.status, select: { equals: "Published" satisfies ListingStatus } },
        {
          or: [
            { property: P.deadline, date: { is_empty: true } },
            { property: P.deadline, date: { on_or_after: today } },
          ],
        },
      ],
    },
    sorts: [
      { property: P.publishedAt, direction: "descending" },
      { timestamp: "created_time", direction: "descending" },
    ],
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
      [P.programs]: write.multiSelect(draft.programs),
      [P.locationMode]: write.select(draft.locationMode satisfies LocationMode | null),
      [P.location]: write.text(draft.location),
      [P.compensation]: write.text(draft.compensation),
      [P.deadline]: write.date(draft.deadline),
      [P.applyUrl]: write.url(draft.applyUrl),
      [P.contactEmail]: write.email(draft.contactEmail),
      [P.contactName]: write.text(draft.contactName),
      [P.summary]: write.text(draft.summary),
      [P.uncertain]: write.text(draft.uncertain.join("; ") || null),
      [P.status]: write.select("Needs review" satisfies ListingStatus),
      [P.source]: write.select(meta.source),
      [P.slug]: write.text(slugify(draft.organization, draft.role)),
      [P.forwardedBy]: write.email(meta.forwardedBy),
    }),
    children: [
      ...chunk(draft.description).map(paragraph),
      ...(meta.rawBody
        ? [
            {
              object: "block" as const,
              type: "toggle" as const,
              toggle: {
                rich_text: [{ type: "text" as const, text: { content: "Original message" } }],
                children: chunk(meta.rawBody).map(paragraph),
              },
            },
          ]
        : []),
    ],
  });
  const url = "url" in page ? page.url : `https://notion.so/${page.id.replace(/-/g, "")}`;
  return { id: page.id, url };
}

/** Notion caps a rich_text segment at 2000 chars; split on paragraph breaks where possible. */
function chunk(s: string, n = 1900): string[] {
  const out: string[] = [];
  for (const para of s.split(/\n{2,}/)) {
    for (let i = 0; i < para.length && out.length < 90; i += n) out.push(para.slice(i, i + n));
  }
  return out.filter((c) => c.trim());
}

function paragraph(text: string) {
  return {
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: { rich_text: [{ type: "text" as const, text: { content: text } }] },
  };
}

/** Page body blocks for the detail page, stopping at the "Original message" toggle. */
export async function getListingBlocks(pageId: string): Promise<Block[]> {
  const res = await notion().blocks.children.list({ block_id: pageId, page_size: 100 });
  const out: Block[] = [];
  for (const b of res.results as Block[]) {
    if (b.type === "toggle") continue;
    out.push(b);
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Block = { id: string; type: string } & Record<string, any>;

/** Set "Published at" = today when Status is Published and the date is empty. Idempotent. */
export async function stampPublishedAt(pageId: string): Promise<void> {
  const page = (await notion().pages.retrieve({ page_id: pageId })) as Page;
  if (read.select(page.properties, P.status) !== "Published") return;
  if (read.date(page.properties, P.publishedAt)) return;
  await notion().pages.update({
    page_id: pageId,
    properties: { [P.publishedAt]: write.date(new Date().toISOString().slice(0, 10))! },
  });
}
