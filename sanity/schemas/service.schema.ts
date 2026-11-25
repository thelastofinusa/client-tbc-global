import { defineField, defineType } from "sanity";

export const serviceSchema = defineType({
  name: "service",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Sunday Service",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Used by attendance records. Don’t change it after check-ins start.",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Weekly", value: "weekly" },
          { title: "Special event", value: "special" },
        ],
        layout: "radio",
      },
      initialValue: "weekly",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      description: "Weekly: “Sunday”. Special event: a date label.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "e.g. 9:00 AM",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "Kudenda, Kaduna",
    }),
    defineField({
      name: "expected",
      title: "Expected attendance",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featured",
      title: "Highlight on the website",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first.",
    }),
  ],
  preview: {
    select: { title: "name", day: "day", time: "time" },
    prepare: ({ title, day, time }) => ({
      title,
      subtitle: [day, time].filter(Boolean).join(" · "),
    }),
  },
});
