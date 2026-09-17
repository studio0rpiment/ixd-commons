/**
 * Tiny, typed accessors over Notion's page.properties union.
 * Each returns null rather than throwing when the column is missing or empty,
 * so a renamed column degrades to a blank field instead of a crashed build.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>;

const rich = (arr: unknown): string | null =>
  Array.isArray(arr) && arr.length
    ? arr.map((t) => (t?.plain_text as string) ?? "").join("").trim() || null
    : null;

export const read = {
  title: (p: Props, k: string) => rich(p[k]?.title),
  text: (p: Props, k: string) => rich(p[k]?.rich_text),
  select: (p: Props, k: string) => (p[k]?.select?.name as string | undefined) ?? null,
  multiSelect: (p: Props, k: string): string[] =>
    Array.isArray(p[k]?.multi_select) ? p[k].multi_select.map((o: { name: string }) => o.name) : [],
  status: (p: Props, k: string) => (p[k]?.status?.name as string | undefined) ?? null,
  date: (p: Props, k: string) => (p[k]?.date?.start as string | undefined) ?? null,
  url: (p: Props, k: string) => (p[k]?.url as string | undefined) ?? null,
  email: (p: Props, k: string) => (p[k]?.email as string | undefined) ?? null,
};
