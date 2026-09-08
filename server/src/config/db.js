import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let memoryServer;

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return { mode: 'external', uri };
  } catch (error) {
    console.warn(
      `Could not connect to ${uri}. Falling back to in-memory MongoDB.`
    );
    console.warn(error.message);

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'edums',
      },
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

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
