import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { plexSans } from "@/fonts";

export const metadata: Metadata = {
  title: { default: "IxD Commons", template: "%s · IxD Commons" },
  description:
    "Opportunities and advising for Interaction Design at the Corcoran School, George Washington University.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plexSans.variable}>
      <body>
        <SiteHeader />
        <main className="wrap" style={{ paddingBottom: "4rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
