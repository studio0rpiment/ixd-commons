"use server";

import { AlumniReply } from "@/lib/alumni/schema";
import { createAlumniReply } from "@/lib/notion/alumni";
import { fieldErrors, formObject, type FormState } from "@/lib/form";

const MANY = ["programs", "fields", "pathIn", "involvement"] as const;

export async function submitAlumniReply(_prev: FormState, form: FormData): Promise<FormState> {
  if (form.get("website")) return { ok: true }; // honeypot tripped: pretend success, write nothing

  const parsed = AlumniReply.safeParse(formObject(form, MANY)); // unknown keys (honeypot) are stripped
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  try {
    await createAlumniReply(parsed.data);
    return { ok: true };
  } catch (e) {
    console.error("[alumni] failed", e);
    return { ok: false, errors: { form: "Something went wrong on our side. Please try again in a bit, or email us." } };
  }
}
