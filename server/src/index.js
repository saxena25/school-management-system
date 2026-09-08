import 'dotenv/config';
import app, { ensureReady } from './app.js';

const PORT = process.env.PORT || 5001;

async function start() {
  await ensureReady();
  app.listen(PORT, () => {
    console.log(`EduMS API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
