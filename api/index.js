import app, { ensureReady } from '../server/src/app.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function normalizeUrl(req) {
  // Keep original path for Express mounts under /api/*
  const original =
    req.headers['x-forwarded-uri'] ||
    req.headers['x-invoke-path'] ||
    req.originalUrl ||
    req.url ||
    '/';

  let path = String(original).split('?')[0];
  const query = String(original).includes('?')
    ? `?${String(original).split('?')[1]}`
    : (req.url || '').includes('?')
      ? `?${req.url.split('?')[1]}`
      : '';

  // Some Vercel routings deliver "/auth/login" instead of "/api/auth/login"
  if (path === '/api' || path === '/api/index' || path === '/api/index.js') {
    path = '/api';
  } else if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? path : `/${path}`}`;
  }

  req.url = `${path}${query}`;
}

export default async function handler(req, res) {
  try {
    await ensureReady();
    normalizeUrl(req);
    return app(req, res);
  } catch (error) {
    console.error('EduMS API bootstrap failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        message:
          error?.message ||
          'API failed to start. On Vercel, set MONGODB_URI (Atlas), JWT_SECRET, and redeploy.',
      })
    );
  }
}
