import { cacheLife, cacheTag } from "next/cache";
import { getPublishedListings, getListingBlocks, type Block } from "./listings";
import type { Listing } from "@/lib/listing/schema";

export const LISTINGS_TAG = "listings";

/**
 * Cached read of the board. Invalidated by /api/notion-webhook when Notion
 * reports a change, so publishing in Notion is what refreshes the site.
 * cacheLife("days") is only a safety net: if the webhook is ever misconfigured
 * the site still catches up once a day rather than never.
 */
export async function cachedListings(): Promise<Listing[]> {
  "use cache";
  cacheTag(LISTINGS_TAG);
  cacheLife("days");
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_LISTINGS_DS) {
    // Lets the site build and deploy before Notion is wired up. A present but
    // invalid token still fails loudly, which is what you want in CI.
    console.warn("[listings] Notion env not set; rendering an empty board");
    return [];
  }
  return getPublishedListings();
}

export async function cachedListingBlocks(pageId: string): Promise<Block[]> {
  "use cache";
  cacheTag(LISTINGS_TAG);
  cacheLife("days");
  if (!process.env.NOTION_TOKEN) return [];
  return getListingBlocks(pageId);
}
