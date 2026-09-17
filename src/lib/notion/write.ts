/** Builders for Notion property values. Nulls are skipped by `props()`. */
const rt = (s: string) => [{ type: "text" as const, text: { content: s.slice(0, 2000) } }];

export const write = {
  title: (s: string) => ({ title: rt(s) }),
  text: (s: string | null) => (s ? { rich_text: rt(s) } : null),
  select: (s: string | null) => (s ? { select: { name: s } } : null),
  status: (s: string) => ({ status: { name: s } }),
  date: (iso: string | null) => (iso ? { date: { start: iso } } : null),
  url: (s: string | null) => (s ? { url: s } : null),
  email: (s: string | null) => (s ? { email: s } : null),
};

/** Drop null entries so Notion never sees an empty property payload. */
export function props<T extends Record<string, unknown | null>>(o: T) {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as {
    [K in keyof T]: NonNullable<T[K]>;
  };
}
