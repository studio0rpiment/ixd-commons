import type { ReactNode } from "react";

/** Label + control + optional error, stacked. The one layout atom every field uses. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: "0.3rem", marginBottom: "1.1rem" }}>
      <label htmlFor={htmlFor} style={{ fontWeight: 600 }}>
        {label}
      </label>
      {hint && <div className="muted small">{hint}</div>}
      {children}
      {error && (
        <div className="small" style={{ color: "var(--accent)" }} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export const control: React.CSSProperties = {
  font: "inherit",
  padding: "0.55rem 0.7rem",
  border: "1px solid var(--line)",
  borderRadius: "var(--radius)",
  background: "var(--bg)",
  color: "var(--fg)",
  width: "100%",
};
