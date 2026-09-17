import { Client } from "@notionhq/client";

let cached: Client | null = null;

export function notion(): Client {
  if (cached) return cached;
  const auth = process.env.NOTION_TOKEN;
  if (!auth) throw new Error("NOTION_TOKEN is not set");
  cached = new Client({ auth });
  return cached;
}

/** Notion API 2025+ addresses a database's rows through its data source id. */
export function listingsDataSource(): string {
  const id = process.env.NOTION_LISTINGS_DS;
  if (!id) throw new Error("NOTION_LISTINGS_DS is not set");
  return id;
}
