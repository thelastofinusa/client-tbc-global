import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL. Add it in Vercel → Project → Settings → Environment Variables.",
  );
}

export const db = drizzle(connectionString);
export * from "./schema";
