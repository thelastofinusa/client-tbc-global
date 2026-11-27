import { defineField, defineType } from "sanity";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

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
        "Attendance records use this. Don’t change it after check-ins start.",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Weekly (repeats every week)", value: "weekly" },
          { title: "Special event (one date)", value: "special" },
        ],
        layout: "radio",
      },
      initialValue: "weekly",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "weekday",
      title: "Day of the week",
      type: "string",
      options: { list: WEEKDAYS },
      hidden: ({ document }) => document?.kind !== "weekly",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.document?.kind === "weekly" && !value
            ? "Pick the day this service happens"
            : true,
        ),
    }),
    defineField({
      name: "startTime",
      title: "Start time",
      type: "string",
      description:
        "24-hour clock, e.g. 09:00 or 17:30. (Sanity has no time-only field, so this is checked for you.)",
      hidden: ({ document }) => document?.kind !== "weekly",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind !== "weekly") return true;
          if (!value) return "Enter the start time, e.g. 09:00";
          return CLOCK.test(value) ? true : "Use HH:mm, e.g. 09:00";
        }),
    }),
    defineField({
      name: "endTime",
      title: "End time",
      type: "string",
      description: "Optional. Same format, e.g. 11:30.",
      hidden: ({ document }) => document?.kind !== "weekly",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || CLOCK.test(value) ? true : "Use HH:mm, e.g. 11:30",
        ),
    }),
    defineField({
      name: "startsAt",
      title: "Date and time",
      type: "datetime",
      options: { timeStep: 15 },
      hidden: ({ document }) => document?.kind !== "special",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.document?.kind === "special" && !value
            ? "Pick the date and time of the event"
            : true,
        ),
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
      description: "Shown in the top bar, the home page and the Services hero.",
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
    select: {
      title: "name",
      day: "weekday",
      time: "startTime",
      at: "startsAt",
    },
    prepare: ({ title, day, time, at }) => ({
      title,
      subtitle: day ? [day, time].filter(Boolean).join(" · ") : at,
    }),
  },
});
