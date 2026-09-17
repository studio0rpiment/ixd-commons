"use client";

import { useActionState } from "react";
import { submitListing, type SubmitState } from "@/app/submit/actions";
import { ListingType, LocationMode, Program } from "@/lib/listing/schema";
import { Field, control } from "./Field";
import { ChoiceGroup } from "./ChoiceGroup";

export function SubmitForm() {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitListing, null);

  if (state?.ok) {
    return (
      <div style={{ padding: "1.5rem", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
        <h2 style={{ marginTop: 0 }}>Thanks — we have it.</h2>
        <p>
          A faculty member will review the listing, usually within a few days, and it will appear on the
          board once approved. We&apos;ll email you if we have questions.
        </p>
      </div>
    );
  }

  const err = state && !state.ok ? state.errors : {};

  return (
    <form action={action} noValidate>
      <Field label="Organization" htmlFor="organization" error={err.organization}>
        <input id="organization" name="organization" style={control} required />
      </Field>
      <Field label="Role title" htmlFor="role" error={err.role}>
        <input id="role" name="role" style={control} placeholder="e.g. Summer UX Research Intern" required />
      </Field>
      <Field label="Type" error={err.type}>
        <ChoiceGroup name="type" kind="radio" options={ListingType.options} defaultValue="internship" />
      </Field>
      <Field label="Which programs is this for?" error={err.programs} hint="Pick both if the work spans them.">
        <ChoiceGroup name="programs" kind="checkbox" options={Program.options} />
      </Field>
      <Field label="Where" error={err.locationMode}>
        <ChoiceGroup name="locationMode" kind="radio" options={LocationMode.options} defaultValue="hybrid" />
      </Field>
      <Field label="Location" htmlFor="location" hint="City, or 'anywhere' for fully remote." error={err.location}>
        <input id="location" name="location" style={control} />
      </Field>
      <Field label="Compensation" htmlFor="compensation" hint="As you'd state it to a candidate, e.g. $22/hr, unpaid for credit." error={err.compensation}>
        <input id="compensation" name="compensation" style={control} />
      </Field>
      <Field label="Application deadline" htmlFor="deadline" hint="Leave blank if rolling." error={err.deadline}>
        <input id="deadline" name="deadline" type="date" style={{ ...control, width: "auto" }} />
      </Field>
      <Field label="Application link" htmlFor="applyUrl" hint="Optional. Otherwise students will email the contact below." error={err.applyUrl}>
        <input id="applyUrl" name="applyUrl" type="url" style={control} placeholder="https://" />
      </Field>
      <Field label="Contact name" htmlFor="contactName" error={err.contactName}>
        <input id="contactName" name="contactName" style={control} />
      </Field>
      <Field label="Contact email" htmlFor="contactEmail" error={err.contactEmail}>
        <input id="contactEmail" name="contactEmail" type="email" style={control} required />
      </Field>
      <Field label="Description" htmlFor="description" hint="What the work is, who it suits, how to apply. This is what students read." error={err.description}>
        <textarea id="description" name="description" rows={8} style={control} required />
      </Field>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {err.form && (
        <p role="alert" style={{ color: "var(--accent)" }}>
          {err.form}
        </p>
      )}

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
        {pending ? "Sending…" : "Submit for review"}
      </button>
    </form>
  );
}
