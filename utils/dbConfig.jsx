import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const sql = neon(NEXT_PUBLIC_DATABASE_URL);
const db = drizzle({ client: sql });



