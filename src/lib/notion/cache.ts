import { cacheLife, cacheTag } from "next/cache";
import { getPublishedListings, getListingBlocks, type Block } from "./listings";
import type { Listing } from "@/lib/listing/schema";

export const LISTINGS_TAG = "listings";

/**
 * Cached read of the board. Invalidated by /api/notion-webhook when Notion
 * reports a change, so publishing or unpublishing in Notion is what refreshes
 * the site. cacheLife("hours") is only a safety net: if a webhook delivery is
 * ever missed, a stale listing lingers at most an hour instead of a day.
 */
export async function cachedListings(): Promise<Listing[]> {
  "use cache";
  cacheTag(LISTINGS_TAG);
  cacheLife("hours");
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
  cacheLife("hours");
  if (!process.env.NOTION_TOKEN) return [];
  return getListingBlocks(pageId);
}
