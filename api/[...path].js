import app, { ensureReady } from '../server/src/app.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    await ensureReady();
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
