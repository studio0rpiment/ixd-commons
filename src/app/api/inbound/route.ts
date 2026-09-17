import { NextResponse } from "next/server";
import { normalizeInbound } from "@/lib/inbound/normalize";
import { extractAddress, hasValidWebhookSecret, isAllowedSender } from "@/lib/inbound/verify";
import { extractListing } from "@/lib/extract/fromEmail";
import { createDraftListing } from "@/lib/notion/listings";

export const maxDuration = 60;

/**
 * POST /api/inbound — the "forward an email, get a draft listing" endpoint.
 *
 * Mail provider (Postmark / Cloudflare Email Worker / Resend) POSTs the message
 * here. Flow: secret → sender allowlist → extract with Claude → Notion draft.
 * Always returns 200 to a recognised provider so it does not retry forever;
 * the outcome is in the JSON body and in the server log.
 */
export async function POST(req: Request) {
  if (!hasValidWebhookSecret(req)) {
    return NextResponse.json({ ok: false, reason: "bad secret" }, { status: 401 });
  }

  let email;
  try {
    email = normalizeInbound(await req.json());
  } catch (e) {
    return NextResponse.json({ ok: false, reason: "unrecognised payload", detail: String(e) }, { status: 400 });
  }

  if (!isAllowedSender(email.from)) {
    console.warn("[inbound] rejected sender", email.from);
    return NextResponse.json({ ok: false, reason: "sender not allowed" });
  }

  try {
    const draft = await extractListing(email);
    const page = await createDraftListing(draft, {
      source: "email",
      forwardedBy: extractAddress(email.from),
      rawBody: `Subject: ${email.subject}\nFrom: ${email.from}\n\n${email.text}`,
    });
    console.info("[inbound] draft created", page.url);
    return NextResponse.json({ ok: true, notionUrl: page.url, draft });
  } catch (e) {
    console.error("[inbound] failed", e);
    return NextResponse.json({ ok: false, reason: "pipeline error", detail: String(e) });
  }
}
