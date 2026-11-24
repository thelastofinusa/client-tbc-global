import type { StructureResolver } from "sanity/structure";
import { siteConfig } from "~/config/site.config";
import { getInitials } from "~/lib/utils";

export const structure: StructureResolver = (S) =>
  S.list()
    .title(`${getInitials(siteConfig.title)}'s Content`)
    .items([
      // ==================================================
      // CONTENT
      // ==================================================

      S.documentTypeListItem("projectFilter"),
    ]);
