import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seed.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import knowledgeCheckRoutes from './routes/knowledgeCheckRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import examRoutes from './routes/examRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'https://school-management-system-zeta-eight.vercel.app',
];

const allowedOrigins = [
  ...new Set([
    ...defaultOrigins,
    ...(process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
      : []),
  ]),
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow Vercel preview deployments for this project
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'school-management-system-zeta-eight.vercel.app' ||
      /^school-management-system(-[a-z0-9-]+)?-.*\.vercel\.app$/i.test(hostname)
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'EduMS API',
      time: new Date().toISOString(),
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/knowledge-checks', knowledgeCheckRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  const connection = await connectDB(process.env.MONGODB_URI);
  if (process.env.SEED_ON_START === 'true' || connection.mode === 'memory') {
    await seedDatabase({ force: connection.mode === 'memory' });
  }

  app.listen(PORT, () => {
    console.log(`EduMS API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
