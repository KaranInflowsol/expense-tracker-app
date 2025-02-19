import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Create a new Pool instance with the connection string
const pool = new Pool({ connectionString: process.env.NEXT_PUBLIC_DATABASE_URL });

// Use the pool with drizzle
export const db = drizzle(pool);