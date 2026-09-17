import type { Block } from "@/lib/notion/listings";
import { RichText } from "./RichText";

/**
 * Minimal renderer for the block types a listing description will use.
 * Consecutive list items are grouped into one <ul>/<ol>. Unknown types are skipped.
 */
export function NotionBlocks({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let list: { kind: "ul" | "ol"; items: Block[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.kind;
    out.push(
      <Tag key={list.items[0].id}>
        {list.items.map((b) => (
          <li key={b.id}>
            <RichText text={b[b.type].rich_text} />
          </li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const b of blocks) {
    const kind = b.type === "bulleted_list_item" ? "ul" : b.type === "numbered_list_item" ? "ol" : null;
    if (kind) {
      if (!list || list.kind !== kind) {
        flush();
        list = { kind, items: [] };
      }
      list.items.push(b);
      continue;
    }
    flush();
    out.push(<BlockView key={b.id} block={b} />);
  }
  flush();
  return <>{out}</>;
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "paragraph":
      return b.paragraph.rich_text.length ? (
        <p>
          <RichText text={b.paragraph.rich_text} />
        </p>
      ) : null;
    case "heading_1":
    case "heading_2":
      return (
        <h2>
          <RichText text={b[b.type].rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <RichText text={b.heading_3.rich_text} />
        </h3>
      );
    case "quote":
      return (
        <blockquote>
          <RichText text={b.quote.rich_text} />
        </blockquote>
      );
    case "divider":
      return <hr />;
    default:
      return null;
  }
}
