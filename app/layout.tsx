import type { Metadata } from "next";
import "./globals.css";

import { assetPath } from "keltra";
import { siteConfig } from "~/config/site.config";
import { fontVariables } from "~/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s – ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url as string),
  authors: [{ name: siteConfig.title }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: assetPath("/opengraph.webp"),
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [assetPath("/opengraph.webp")],
  },
  icons: siteConfig.author.avatar,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={fontVariables("h-full antialiased font-sans")}
    >
      <body className="flex min-h-full flex-col">{props.children}</body>
    </html>
  );
}
