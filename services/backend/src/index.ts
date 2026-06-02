import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { menuRouter } from './routes/menu';
import { ordersRouter } from './routes/orders';
import { customersRouter } from './routes/customers';
import { settingsRouter } from './routes/settings';
import { statsRouter } from './routes/stats';
import type { AppEnv } from './lib/env';

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------
const app = new OpenAPIHono<AppEnv>();

// ---------------------------------------------------------------------------
// CORS — allow all localhost origins for development.
// In production, set CORS_ORIGIN env var to the deployed dashboard URL.
// ---------------------------------------------------------------------------
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow same-origin requests (no Origin header) and all localhost ports
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return origin ?? '*';
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

// ---------------------------------------------------------------------------
// Health check (outside /api prefix — useful for load balancer checks)
// ---------------------------------------------------------------------------
app.get('/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// ---------------------------------------------------------------------------
// /api sub-app — all business routes live here
// ---------------------------------------------------------------------------
const api = new OpenAPIHono<AppEnv>();

api.route('/', menuRouter);
api.route('/', ordersRouter);
api.route('/', customersRouter);
api.route('/', settingsRouter);
api.route('/', statsRouter);

app.route('/api', api);

// ---------------------------------------------------------------------------
// OpenAPI spec — served at /openapi.json
// Orval reads this file to generate the typed frontend client + hooks.
// ---------------------------------------------------------------------------
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant API',
    version: '1.0.0',
    description: [
      'Restaurant operations API.',
      'Schema auto-generated: Drizzle schema → drizzle-zod → @hono/zod-openapi → /openapi.json → Orval.',
    ].join(' '),
  },
  servers: [
    { url: 'http://localhost:8787', description: 'Local (wrangler dev)' },
  ],
  tags: [
    { name: 'menu', description: 'Menu categories and items' },
    { name: 'orders', description: 'Order lifecycle and state machine' },
    { name: 'customers', description: 'Customer CRM' },
    { name: 'settings', description: 'Ordering settings' },
    { name: 'stats', description: 'Home screen KPIs' },
  ],
});

// ---------------------------------------------------------------------------
// Swagger UI — available at /docs during development
// ---------------------------------------------------------------------------
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

export default app;
