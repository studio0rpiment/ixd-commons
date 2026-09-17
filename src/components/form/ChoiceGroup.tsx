/** A row of radio or checkbox pills sharing one name. */
export function ChoiceGroup({
  name,
  options,
  kind,
  defaultValue,
}: {
  name: string;
  options: readonly string[];
  kind: "radio" | "checkbox";
  defaultValue?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {options.map((o) => (
        <label
          key={o}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.7rem",
            border: "1px solid var(--line)",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          <input type={kind} name={name} value={o} defaultChecked={o === defaultValue} />
          {o}
        </label>
      ))}
    </div>
  );
}
