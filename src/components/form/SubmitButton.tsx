/** The accent-filled submit button used by every form. */
export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        font: "inherit",
        fontWeight: 600,
        padding: "0.7rem 1.2rem",
        border: 0,
        borderRadius: "var(--radius)",
        background: "var(--accent)",
        color: "var(--accent-ink)",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Sending…" : children}
    </button>
  );
}
