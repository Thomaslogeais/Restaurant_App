import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Creates a Drizzle database client bound to a Neon HTTP connection.
 *
 * @neondatabase/serverless uses HTTP (not raw TCP) so it works in
 * Cloudflare Workers without the `nodejs_compat` WebSocket requirement.
 *
 * Usage in a Hono route handler:
 *   const db = createDb(c.env.DATABASE_URL);
 *   const rows = await db.select().from(schema.restaurants);
 */
export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;
