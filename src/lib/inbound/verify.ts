/**
 * Who may feed the pipeline by email. The address is guessable, so this is the
 * only thing standing between the board and spam. Comma-separated in env:
 *   INBOUND_ALLOWLIST=kpatton@gwu.edu,colleague@gwu.edu
 * A bare domain entry ("@gwu.edu") allows everyone at that domain.
 */
export function isAllowedSender(from: string): boolean {
  const addr = extractAddress(from).toLowerCase();
  if (!addr) return false;
  const list = (process.env.INBOUND_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.some((rule) => (rule.startsWith("@") ? addr.endsWith(rule) : addr === rule));
}

/** Domain entries of the allowlist ("@gwu.edu" → "gwu.edu"), for the extractor to treat as "us". */
export function allowlistDomains(): string[] {
  return (process.env.INBOUND_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.startsWith("@"))
    .map((s) => s.slice(1));
}

/** "Kevin Patton <kp@gwu.edu>" → "kp@gwu.edu" */
export function extractAddress(from: string): string {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim();
}

/** Shared-secret check for the inbound webhook (set the same value in the mail provider). */
export function hasValidWebhookSecret(req: Request): boolean {
  const expected = process.env.INBOUND_WEBHOOK_SECRET;
  if (!expected) return false;
  const url = new URL(req.url);
  const given = req.headers.get("x-webhook-secret") ?? url.searchParams.get("secret");
  return given === expected;
}
