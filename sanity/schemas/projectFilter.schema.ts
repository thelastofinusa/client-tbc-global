import { DocumentFilter } from "reicon-react";
import { defineField, defineType } from "sanity";

export const projectFilterSchema = defineType({
  name: "projectFilter",
  title: "Project Filters",
  type: "document",
  icon: DocumentFilter,

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "value",
      title: "Value",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
