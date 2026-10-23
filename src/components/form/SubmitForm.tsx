"use client";

import { submitListing, type SubmitState } from "@/app/(commons)/submit/actions";
import { ListingType, LocationMode, Program } from "@/lib/listing/schema";
import { Field, control } from "./Field";
import { ChoiceGroup } from "./ChoiceGroup";
import { useFormAction } from "./useFormAction";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";
import { FormNotice, FormError } from "./FormNotice";

export function SubmitForm() {
  const { state, pending, onSubmit } = useFormAction<SubmitState>(submitListing, null);

  if (state?.ok) {
    return (
      <FormNotice title="Thanks — we have it.">
        <p>
          A faculty member will review the listing, usually within a few days, and it will appear on the
          board once approved. We&apos;ll email you if we have questions.
        </p>
      </FormNotice>
    );
  }

  const err = state && !state.ok ? state.errors : {};

  return (
    <form onSubmit={onSubmit} noValidate>
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

      <Honeypot />
      <FormError message={err.form} />
      <SubmitButton pending={pending}>Submit for review</SubmitButton>
    </form>
  );
}
