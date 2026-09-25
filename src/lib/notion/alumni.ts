import { notion, alumniDataSource } from "./client";
import { A } from "./properties";
import { write, props } from "./write";
import type { AlumniReply } from "@/lib/alumni/schema";

const number = (n: number | null) => (n == null ? null : { number: n });

/** One reply = one row, Status New. A later reply from the same person is a new snapshot. */
export async function createAlumniReply(r: AlumniReply): Promise<{ id: string }> {
  const page = await notion().pages.create({
    parent: { data_source_id: alumniDataSource() },
    properties: props({
      [A.name]: write.title(r.name),
      [A.email]: write.email(r.email),
      [A.programs]: write.multiSelect(r.programs),
      [A.level]: write.select(r.level),
      [A.gradYear]: number(r.gradYear),
      [A.situation]: write.select(r.situation),
      [A.role]: write.text(r.role || null),
      [A.organization]: write.text(r.organization || null),
      [A.orgType]: write.select(r.orgType ?? null),
      [A.fields]: write.multiSelect(r.fields),
      [A.location]: write.text(r.location || null),
      [A.firstDesignJob]: write.select(r.firstDesignJob ?? null),
      [A.pathIn]: write.multiSelect(r.pathIn),
      [A.programHighlight]: write.text(r.programHighlight || null),
      [A.advice]: write.text(r.advice || null),
      [A.recentWork]: write.text(r.recentWork || null),
      [A.workLink]: write.url(r.workLink || null),
      [A.portfolio]: write.url(r.portfolio || null),
      [A.involvement]: write.multiSelect(r.involvement),
      [A.consent]: write.select(r.consent),
      [A.status]: write.select("New"),
    }),
  });
  return { id: page.id };
}
