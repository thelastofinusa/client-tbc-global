import type { MetadataRoute } from "next";
import { siteConfig } from "~/config/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.pwaName,
    short_name: siteConfig.pwaName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffbf2",
    theme_color: "#a42024",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
