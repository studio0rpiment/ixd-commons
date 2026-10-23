"use client";

import Link from "next/link";
import { submitAlumniReply } from "@/app/site/alumniCatchup/actions";
import type { FormState } from "@/lib/form";
import { Program } from "@/lib/listing/schema";
import {
  Consent,
  consentLabels,
  Field as WorkField,
  FirstDesignJob,
  Involvement,
  Level,
  OrgType,
  PathIn,
  Situation,
} from "@/lib/alumni/schema";
import { Field, control } from "./Field";
import { ChoiceGroup } from "./ChoiceGroup";
import { FormSection } from "./FormSection";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";
import { FormNotice, FormError } from "./FormNotice";
import { useFormAction } from "./useFormAction";

export function AlumniForm() {
  const { state, pending, onSubmit } = useFormAction<FormState>(submitAlumniReply, null);

  if (state?.ok) {
    return (
      <FormNotice title="Thank you — it's good to hear from you.">
        <p>
          Your answers went straight to the GW Design faculty. If you offered to get involved, one of us
          will be in touch.
        </p>
        <p>
          While you&apos;re here: <Link href="/">GW Design Commons</Link> is where current students find
          internships and jobs. Hiring? <Link href="/submit">Post an opportunity</Link>.
        </p>
      </FormNotice>
    );
  }

  const err = state && !state.ok ? state.errors : {};

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection title="About you">
        <Field label="Name" htmlFor="name" error={err.name}>
          <input id="name" name="name" autoComplete="name" style={control} required />
        </Field>
        <Field label="Email" htmlFor="email" hint="So we can follow up. Never shown." error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" style={control} required />
        </Field>
        <Field label="Program" error={err.programs}>
          <ChoiceGroup name="programs" kind="checkbox" options={Program.options} />
        </Field>
        <Field label="Degree" error={err.level}>
          <ChoiceGroup name="level" kind="radio" options={Level.options} />
        </Field>
        <Field
          label="Second major or minor"
          htmlFor="otherStudies"
          hint="Optional — whatever you paired design with, e.g. Psychology minor."
          error={err.otherStudies}
        >
          <input id="otherStudies" name="otherStudies" maxLength={200} style={control} />
        </Field>
        <Field label="Graduation year" htmlFor="gradYear" error={err.gradYear}>
          <input
            id="gradYear"
            name="gradYear"
            inputMode="numeric"
            maxLength={4}
            placeholder="2024"
            style={{ ...control, width: "7rem" }}
            required
          />
        </Field>
      </FormSection>

      <FormSection title="Right now">
        <Field label="What best describes what you're doing?" error={err.situation}>
          <ChoiceGroup
            name="situation"
            kind="radio"
            options={Situation.options}
            other={{ value: "Other", name: "situationOther" }}
          />
        </Field>
        <Field label="Role or title" htmlFor="role" hint="Optional" error={err.role}>
          <input id="role" name="role" autoComplete="organization-title" style={control} />
        </Field>
        <Field label="Organization" htmlFor="organization" hint="Optional — studio, company, school, or your own practice." error={err.organization}>
          <input id="organization" name="organization" autoComplete="organization" style={control} />
        </Field>
        <Field label="Kind of organization" hint="Optional" error={err.orgType}>
          <ChoiceGroup
            name="orgType"
            kind="radio"
            options={OrgType.options}
            other={{ value: "Other", name: "orgTypeOther" }}
          />
        </Field>
        <Field label="Where you're based" htmlFor="location" hint="Optional — city, or 'remote'." error={err.location}>
          <input id="location" name="location" style={control} />
        </Field>
        <Field label="What kind of work fills your days?" hint="Optional — pick any." error={err.fields}>
          <ChoiceGroup
            name="fields"
            kind="checkbox"
            options={WorkField.options}
            other={{ value: "Something else", name: "fieldsOther" }}
          />
        </Field>
      </FormSection>

      <FormSection title="Getting there">
        <Field label="How long after graduating did your first design role start?" hint="Optional" error={err.firstDesignJob}>
          <ChoiceGroup name="firstDesignJob" kind="radio" options={FirstDesignJob.options} />
        </Field>
        <Field label="How did you find your way in?" hint="Optional — pick any." error={err.pathIn}>
          <ChoiceGroup
            name="pathIn"
            kind="checkbox"
            options={PathIn.options}
            other={{ value: "Other", name: "pathInOther" }}
          />
        </Field>
      </FormSection>

      <FormSection title="In your words" hint="All optional. A sentence or two is plenty.">
        <Field label="What from the program do you use most?" htmlFor="programHighlight" error={err.programHighlight}>
          <textarea id="programHighlight" name="programHighlight" rows={3} maxLength={2000} style={control} />
        </Field>
        <Field label="Something you've worked on lately that you're proud of" htmlFor="recentWork" error={err.recentWork}>
          <textarea id="recentWork" name="recentWork" rows={3} maxLength={2000} style={control} />
        </Field>
        <Field label="Link to that work" htmlFor="workLink" error={err.workLink}>
          <input id="workLink" name="workLink" type="url" placeholder="https://" style={control} />
        </Field>
        <Field label="Portfolio or site" htmlFor="portfolio" error={err.portfolio}>
          <input id="portfolio" name="portfolio" type="url" placeholder="https://" style={control} />
        </Field>
        <Field label="Advice for current students" htmlFor="advice" error={err.advice}>
          <textarea id="advice" name="advice" rows={3} maxLength={2000} style={control} />
        </Field>
      </FormSection>

      <FormSection title="Staying involved" hint="Optional. Tick anything you'd be open to — we'll ask before scheduling anything.">
        <Field label="I'd be open to…" error={err.involvement}>
          <ChoiceGroup name="involvement" kind="checkbox" options={Involvement.options} />
        </Field>
      </FormSection>

      <FormSection title="Sharing">
        <Field
          label="How can we use what you've told us?"
          hint="We may share alumni stories and program-wide numbers with prospective students. Your email is never shown."
          error={err.consent}
        >
          <ChoiceGroup name="consent" kind="radio" options={Consent.options} labels={consentLabels} />
        </Field>
      </FormSection>

      <Honeypot />
      <FormError message={err.form} />
      <SubmitButton pending={pending}>Send</SubmitButton>
    </form>
  );
}
