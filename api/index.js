import app, { ensureReady } from '../server/src/app.js';

export default async function handler(req, res) {
  await ensureReady();
  return app(req, res);
}
