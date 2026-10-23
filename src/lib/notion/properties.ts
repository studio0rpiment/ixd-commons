/**
 * Single source of truth for the Notion database's property names.
 * Change a column in Notion → change it here → everything else follows.
 * See docs/notion-schema.md for the expected types.
 */
export const P = {
  role: "Role", // title
  organization: "Organization", // rich_text
  type: "Type", // select
  programs: "Programs", // multi_select
  locationMode: "Location mode", // select
  location: "Location", // rich_text
  compensation: "Compensation", // rich_text
  deadline: "Deadline", // date
  applyUrl: "Apply URL", // url
  contactEmail: "Contact email", // email
  contactName: "Contact name", // rich_text
  summary: "Summary", // rich_text
  uncertain: "Uncertain", // rich_text
  status: "Status", // select (Needs review / Published / Expired / Declined)
  source: "Source", // select
  slug: "Slug", // rich_text
  publishedAt: "Published at", // date
  forwardedBy: "Forwarded by", // email
} as const;

/** Alumni Catch-ups database property names. See docs/notion-schema.md. */
export const A = {
  name: "Name", // title
  email: "Email", // email
  programs: "Programs", // multi_select
  level: "Level", // select
  otherStudies: "Second major / minor", // rich_text
  gradYear: "Grad year", // number
  situation: "Situation", // select
  situationOther: "Situation (other)", // rich_text
  role: "Role", // rich_text
  organization: "Organization", // rich_text
  orgType: "Org type", // select
  orgTypeOther: "Org type (other)", // rich_text
  fields: "Fields", // multi_select
  fieldsOther: "Fields (other)", // rich_text
  location: "Location", // rich_text
  firstDesignJob: "First design job", // select
  pathIn: "Path in", // multi_select
  pathInOther: "Path in (other)", // rich_text
  programHighlight: "Program highlight", // rich_text
  advice: "Advice", // rich_text
  recentWork: "Recent work", // rich_text
  workLink: "Work link", // url
  portfolio: "Portfolio", // url
  involvement: "Involvement", // multi_select
  consent: "Consent", // select (By name / Anonymous / Internal only)
  status: "Status", // select (New / Reviewed / Featured / Archived)
  notes: "Notes", // rich_text, internal
} as const;
