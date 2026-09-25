import type { ReactNode } from "react";

/** A titled group of fields, separated from the next by a rule. */
export function FormSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset style={{ border: 0, borderTop: "1px solid var(--line)", padding: "1.25rem 0 0.5rem", margin: 0 }}>
      <legend style={{ padding: 0, fontWeight: 700, fontSize: "1.15rem" }}>{title}</legend>
      {hint && <p className="muted small" style={{ marginTop: 0 }}>{hint}</p>}
      {children}
    </fieldset>
  );
}
