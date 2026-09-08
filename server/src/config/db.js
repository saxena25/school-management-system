import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1) {
    return { mode: 'external', uri: mongoose.connection.host };
  }

  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel && (!uri || uri.includes('127.0.0.1') || uri.includes('localhost'))) {
    throw new Error(
      'On Vercel, set MONGODB_URI to a MongoDB Atlas connection string (localhost/memory DB is not supported).'
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: onVercel ? 10000 : 2500,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return { mode: 'external', uri };
  } catch (error) {
    if (onVercel) {
      throw error;
    }

    console.warn(
      `Could not connect to ${uri}. Falling back to in-memory MongoDB.`
    );
    console.warn(error.message);

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'edums' },
      binary: {
        version: '6.0.9',
        downloadDir: path.join(__dirname, '../../.mongo-binaries'),
      },
    });
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('MongoDB connected: in-memory (edums)');
    return { mode: 'memory', uri: memoryUri };
  }
}
