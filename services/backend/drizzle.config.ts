import type { Config } from 'drizzle-kit';

// DATABASE_URL is read from the environment (set in .dev.vars locally,
// or as a Cloudflare Workers secret in production).
export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
