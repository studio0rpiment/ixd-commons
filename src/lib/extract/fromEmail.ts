import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ListingDraft } from "@/lib/listing/schema";

const MODEL = process.env.EXTRACT_MODEL ?? "claude-sonnet-4-5";

const SYSTEM = `You turn forwarded emails about jobs, internships, and freelance work into
structured listings for GW Design's opportunity board (Graphic Design and
Interaction Design programs at the Corcoran School, George Washington University).

Rules:
- The email is usually FORWARDED by a faculty member. The employer is the original
  sender inside the quoted message, not the forwarder.
- Never invent. If a field is not stated, return null and name it in "uncertain".
- Dates: return ISO YYYY-MM-DD. "Rolling", "ASAP", "until filled" → null.
- Compensation: quote as written ("$25/hr", "unpaid, for credit"). Do not estimate.
- Summary: two plain sentences a student can act on — what the work is, and what
  makes it relevant to design students (graphic design, typography, branding,
  editorial, motion, interfaces, prototyping, research, spatial/AR, sound,
  physical computing, service design...). No hype.
- Type: pick the closest of internship, full-time, part-time, freelance, research, fellowship.
- Programs: "Graphic Design" for visual/brand/editorial/motion/typography work,
  "Interaction Design" for UX/UI/prototyping/research/spatial/physical computing work,
  both when it spans them or you cannot tell.`;

export type EmailInput = {
  subject: string;
  text: string;
  from: string;
};

export async function extractListing(email: EmailInput): Promise<ListingDraft> {
  const client = new Anthropic();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM,
    tools: [
      {
        name: "save_listing",
        description: "Save the extracted listing.",
        input_schema: z.toJSONSchema(ListingDraft) as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "save_listing" },
    messages: [
      {
        role: "user",
        content: `From: ${email.from}\nSubject: ${email.subject}\n\n${email.text.slice(0, 20_000)}`,
      },
    ],
  });

  const call = res.content.find((b) => b.type === "tool_use");
  if (!call || call.type !== "tool_use") throw new Error("Extractor returned no listing");
  return ListingDraft.parse(call.input);
}
