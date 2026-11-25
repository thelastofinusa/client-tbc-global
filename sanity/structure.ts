import type { StructureResolver } from "sanity/structure";
import { siteConfig } from "~/config/site.config";
import { getInitials } from "~/lib/utils";

export const structure: StructureResolver = (S) =>
  S.list()
    .title(`${getInitials(siteConfig.title)}'s Content`)
    .items([
      S.documentTypeListItem("service"),
      S.documentTypeListItem("expression"),
      S.divider(),
      S.documentTypeListItem("project"),
      S.documentTypeListItem("projectFilter"),
    ]);
