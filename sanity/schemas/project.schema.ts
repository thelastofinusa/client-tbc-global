import { defineArrayMember, defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "story", title: "Story" },
    { name: "progress", title: "Progress" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "overview",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      group: "overview",
      description: "e.g. PRJ-01",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "overview",
      to: [{ type: "projectFilter" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: {
        list: ["Active", "In Progress", "Ongoing", "Completed"],
        layout: "radio",
      },
      initialValue: "Active",
    }),
    defineField({ name: "location", title: "Location", type: "string", group: "overview" }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      group: "overview",
    }),
    defineField({
      name: "endDate",
      title: "Target end date",
      type: "date",
      group: "overview",
      description: "Leave empty for ongoing projects.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const start = context.document?.startDate as string | undefined;
          return value && start && value < start
            ? "The end date can’t be before the start date"
            : true;
        }),
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      group: "overview",
      description: "Only one project should be featured at a time.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "overview",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "story",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "about",
      title: "About (paragraphs)",
      type: "array",
      group: "story",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({ name: "purposeHeading", title: "Purpose heading", type: "string", group: "story" }),
    defineField({
      name: "purposeDescription",
      title: "Purpose description",
      type: "text",
      rows: 3,
      group: "story",
    }),
    defineField({
      name: "objectives",
      title: "Objectives",
      type: "array",
      group: "story",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "progressPercentage",
      title: "Progress (%)",
      type: "number",
      group: "progress",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "amountRaised",
      title: "Raised so far (₦)",
      type: "number",
      group: "progress",
      description: "Whole naira, e.g. 4200000. Leave empty if you don’t publish amounts.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "fundingGoal",
      title: "Funding goal (₦)",
      type: "number",
      group: "progress",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      group: "progress",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "completed", title: "Completed", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "label", done: "completed" }, prepare: ({ title, done }) => ({ title, subtitle: done ? "Done" : "Pending" }) },
        }),
      ],
    }),
    defineField({
      name: "banner",
      title: "Banner image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "banner" },
  },
});
