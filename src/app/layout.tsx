import type { Metadata } from "next";
import { kanit, roboto } from "@/lib/fonts";
import { site } from "@/constants/site";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "online courses",
    "eLearning",
    "LMS",
    "web development",
    "mentors",
    "WebHack Academy",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${kanit.variable} ${roboto.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
