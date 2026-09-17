# Notion: Listings database

One database, one review queue. Property names must match `src/lib/notion/properties.ts`.

| Property       | Type      | Notes                                                   |
|----------------|-----------|---------------------------------------------------------|
| Role           | Title     | Job / internship title                                  |
| Organization   | Text      |                                                         |
| Type           | Select    | internship, full-time, part-time, freelance, research, fellowship |
| Programs       | Multi-select | Graphic Design, Interaction Design                     |
| Location mode  | Select    | on-site, hybrid, remote                                 |
| Location       | Text      | City, campus, "anywhere"                                |
| Compensation   | Text      | As stated by the employer                               |
| Deadline       | Date      | Empty = rolling. Site hides listings past this date.    |
| Apply URL      | URL       |                                                         |
| Contact email  | Email     |                                                         |
| Contact name   | Text      |                                                         |
| Summary        | Text      | Two sentences, student-facing                           |
| Uncertain      | Text      | Extractor's notes for the reviewer; not shown publicly  |
| Status         | Select    | Needs review → Published; also Expired, Declined (Select, not Status: the API cannot set Status options) |
| Source         | Select    | email, form, faculty, alumni                            |
| Slug           | Text      | Auto-filled by the pipeline; editable                   |
| Published at   | Date      | Set this when you flip Status to Published (a Notion automation can do it) |
| Forwarded by   | Email     | Which faculty member sent it in                         |

Page body: the pipeline pre-fills the employer's message as paragraphs (this is the public
**description** — edit it freely: headings, lists, links all render on the site) and puts the raw
forwarded email in a collapsed "Original message" toggle, which the site skips.

"Published at" is stamped automatically by the site's webhook when Status flips to Published.

## Views to make in Notion

- **Review queue** — filter Status = Needs review, sorted by created time. This is the inbox.
- **Live** — Status = Published and (Deadline empty or ≥ today).
- **Archive** — everything else.

## Automations (Notion-side, no code)

- Notion form on this database for employer self-submission; default Status = Needs review, Source = form.

## Webhook

Notion → integration settings → Webhooks → subscribe to `page.properties_updated`
and `page.created` on this database, URL `https://<site>/api/notion-webhook?secret=<NOTION_WEBHOOK_SECRET>`.
The first call carries a `verification_token`; the route logs it — paste it back into Notion.
