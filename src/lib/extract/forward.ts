/**
 * Pull the employer's message out of a forwarded email chain.
 * Handles Gmail ("---------- Forwarded message ---------"), Apple Mail
 * ("Begin forwarded message:"), Outlook ("-----Original Message-----"),
 * and nested "On <date> <person> wrote:" quotes. No dependencies.
 */
export type Author = { name: string | null; email: string };

export type ForwardParts = {
  /** Text after the forward marker (or the whole thing if none). */
  body: string;
  /** Subject from the forwarded header block, if present. */
  subject: string | null;
  /** Authors in chain order: forwarded From first, then each quoted "wrote:" author. */
  authors: Author[];
  /** Best guess at the employer's own words: the innermost quoted message, quote marks stripped. */
  employerMessage: string;
};

const FORWARD_MARKERS = [
  /^-{3,}\s*forwarded message\s*-{3,}$/im,
  /^begin forwarded message:?$/im,
  /^-{3,}\s*original message\s*-{3,}$/im,
  /^(?:von|from):\s.+\n(?:gesendet|sent|date):\s.+/im, // Outlook-style header block
];

export function splitForward(text: string): ForwardParts {
  const cleaned = stripSignature(text.replace(/\r\n/g, "\n"));

  let body = cleaned;
  for (const re of FORWARD_MARKERS) {
    const m = re.exec(cleaned);
    if (m) {
      body = cleaned.slice(m.index + m[0].length);
      break;
    }
  }

  const subject = headerValue(body, /^(?:>\s*)?(?:subject|betreff)\s*:\s*(.+)$/im);
  const authors: Author[] = [];

  const fromLine = headerValue(body, /^(?:>\s*)?(?:from|von)\s*:\s*(.+)$/im);
  const fromAuthor = fromLine ? parseAuthor(fromLine) : null;
  if (fromAuthor) authors.push(fromAuthor);

  // "On Wed, Sep 2, 2026 at 9:13 AM Emily Westberg <emily@ewest.io> wrote:"
  const wroteRe = /^(?:>\s*)*on ([^<\n]{0,160}?)\s*<([^>]+@[^>]+)>\s*wrote:/gim;
  for (const m of body.matchAll(wroteRe)) {
    // "Wed, Sep 2, 2026 at 9:13 AM Emily Westberg" → "Emily Westberg"
    const name = m[1].replace(/^.*(?:\b[ap]m\b|\b\d{4}\b)\s*/i, "").replace(/["']/g, "").trim();
    authors.push({ name: name || null, email: m[2].toLowerCase() });
  }

  return { body, subject, authors: dedupe(authors), employerMessage: innermostMessage(body) };
}

/** Text after the last "… wrote:" line (or after the header block), with ">" markers and image tags removed. */
function innermostMessage(body: string): string {
  const wrote = [...body.matchAll(/^(?:>\s*)*on .{0,200}?wrote:\s*$/gim)].at(-1);
  const msg = wrote ? body.slice(wrote.index! + wrote[0].length) : body.replace(/^(?:(?:from|von|date|sent|subject|betreff|to|an|cc)\s*:.*\n?)+/im, "");
  return msg
    .split("\n")
    .map((l) => l.replace(/^(\s*>)+\s?/, ""))
    .join("\n")
    .replace(/\[image:[^\]]*\]\s*(<[^>]+>)?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Drop a trailing "-- " signature block (the forwarder's own). */
function stripSignature(text: string): string {
  const i = text.search(/^--\s*$/m);
  return i === -1 ? text : text.slice(0, i);
}

function headerValue(text: string, re: RegExp): string | null {
  const m = re.exec(text);
  return m ? m[1].trim() : null;
}

export function parseAuthor(line: string): Author | null {
  const addr = line.match(/<([^>]+@[^>]+)>/)?.[1] ?? line.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  if (!addr) return null;
  const name = line.replace(/<[^>]+>/, "").replace(/["']/g, "").trim();
  return { name: name && !name.includes("@") ? name : null, email: addr.toLowerCase() };
}

function dedupe(list: Author[]): Author[] {
  const seen = new Set<string>();
  return list.filter((a) => (seen.has(a.email) ? false : (seen.add(a.email), true)));
}

/** Strip Re:/Fwd:/AW:/WG: prefixes, repeatedly. */
export function cleanSubject(s: string): string {
  return s.replace(/^(\s*(fwd?|fw|re|aw|wg)\s*:\s*)+/i, "").trim().slice(0, 120);
}
