import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle(sql);

