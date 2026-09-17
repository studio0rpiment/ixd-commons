import { z } from "zod";

/** Our internal shape. Adapters below map provider payloads onto it. */
export const InboundEmail = z.object({
  from: z.string(),
  subject: z.string().default("(no subject)"),
  text: z.string(),
});
export type InboundEmail = z.infer<typeof InboundEmail>;

/** Postmark inbound webhook JSON. */
const Postmark = z.object({
  From: z.string(),
  Subject: z.string().optional(),
  TextBody: z.string().optional(),
  StrippedTextReply: z.string().optional(),
  HtmlBody: z.string().optional(),
});

/** Plain shape — what a Cloudflare Email Worker or a test script would send. */
const Generic = InboundEmail;

export function normalizeInbound(body: unknown): InboundEmail {
  const pm = Postmark.safeParse(body);
  if (pm.success) {
    const d = pm.data;
    return {
      from: d.From,
      subject: d.Subject ?? "(no subject)",
      text: d.TextBody || stripHtml(d.HtmlBody ?? ""),
    };
  }
  return Generic.parse(body);
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
