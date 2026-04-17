import mongoose from 'mongoose';

/**
 * Resolves the MongoDB URI based on NODE_ENV.
 */
function getMongoUri(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const uri = isProd ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

  if (!uri) {
    throw new Error(`MONGO_URI_${isProd ? 'PROD' : 'DEV'} is not defined in .env`);
  }
  return uri;
}

/**
 * Connects to MongoDB via Mongoose with standard options.
 */
export async function connectToDatabase(): Promise<void> {
  try {
    const uri = getMongoUri();
    const isDev = process.env.NODE_ENV === 'development';
    
    console.log(`🔗 [DB] Mode: ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'}`);

    await mongoose.connect(uri);
    console.log('Connected to MongoDB via Mongoose');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

/**
 * Handles graceful connection closure.
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error during database disconnection:', error);
  }
}
