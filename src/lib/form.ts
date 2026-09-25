import type { z } from "zod";

/** Server-action result shared by every form on the site. */
export type FormState = { ok: true } | { ok: false; errors: Record<string, string> } | null;

/** First message per top-level field, keyed by field name. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** FormData → plain object; `many` keys (checkbox groups) become arrays, always present. */
export function formObject(form: FormData, many: readonly string[] = []) {
  const out: Record<string, unknown> = {};
  for (const key of new Set(form.keys())) {
    if (key.startsWith("$")) continue; // React's internal action fields
    out[key] = many.includes(key) ? form.getAll(key) : form.get(key);
  }
  for (const key of many) out[key] ??= [];
  return out;
}
