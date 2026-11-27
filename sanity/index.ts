import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./schemas/blockContentType";
import { expressionSchema } from "./schemas/expression.schema";
import { projectSchema } from "./schemas/project.schema";
import { projectFilterSchema } from "./schemas/projectFilter.schema";
import { serviceSchema } from "./schemas/service.schema";
import { siteSettingsSchema } from "./schemas/siteSettings.schema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    serviceSchema,
    expressionSchema,
    projectFilterSchema,
    projectSchema,
    siteSettingsSchema,
  ],
};
