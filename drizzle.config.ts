import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  dialect: "postgresql", // Add this line
  driver: "pg", // Ensure this is correct for your setup
  schema: "./utils/schema.jsx",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
} satisfies Config;


//drizzle configuration is not working 