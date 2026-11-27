import { defineField, defineType } from "sanity";

/** One document only: edit it from "Site settings" in the Studio sidebar. */
export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "announcement",
      title: "Announcement bar",
      type: "object",
      description:
        "Replaces “Next gathering” in the bar above the header while it’s on.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "enabled",
          title: "Show the announcement",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "message",
          title: "Message",
          type: "string",
          validation: (Rule) =>
            Rule.max(140).custom((value, context) => {
              const parent = context.parent as { enabled?: boolean } | undefined;
              return parent?.enabled && !value ? "Write the message" : true;
            }),
        }),
        defineField({
          name: "linkLabel",
          title: "Link label",
          type: "string",
          description: "Optional, e.g. Learn more",
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description: "Optional. A page like /projects, or a full https:// link.",
          validation: (Rule) =>
            Rule.custom((value) =>
              !value || /^(\/|https:\/\/)/.test(value)
                ? true
                : "Start with / or https://",
            ),
        }),
        defineField({
          name: "expiresAt",
          title: "Hide automatically after",
          type: "datetime",
          description: "Optional. The bar disappears by itself after this time.",
          options: { timeStep: 15 },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
