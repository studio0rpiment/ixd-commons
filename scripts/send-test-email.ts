/**
 * Exercise /api/inbound locally without a mail provider.
 *   pnpm dev
 *   pnpm tsx scripts/send-test-email.ts
 * Requires INBOUND_WEBHOOK_SECRET, INBOUND_ALLOWLIST, NOTION_*, ANTHROPIC_API_KEY in .env.local.
 */
export {};

const base = process.env.BASE_URL ?? "http://localhost:3000";
const secret = process.env.INBOUND_WEBHOOK_SECRET ?? "";
const from = process.env.TEST_FROM ?? "Kevin Patton <kpatton@gwu.edu>";

const sample = {
  from,
  subject: "Fwd: Summer UX research intern — Smithsonian Digital",
  text: `FYI, this looks like a good fit for our second-years.

---------- Forwarded message ---------
From: Dana Whitfield <dwhitfield@si.edu>
Date: Tue, Sep 15, 2026
Subject: Summer UX research intern

Hi Kevin,

We're hiring a paid summer intern (10 weeks, $22/hr, hybrid in DC, 3 days on site)
to run usability sessions on our new collections explorer and help prototype the
next round in Figma. Deadline is October 30. Details and application here:
https://www.si.edu/careers/ux-intern-2027

Happy to talk with any of your students.

Dana`,
};

const res = await fetch(`${base}/api/inbound`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-webhook-secret": secret },
  body: JSON.stringify(sample),
});
console.log(res.status, await res.json());
