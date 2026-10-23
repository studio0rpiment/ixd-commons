/** Boxed message shown in place of a form once it has been sent. */
export function FormNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "1.5rem", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

/** Form-level error line (not tied to one field). */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" style={{ color: "var(--error)" }}>
      {message}
    </p>
  );
}
