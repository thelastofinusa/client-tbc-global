import type { StructureResolver } from "sanity/structure";
import { siteConfig } from "~/config/site.config";
import { getInitials } from "~/lib/utils";

export const SINGLETON_TYPES = ["siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title(`${getInitials(siteConfig.title)}'s Content`)
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("service"),
      S.documentTypeListItem("expression"),
      S.divider(),
      S.documentTypeListItem("project"),
      S.documentTypeListItem("projectFilter"),
    ]);
