import { Resend } from "resend";
import { stripHtml, type InboundEmail } from "./normalize";

/**
 * Resend inbound: the webhook is signed (Svix headers) and carries metadata
 * only; the body is fetched with a second call. Needs RESEND_API_KEY and
 * RESEND_WEBHOOK_SECRET (the "whsec_…" signing secret shown on the webhook).
 */
export function isResendRequest(req: Request): boolean {
  return req.headers.has("svix-id") && req.headers.has("svix-signature");
}

export async function resendToInbound(rawBody: string, headers: Headers): Promise<InboundEmail | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) throw new Error("RESEND_API_KEY / RESEND_WEBHOOK_SECRET not set");

  const resend = new Resend(apiKey);
  // Throws on a bad signature — the caller turns that into a 401.
  const event = resend.webhooks.verify({ payload: rawBody, headers, webhookSecret });
  if (event.type !== "email.received") return null;

  const { data, error } = await resend.emails.receiving.get(event.data.email_id);
  if (error || !data) throw new Error(`Resend receiving.get failed: ${error?.message ?? "no data"}`);

  return {
    from: data.from,
    subject: data.subject || "(no subject)",
    text: data.text || stripHtml(data.html ?? ""),
  };
}

