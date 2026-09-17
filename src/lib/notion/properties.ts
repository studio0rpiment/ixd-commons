/**
 * Single source of truth for the Notion database's property names.
 * Change a column in Notion → change it here → everything else follows.
 * See docs/notion-schema.md for the expected types.
 */
export const P = {
  role: "Role", // title
  organization: "Organization", // rich_text
  type: "Type", // select
  locationMode: "Location mode", // select
  location: "Location", // rich_text
  compensation: "Compensation", // rich_text
  deadline: "Deadline", // date
  applyUrl: "Apply URL", // url
  contactEmail: "Contact email", // email
  contactName: "Contact name", // rich_text
  summary: "Summary", // rich_text
  uncertain: "Uncertain", // rich_text
  status: "Status", // status
  source: "Source", // select
  slug: "Slug", // rich_text
  publishedAt: "Published at", // date
  forwardedBy: "Forwarded by", // email
} as const;
