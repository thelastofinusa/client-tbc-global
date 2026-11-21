import type { Metadata, Viewport } from "next";
import "./globals.css";

import { assetPath } from "keltra";
import { siteConfig } from "~/config/site.config";
import { fontVariables } from "~/lib/fonts";
import { getInitials } from "~/lib/utils";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s – ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url as string),
  authors: [{ name: siteConfig.title }],
  generator: "Next.js",
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
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "TBCG",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  colorScheme: "only light", // "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    // { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={fontVariables("h-full antialiased")}
    >
      <body className="flex min-h-full flex-col">{props.children}</body>
    </html>
  );
}
