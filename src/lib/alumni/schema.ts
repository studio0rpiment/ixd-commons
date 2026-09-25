import { z } from "zod";
import { Program } from "@/lib/listing/schema";

/**
 * Alumni catch-up options. These strings are the Notion select options
 * verbatim — the form renders them, Notion stores them, reports group by them.
 */
export const Level = z.enum(["Undergraduate", "Graduate"]);

export const Situation = z.enum([
  "Full-time",
  "Part-time",
  "Freelance / self-employed",
  "Founder",
  "Grad school",
  "Looking",
  "Other",
]);

export const OrgType = z.enum([
  "Agency / studio",
  "In-house",
  "Startup",
  "Nonprofit / cultural",
  "Government",
  "Academia",
  "Own practice",
  "Other",
]);

export const Field = z.enum([
  "UX / UI",
  "Product design",
  "Research",
  "Brand & identity",
  "Editorial & type",
  "Motion",
  "Creative technology",
  "Front-end / dev",
  "AR / XR / spatial",
  "Exhibition & environments",
  "Sound & music",
  "Teaching",
  "Something else",
]);

export const FirstDesignJob = z.enum([
  "Before graduating",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Over a year",
  "Not working in design",
]);

export const PathIn = z.enum([
  "Internship",
  "Faculty or program network",
  "Friends / classmates",
  "Portfolio / cold outreach",
  "Job board",
  "Handshake",
  "Freelance grew into it",
  "Other",
]);

export const Involvement = z.enum([
  "Mentor a student",
  "Crits & portfolio reviews",
  "Hire / host interns",
  "Speak / give a talk",
]);

export const Consent = z.enum(["By name", "Anonymous", "Internal only"]);

/** Short labels shown on the form for each consent option. */
export const consentLabels: Record<z.infer<typeof Consent>, string> = {
  "By name": "Feature me by name",
  Anonymous: "Share my answers without my name",
  "Internal only": "Keep this between us",
};

const optText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optUrl = z.string().trim().url("Enter a full URL, including https://").optional().or(z.literal(""));
const thisYear = new Date().getFullYear();

/** One reply, as validated from the form. */
export const AlumniReply = z.object({
  name: z.string().trim().min(2, "Your name, please").max(120),
  email: z.string().trim().email("Enter a valid email"),
  programs: z.array(Program).min(1, "Pick at least one program"),
  level: z.enum(Level.options, { message: "Pick one" }),
  gradYear: z.coerce
    .number({ message: "A four-digit year" })
    .int()
    .min(1990, "A four-digit year")
    .max(thisYear + 1, "A four-digit year"),
  situation: z.enum(Situation.options, { message: "Pick the closest one" }),
  role: optText(160),
  organization: optText(160),
  orgType: OrgType.optional(),
  fields: z.array(Field),
  location: optText(120),
  firstDesignJob: FirstDesignJob.optional(),
  pathIn: z.array(PathIn),
  programHighlight: optText(2000),
  advice: optText(2000),
  recentWork: optText(2000),
  workLink: optUrl,
  portfolio: optUrl,
  involvement: z.array(Involvement),
  consent: z.enum(Consent.options, { message: "Let us know how we can use this" }),
});
export type AlumniReply = z.infer<typeof AlumniReply>;
