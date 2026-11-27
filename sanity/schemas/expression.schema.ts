import { defineField, defineType } from "sanity";

export const expressionSchema = defineType({
  name: "expression",
  title: "Expressions",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One line that says what this expression is for.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "frequency",
      title: "How often",
      type: "string",
      options: {
        list: [
          { title: "Weekly", value: "weekly" },
          { title: "Monthly", value: "monthly" },
          { title: "Quarterly", value: "quarterly" },
          { title: "Yearly", value: "yearly" },
          { title: "Occasional", value: "occasional" },
        ],
      },
    }),
    defineField({
      name: "nextGatheringAt",
      title: "Next gathering",
      type: "datetime",
      description:
        "Optional. When set, the website shows the date. Clear it after the event.",
      options: { timeStep: 15 },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "image" },
  },
});
