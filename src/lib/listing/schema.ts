import { z } from "zod";

/**
 * The one shape every listing passes through — extracted from email,
 * submitted via form, stored in Notion, rendered on the site.
 */
export const ListingType = z.enum([
  "internship",
  "full-time",
  "part-time",
  "freelance",
  "research",
  "fellowship",
]);
export type ListingType = z.infer<typeof ListingType>;

export const LocationMode = z.enum(["on-site", "hybrid", "remote"]);
export type LocationMode = z.infer<typeof LocationMode>;

export const ListingStatus = z.enum(["Needs review", "Published", "Expired", "Declined"]);
export type ListingStatus = z.infer<typeof ListingStatus>;

export const Program = z.enum(["Graphic Design", "Interaction Design"]);
export type Program = z.infer<typeof Program>;

export const Source = z.enum(["email", "form", "faculty", "alumni"]);
export type Source = z.infer<typeof Source>;

/** What the extractor must produce. Everything optional except org + role. */
export const ListingDraft = z.object({
  organization: z.string().min(1),
  role: z.string().min(1),
  type: ListingType.nullable(),
  programs: z
    .array(Program)
    .describe("Which GW Design programs this fits. Both when the work spans them or is unclear."),
  locationMode: LocationMode.nullable(),
  location: z.string().nullable().describe("City / campus / 'anywhere'"),
  compensation: z.string().nullable().describe("As stated; do not infer"),
  deadline: z.string().nullable().describe("ISO date YYYY-MM-DD, or null if rolling/unknown"),
  applyUrl: z.string().url().nullable(),
  contactEmail: z.string().email().nullable(),
  contactName: z.string().nullable(),
  summary: z
    .string()
    .describe("Two plain sentences for students: what the work is and why it fits interaction design"),
  uncertain: z
    .array(z.string())
    .describe("Fields you guessed at or could not find, for the human reviewer"),
});
export type ListingDraft = z.infer<typeof ListingDraft>;

/** A listing as read back from Notion. */
export const Listing = ListingDraft.extend({
  id: z.string(),
  slug: z.string(),
  status: ListingStatus,
  source: Source,
  publishedAt: z.string().nullable(),
});
export type Listing = z.infer<typeof Listing>;
