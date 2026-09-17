"use server";

import { z } from "zod";
import { ListingType, LocationMode, Program, type ListingDraft } from "@/lib/listing/schema";
import { createDraftListing } from "@/lib/notion/listings";

const Submission = z.object({
  organization: z.string().trim().min(2, "Organization is required").max(120),
  role: z.string().trim().min(2, "Role title is required").max(120),
  type: ListingType,
  programs: z.array(Program).min(1, "Pick at least one program"),
  locationMode: LocationMode,
  location: z.string().trim().max(120).optional().or(z.literal("")),
  compensation: z.string().trim().max(120).optional().or(z.literal("")),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  applyUrl: z.string().trim().url("Enter a full URL, including https://").optional().or(z.literal("")),
  contactName: z.string().trim().max(120).optional().or(z.literal("")),
  contactEmail: z.string().trim().email("Enter a valid email"),
  description: z.string().trim().min(40, "Tell students a bit more (40+ characters)").max(8000),
  website: z.string().max(0).optional(), // honeypot: bots fill it, people never see it
});

export type SubmitState = { ok: true; notionUrl?: string } | { ok: false; errors: Record<string, string> } | null;

export async function submitListing(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const raw = {
    organization: form.get("organization"),
    role: form.get("role"),
    type: form.get("type"),
    programs: form.getAll("programs"),
    locationMode: form.get("locationMode"),
    location: form.get("location"),
    compensation: form.get("compensation"),
    deadline: form.get("deadline"),
    applyUrl: form.get("applyUrl"),
    contactName: form.get("contactName"),
    contactEmail: form.get("contactEmail"),
    description: form.get("description"),
    website: form.get("website"),
  };

  const parsed = Submission.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, errors };
  }
  const d = parsed.data;
  if (d.website) return { ok: true }; // honeypot tripped: pretend success, write nothing

  const draft: ListingDraft = {
    organization: d.organization,
    role: d.role,
    type: d.type,
    programs: d.programs,
    locationMode: d.locationMode,
    location: d.location || null,
    compensation: d.compensation || null,
    deadline: d.deadline || null,
    applyUrl: d.applyUrl || null,
    contactName: d.contactName || null,
    contactEmail: d.contactEmail,
    description: d.description,
    summary: "",
    uncertain: ["summary"],
  };

  try {
    await createDraftListing(draft, { source: "form", forwardedBy: null, rawBody: null });
    return { ok: true };
  } catch (e) {
    console.error("[submit] failed", e);
    return { ok: false, errors: { form: "Something went wrong on our side. Please email us instead." } };
  }
}
