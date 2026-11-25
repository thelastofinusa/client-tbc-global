/**
 * One-time starter content for Sanity: the weekly services and the seven
 * expressions. Safe to run again, it never overwrites edits you make in Studio.
 *
 *   bun scripts/seed-sanity.ts
 *
 * Needs SANITY_API_WRITE_TOKEN (sanity.io/manage → your project → API → Tokens
 * → Add token → "Editor"). Bun reads .env.local automatically.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN first.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const slug = (current: string) => ({ _type: "slug", current });

const services = [
  {
    _id: "service-sunday",
    name: "Sunday Service",
    slug: "sunday-service",
    kind: "weekly",
    day: "Sunday",
    time: "9:00 AM",
    expected: 0,
    description:
      "Our primary weekly gathering: worship, the Word, prayer and fellowship for the whole family.",
    featured: true,
    order: 1,
  },
  {
    _id: "service-wednesday",
    name: "Midweek Service",
    slug: "midweek-service",
    kind: "weekly",
    day: "Wednesday",
    time: "To be confirmed",
    expected: 0,
    description: "Midweek teaching, prayer and encouragement.",
    featured: false,
    order: 2,
  },
  {
    _id: "service-saturday",
    name: "Saturday Gathering",
    slug: "saturday-gathering",
    kind: "weekly",
    day: "Saturday",
    time: "To be confirmed",
    expected: 0,
    description: "Fellowship, preparation and community outreach.",
    featured: false,
    order: 3,
  },
];

const expressions = [
  [
    "School of Destiny",
    "school-of-destiny",
    "A discipleship and leadership development platform raising people for purpose.",
  ],
  [
    "School Invasion Programme",
    "school-invasion-programme",
    "Taking the gospel, prayer and godly values into schools and campuses.",
  ],
  [
    "ITYAC",
    "ityac",
    "A gathering designed for spiritual awakening, alignment and advancement.",
  ],
  [
    "Sound and Beyond Worship Meeting",
    "sound-and-beyond",
    "A worship expression creating an atmosphere for spiritual encounters.",
  ],
  [
    "3 Nights of Mercy",
    "three-nights-of-mercy",
    "A gathering dedicated to prayer, the ministry of the word, and encounters with God’s mercy.",
  ],
  [
    "Campus Fellowship - Minna",
    "campus-fellowship-minna",
    "A campus-based expression reaching students with the gospel, building spiritual communities and raising a generation aligned with Christ.",
  ],
  [
    "Weekly Services",
    "weekly-services",
    "Our regular corporate gathering for worship, the Word, prayer and fellowship.",
  ],
].map(([title, s, tagline], index) => ({
  _id: `expression-${s}`,
  _type: "expression",
  title,
  slug: slug(s as string),
  tagline,
  order: index + 1,
}));

async function main() {
  const tx = client.transaction();
  for (const service of services) {
    tx.createIfNotExists({
      ...service,
      _type: "service",
      slug: slug(service.slug),
      location: "Kudenda, Kaduna",
    });
  }
  for (const expression of expressions) tx.createIfNotExists(expression);

  await tx.commit();
  console.log(
    `Seeded ${services.length} services and ${expressions.length} expressions.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
