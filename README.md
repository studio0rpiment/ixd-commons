# GW Design Commons

Opportunities board and advising portal for GW Design — the Graphic Design and
Interaction Design programs at the Corcoran School, George Washington University. Notion is the back office; this site
is the public face.

## How it works

```
employer email ─▶ faculty forwards ─▶ /api/inbound ─▶ pattern extract ─▶ Notion (Needs review)
employer form  ─────────────────────────────────────────────────────▶ Notion (Needs review)
                                                                          │
                                          faculty flips Status → Published │
                                                                          ▼
                                     Notion webhook ─▶ /api/notion-webhook ─▶ cache dropped ─▶ site updates
```

Event-driven end to end. The only timer is a one-day `cacheLife` safety net in
`src/lib/notion/cache.ts`, there in case the webhook is ever misconfigured.

## Layout

```
src/lib/listing/     schema.ts — the one zod shape every listing passes through; slug.ts
src/lib/notion/      client, properties (column names), read/write helpers, listings (queries), cache
src/lib/extract/     fromEmail.ts — dependency-free pattern extraction (links, emails, dates) into ListingDraft
src/lib/inbound/     normalize (provider payload → InboundEmail), verify (allowlist, secret)
src/app/api/         inbound/ and notion-webhook/ route handlers
src/app/             pages: /, /opportunities, /opportunities/[slug], /advising, /submit
src/components/      Tag, ListingMeta, ListingCard, SiteHeader, NotionBlocks + RichText (page body → HTML)
docs/notion-schema.md  the database to create in Notion
scripts/             send-test-email.ts
```

## Setup

1. Create the Notion database per `docs/notion-schema.md`; connect an internal integration
   with read/write; copy its data source id.
2. `cp .env.example .env.local` and fill it in.
3. `pnpm install && pnpm dev`
4. In another shell: `pnpm tsx scripts/send-test-email.ts` — a draft should appear in Notion.
5. Deploy (Vercel is the path of least resistance for App Router + route handlers).
6. Point a mail provider at `/api/inbound`:
   - **Resend inbound (preferred):** Receiving → create a `*.resend.app` address (or MX on your domain);
     Webhooks → add `https://<site>/api/inbound`, event `email.received`; copy its signing secret to
     `RESEND_WEBHOOK_SECRET`. Signed, no query secret needed.
   - Postmark inbound: JSON payload handled as-is; add `?secret=<INBOUND_WEBHOOK_SECRET>` to the URL.
   - Cloudflare Email Routing → Worker: POST `{from, subject, text}` with the shared secret.
7. Register the Notion webhook per `docs/notion-schema.md`.

## Decisions

- **Notion as CMS, not a custom admin.** Colleagues add and review listings without accounts here.
- **Human in the loop, no model.** Forwarding creates a row with the original email attached and the
  mechanical fields (link, contact, deadline) filled; the reviewer writes org/role/summary in Notion.
- **Sender allowlist on inbound.** The address is guessable; the allowlist is the gate.
- **Expiry is computed at read time** from Deadline, so nobody has to archive by hand.
- **rem everywhere**, tokens on `:root`, dark mode via `prefers-color-scheme`.

## Not yet

- Advising content (second Notion database, same pattern).
- Attachment handling (PDF flyers) in the extractor.
- Duplicate detection (apply URL / org+role) before creating a draft.
- Reply-to-forwarder with the Notion link (needs an outbound mail provider).
