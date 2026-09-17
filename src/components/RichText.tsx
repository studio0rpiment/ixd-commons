// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RT = { plain_text: string; href?: string | null; annotations?: Record<string, any> };

/** Renders a Notion rich_text array: bold, italic, code, links. */
export function RichText({ text }: { text: RT[] }) {
  return (
    <>
      {text.map((t, i) => {
        let node: React.ReactNode = t.plain_text;
        const a = t.annotations ?? {};
        if (a.code) node = <code>{node}</code>;
        if (a.bold) node = <strong>{node}</strong>;
        if (a.italic) node = <em>{node}</em>;
        if (t.href) {
          node = (
            <a href={t.href} rel="noopener noreferrer" target="_blank">
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}
