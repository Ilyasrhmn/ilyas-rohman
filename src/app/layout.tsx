import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ChromeShell } from "@/components/layout/chrome-shell";
import { profile } from "@/data/profile";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${profile.name} — ${profile.role}`,
  description: profile.positioning,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.positioning,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ChromeShell>{children}</ChromeShell>
      </body>
    </html>
  );
}
