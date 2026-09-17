import type { ListingDraft } from "@/lib/listing/schema";

/**
 * Dependency-free, best-effort extraction. Pulls out what patterns find
 * reliably (links, addresses, dates) and leaves the rest for the reviewer.
 * Everything guessed is named in `uncertain` so the review queue shows it.
 */
export type EmailInput = { subject: string; text: string; from: string };

export function extractListing(email: EmailInput): ListingDraft {
  const uncertain: string[] = [];
  const text = email.text;

  const role = cleanSubject(email.subject) || "Untitled opportunity";
  if (!cleanSubject(email.subject)) uncertain.push("role (no subject)");

  const original = findOriginalSender(text);
  const contactEmail = original?.email ?? firstEmail(text, email.from);
  const contactName = original?.name ?? null;
  if (!contactEmail) uncertain.push("contact email");

  const organization = orgFromEmail(contactEmail) ?? "Unknown organization";
  uncertain.push(organization === "Unknown organization" ? "organization" : "organization (guessed from email domain)");

  const applyUrl = firstUrl(text);
  if (!applyUrl) uncertain.push("apply URL");

  const deadline = findDeadline(text);
  if (!deadline) uncertain.push("deadline");

  uncertain.push("type", "programs", "location", "compensation", "summary");

  return {
    organization,
    role,
    type: null,
    programs: [],
    locationMode: null,
    location: null,
    compensation: null,
    deadline,
    applyUrl,
    contactEmail,
    contactName,
    summary: "",
    uncertain,
  };
}

function cleanSubject(s: string): string {
  return s.replace(/^(\s*(fwd?|fw|re|aw|wg)\s*:\s*)+/i, "").trim().slice(0, 120);
}

/** "From: Dana Whitfield <dw@si.edu>" inside a forwarded body. */
function findOriginalSender(text: string): { name: string | null; email: string } | null {
  const m = text.match(/^\s*(?:>\s*)?(?:from|von)\s*:\s*(.+)$/im);
  if (!m) return null;
  const line = m[1].trim();
  const addr = line.match(/<([^>]+@[^>]+)>/)?.[1] ?? line.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  if (!addr) return null;
  const name = line.replace(/<[^>]+>/, "").replace(/["']/g, "").trim();
  return { name: name && !name.includes("@") ? name : null, email: addr.toLowerCase() };
}

function firstEmail(text: string, exclude: string): string | null {
  const ex = exclude.toLowerCase();
  const all = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
  return all.map((a) => a.toLowerCase()).find((a) => !ex.includes(a)) ?? null;
}

function orgFromEmail(addr: string | null): string | null {
  if (!addr) return null;
  const domain = addr.split("@")[1] ?? "";
  const generic = /^(gmail|yahoo|outlook|hotmail|icloud|proton|me)\./i;
  if (!domain || generic.test(domain)) return null;
  const label = domain.split(".").slice(-2, -1)[0] ?? domain;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function firstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>()"']+/i);
  if (!m) return null;
  const url = m[0].replace(/[.,;:!?)]+$/, "");
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}

const MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec";

/** A date near "deadline" / "apply by" / "due" / "closes" wins; else null. */
function findDeadline(text: string): string | null {
  const window = text.match(new RegExp(`(?:deadline|apply by|due|closes?|until)[^.\\n]{0,60}`, "i"))?.[0];
  if (!window) return null;
  const y = new Date().getFullYear();
  let m = window.match(new RegExp(`(${MONTHS})[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`, "i"));
  if (m) return iso(m[3] ? +m[3] : y, monthIndex(m[1]), +m[2]);
  m = window.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (m) return iso(m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : y, +m[1] - 1, +m[2]);
  m = window.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

function monthIndex(s: string): number {
  return MONTHS.split("|").findIndex((mo) => s.toLowerCase().startsWith(mo.slice(0, 3)));
}

function iso(y: number, mIdx: number, d: number): string | null {
  if (mIdx < 0 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mIdx, d));
  if (dt < new Date(Date.UTC(y, 0, 1))) return null;
  return dt.toISOString().slice(0, 10);
}
