/**
 * Pages shared by direct link only (the alumni catch-up). They stand alone,
 * without the site nav, so nobody wanders off mid-form.
 */
export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="wrap" style={{ paddingBlock: "3rem 4rem" }}>
      {children}
    </main>
  );
}
