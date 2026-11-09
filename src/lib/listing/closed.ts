import type { Listing } from "./schema";

/**
 * Closed = marked Expired in Notion, or past its deadline as of now. No event
 * fires when a date passes, so this is computed per request.
 */
export function isClosed(l: Listing, today = new Date().toISOString().slice(0, 10)): boolean {
  return l.status === "Expired" || (l.deadline != null && l.deadline < today);
}

/** Open listings first, closed ones after; each group keeps its newest-first order. */
export function openFirst(listings: Listing[], today?: string): Listing[] {
  const closed = listings.filter((l) => isClosed(l, today));
  return [...listings.filter((l) => !isClosed(l, today)), ...closed];
}
