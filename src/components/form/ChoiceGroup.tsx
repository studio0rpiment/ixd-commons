"use client";

import { useState } from "react";
import { control } from "./Field";

/** A row of radio or checkbox pills sharing one name. */
export function ChoiceGroup({
  name,
  options,
  kind,
  defaultValue,
  labels,
  other,
}: {
  name: string;
  options: readonly string[];
  kind: "radio" | "checkbox";
  defaultValue?: string;
  /** Display text per option value, when the stored value isn't what people should read. */
  labels?: Partial<Record<string, string>>;
  /** The catch-all option ("Other"): picking it opens a text field, posted under `name`. */
  other?: { value: string; name: string };
}) {
  const [otherOn, setOtherOn] = useState(other != null && defaultValue === other.value);

  // Radios: the picked value decides. Checkboxes: only the catch-all's own box does.
  function onChange(e: React.ChangeEvent<HTMLDivElement>) {
    if (!other) return;
    const input = e.target as unknown as HTMLInputElement;
    if (kind === "radio") setOtherOn(input.value === other.value);
    else if (input.value === other.value) setOtherOn(input.checked);
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }} onChange={onChange}>
        {options.map((o) => (
          <label
            key={o}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.7rem",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
            }}
          >
            <input type={kind} name={name} value={o} defaultChecked={o === defaultValue} />
            {labels?.[o] ?? o}
          </label>
        ))}
      </div>
      {other && otherOn && (
        <input
          name={other.name}
          aria-label={`${labels?.[other.value] ?? other.value}: tell us more`}
          placeholder="Tell us more"
          maxLength={160}
          autoFocus
          style={control}
        />
      )}
    </>
  );
}
