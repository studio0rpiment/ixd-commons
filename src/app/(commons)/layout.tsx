import { SiteHeader } from "@/components/SiteHeader";

/** The public Commons: every page here shares the site nav. */
export default function CommonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ paddingBottom: "4rem" }}>
        {children}
      </main>
    </>
  );
}
