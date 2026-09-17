/** Dry-run the extractor on a pasted email: pnpm tsx scripts/try-extract.ts < email.txt */
import { readFileSync } from "node:fs";
import { extractListing } from "../src/lib/extract/fromEmail";

const text = readFileSync(0, "utf8");
const subject = text.match(/^subject:\s*(.+)$/im)?.[1] ?? "(no subject)";
console.log(extractListing({ subject, text, from: "kevinpatton@email.gwu.edu" }, { ownDomains: ["gwu.edu", "email.gwu.edu"] }));
