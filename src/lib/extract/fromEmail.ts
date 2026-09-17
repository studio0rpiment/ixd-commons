import type { ListingDraft } from "@/lib/listing/schema";
import { splitForward, cleanSubject, type Author } from "./forward";

/**
 * Dependency-free, best-effort extraction. Pulls out what patterns find
 * reliably (the employer in a forward chain, links, dates) and leaves the
 * rest for the reviewer. Everything guessed is named in `uncertain`.
 */
export type EmailInput = { subject: string; text: string; from: string };

export type ExtractOptions = {
  /** Domains that are "us" (faculty), never the employer. e.g. ["gwu.edu", "email.gwu.edu"] */
  ownDomains?: string[];
};

export function extractListing(email: EmailInput, opts: ExtractOptions = {}): ListingDraft {
  const uncertain: string[] = [];
  const fwd = splitForward(email.text);
  const own = (opts.ownDomains ?? []).map((d) => d.toLowerCase().replace(/^@/, ""));
  const isOwn = (a: Author) => own.some((d) => a.email.endsWith("@" + d) || a.email.endsWith("." + d));

  // Employer = earliest author in the chain who isn't one of us.
  const external = fwd.authors.filter((a) => !isOwn(a) && !a.email.includes(email.from.toLowerCase()));
  const employer = external.at(-1) ?? external[0] ?? null;

  const subject = cleanSubject(fwd.subject ?? email.subject);
  const role = subject || "Untitled opportunity";
  if (!subject) uncertain.push("role (no subject)");

  const contactEmail = employer?.email ?? null;
  const contactName = employer?.name ?? null;
  if (!contactEmail) uncertain.push("contact email");

  const organization = orgFromSubject(subject) ?? orgFromEmail(contactEmail) ?? "Unknown organization";
  if (organization === "Unknown organization") uncertain.push("organization");
  else if (!orgFromSubject(subject)) uncertain.push("organization (guessed from email domain)");

  const applyUrl = bestUrl(fwd.body, contactEmail);
  if (!applyUrl) uncertain.push("apply URL");

  const deadline = findDeadline(fwd.body);
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
    description: fwd.employerMessage,
    summary: "",
    uncertain,
  };
}

/** "Internship Opportunity at E ✣ WEST" → "E ✣ WEST"; "Designer — Acme" → "Acme". */
function orgFromSubject(subject: string): string | null {
  const m = subject.match(/\b(?:at|with|@)\s+(.{2,60})$/i) ?? subject.match(/[—–-]\s*(.{2,60})$/);
  return m ? m[1].trim().replace(/[.!]+$/, "") : null;
}

function orgFromEmail(addr: string | null): string | null {
  if (!addr) return null;
  const domain = addr.split("@")[1] ?? "";
  if (!domain || /^(gmail|yahoo|outlook|hotmail|icloud|proton|me)\./i.test(domain)) return null;
  const label = domain.split(".").slice(-2, -1)[0] ?? domain;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const NOISE_HOSTS = /(google\.com\/maps|maps\.google|calendly\.com|instagram\.com|linkedin\.com\/in|facebook\.com|twitter\.com|x\.com|mailto:|unsubscribe|list-manage|mailchimp|click\.|track)/i;

/** Prefer a link on the employer's own domain; else the first non-noise link. */
function bestUrl(text: string, contactEmail: string | null): string | null {
  const urls = (text.match(/https?:\/\/[^\s<>()"'\]\\]+/gi) ?? [])
    .map((u) => u.replace(/[.,;:!?)*]+$/, ""))
    .filter((u) => !NOISE_HOSTS.test(u))
    .filter((u) => {
      try {
        new URL(u);
        return true;
      } catch {
        return false;
      }
    });
  const domain = contactEmail?.split("@")[1];
  const own = domain ? urls.find((u) => new URL(u).hostname.endsWith(domain)) : undefined;
  return own ?? urls[0] ?? null;
}

const MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec";

/** A date near "deadline" / "apply by" / "due" / "closes" wins; else null. */
function findDeadline(text: string): string | null {
  const window = text.match(/(?:deadline|apply by|applications? (?:are )?due|due|closes?|until)[^.\n]{0,60}/i)?.[0];
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
  return new Date(Date.UTC(y, mIdx, d)).toISOString().slice(0, 10);
}
