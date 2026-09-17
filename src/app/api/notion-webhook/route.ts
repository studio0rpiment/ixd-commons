import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { LISTINGS_TAG } from "@/lib/notion/cache";

/**
 * POST /api/notion-webhook — Notion calls this when a page in the listings
 * database changes (e.g. status flipped to Published). We drop the cached
 * listings so the next request re-reads Notion. Event-driven: no polling.
 *
 * Notion webhook setup sends a one-time `verification_token`; we log it so it
 * can be pasted back into the Notion integration settings.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (typeof body.verification_token === "string") {
    console.info("[notion-webhook] verification token:", body.verification_token);
    return NextResponse.json({ ok: true });
  }

  const expected = process.env.NOTION_WEBHOOK_SECRET;
  const given = req.headers.get("x-webhook-secret") ?? new URL(req.url).searchParams.get("secret");
  if (expected && given !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag(LISTINGS_TAG, "max");
  return NextResponse.json({ ok: true, revalidated: LISTINGS_TAG });
}
