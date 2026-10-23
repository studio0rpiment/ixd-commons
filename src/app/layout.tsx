import type { Metadata } from "next";
import "./globals.css";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { themeInitScript } from "@/lib/theme";
import { plexSans } from "@/fonts";

export const metadata: Metadata = {
  title: { default: "GW Design Commons", template: "%s · GW Design Commons" },
  description:
    "Opportunities and advising for GW Design — Graphic Design and Interaction Design at the Corcoran School, George Washington University.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plexSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeSwitch />
        {children}
      </body>
    </html>
  );
}
