import type { CSSProperties, ReactNode } from "react";

const style: CSSProperties = {
  display: "inline-block",
  fontSize: "var(--step--1)",
  lineHeight: 1,
  padding: "0.35em 0.6em",
  border: "1px solid var(--line)",
  borderRadius: "999px",
  color: "var(--muted)",
  whiteSpace: "nowrap",
};

export function Tag({ children }: { children: ReactNode }) {
  return <span style={style}>{children}</span>;
}
