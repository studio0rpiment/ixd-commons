# GW Design Commons

Opportunities board and advising portal for the Interaction Design program at the
Corcoran School, George Washington University. Notion is the back office; this site
is the public face.

## How it works

```
employer email ─▶ faculty forwards ─▶ /api/inbound ─▶ Claude extracts ─▶ Notion (Needs review)
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
src/lib/extract/     fromEmail.ts — Claude tool-use extraction into ListingDraft
src/lib/inbound/     normalize (provider payload → InboundEmail), verify (allowlist, secret)
src/app/api/         inbound/ and notion-webhook/ route handlers
src/app/             pages: /, /opportunities, /opportunities/[slug], /advising, /submit
src/components/      Tag, ListingMeta, ListingCard, SiteHeader
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
6. Point a mail provider's inbound webhook at `/api/inbound` with the shared secret:
   - Postmark inbound: JSON payload handled as-is.
   - Cloudflare Email Routing → Worker: forward `{from, subject, text}` (see `normalize.ts`).
7. Register the Notion webhook per `docs/notion-schema.md`.

## Decisions

- **Notion as CMS, not a custom admin.** Colleagues add and review listings without accounts here.
- **Human in the loop.** Nothing publishes without a status flip; extraction only drafts.
- **Sender allowlist on inbound.** The address is guessable; the allowlist is the gate.
- **Expiry is computed at read time** from Deadline, so nobody has to archive by hand.
- **rem everywhere**, tokens on `:root`, dark mode via `prefers-color-scheme`.

## Not yet

- Advising content (second Notion database, same pattern).
- Attachment handling (PDF flyers) in the extractor.
- Duplicate detection (apply URL / org+role) before creating a draft.
- Reply-to-forwarder with the Notion link (needs an outbound mail provider).
