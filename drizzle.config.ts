import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  schemaFilter: "public",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});


// tryed to fix drizzle error but not solved