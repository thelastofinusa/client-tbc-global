import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./schemas/blockContentType";
import { projectFilterSchema } from "./schemas/projectFilter.schema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, projectFilterSchema],
};
