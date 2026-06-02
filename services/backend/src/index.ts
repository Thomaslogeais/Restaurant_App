import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

// ---------------------------------------------------------------------------
// Bindings — Cloudflare Worker environment variables / secrets
// ---------------------------------------------------------------------------
export type Bindings = {
  DATABASE_URL: string;
};

// ---------------------------------------------------------------------------
// App factory
// ---------------------------------------------------------------------------
const app = new OpenAPIHono<{ Bindings: Bindings }>();

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// OpenAPI spec — served at /openapi.json
// This is the contract consumed by Orval to generate the frontend client.
// ---------------------------------------------------------------------------
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant API',
    version: '1.0.0',
    description:
      'Restaurant operations API — schema auto-generated from Drizzle + drizzle-zod via @hono/zod-openapi.',
  },
  servers: [
    { url: 'http://localhost:8787', description: 'Local (wrangler dev)' },
  ],
});

// ---------------------------------------------------------------------------
// Swagger UI — available at /docs during development
// ---------------------------------------------------------------------------
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// ---------------------------------------------------------------------------
// Routes will be registered here in Milestone 3
// import { ordersRouter }        from './routes/orders';
// import { menuItemsRouter }     from './routes/menu-items';
// import { menuCategoriesRouter } from './routes/menu-categories';
// import { customersRouter }     from './routes/customers';
// import { restaurantsRouter }   from './routes/restaurants';
// import { orderingSettingsRouter } from './routes/ordering-settings';
// import { statsRouter }         from './routes/stats';
// ---------------------------------------------------------------------------

export default app;
