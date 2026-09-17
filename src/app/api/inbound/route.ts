import { NextResponse } from "next/server";
import { normalizeInbound, type InboundEmail } from "@/lib/inbound/normalize";
import { isResendRequest, resendToInbound } from "@/lib/inbound/resend";
import { extractAddress, hasValidWebhookSecret, isAllowedSender } from "@/lib/inbound/verify";
import { extractListing } from "@/lib/extract/fromEmail";
import { createDraftListing } from "@/lib/notion/listings";

export const maxDuration = 60;

/**
 * POST /api/inbound — the "forward an email, get a draft listing" endpoint.
 *
 * Two ways in:
 *  - Resend inbound: signed webhook (Svix headers), body fetched by id.
 *  - Anything else (Postmark, a Cloudflare Email Worker, the test script):
 *    shared secret via x-webhook-secret header or ?secret=.
 *
 * Then: sender allowlist → pattern extraction (no model) → Notion draft (Needs review).
 * Returns 200 once the request is recognised so the provider does not retry;
 * the outcome is in the JSON body and the server log.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let email: InboundEmail;

  try {
    if (isResendRequest(req)) {
      const parsed = await resendToInbound(raw, req.headers);
      if (!parsed) return NextResponse.json({ ok: true, ignored: "not an email.received event" });
      email = parsed;
    } else {
      if (!hasValidWebhookSecret(req)) {
        return NextResponse.json({ ok: false, reason: "bad secret" }, { status: 401 });
      }
      email = normalizeInbound(JSON.parse(raw));
    }
  } catch (e) {
    console.warn("[inbound] rejected request", e);
    return NextResponse.json({ ok: false, reason: "unrecognised or unverified payload", detail: String(e) }, { status: 401 });
  }

  if (!isAllowedSender(email.from)) {
    console.warn("[inbound] rejected sender", email.from);
    return NextResponse.json({ ok: false, reason: "sender not allowed" });
  }

  try {
    const draft = extractListing(email);
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
