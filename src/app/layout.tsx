import type { Metadata } from "next";
import "./globals.css";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { themeInitScript } from "@/lib/theme";
import { plexSans } from "@/fonts";

export const metadata: Metadata = {
  title: { default: "Corcoran Design Commons", template: "%s · Corcoran Design Commons" },
  description:
    "Internships, jobs and research roles for Graphic Design and Interaction Design students at the Corcoran School of the Arts and Design, George Washington University.",
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
