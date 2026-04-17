import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './database/connection.js';
import logger from './middlewares/middleware.js';
import bookRoutes from './routes/bookRoutes.js'
import * as bookController from './controllers/bookController.js';
import { disconnectFromDatabase } from './database/connection.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Static Assets
app.use(express.static('dist/client'));

// Middlewares
app.use(express.json());
app.use(logger);

/** API Configuration Endpoint */
const envPort = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV === 'development';

app.get('/config', (req, res) => {
  const apiBaseUrl = isDev
    ? '/api'
    : `https://${process.env.DOMAIN_NAME?.replace('https://', '')}/api`;

  res.json({
    apiUrl: apiBaseUrl,
    isDev: isDev,
  });
});

/** Server Initialization */
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(envPort, () => {
      console.log(`🚀 [Server] Running at: ${isDev ? 'http://localhost:' + envPort : 'https://' + process.env.DOMAIN_NAME?.replace('https://', '')}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Specific API Routes (Maintenance & Bulk)
app.post('/api/seed', bookController.seedBooks);
app.get('/api/all', bookController.getAllBooks);

// Resource Routes (Handled by bookRoutes)
app.use('/api', bookRoutes);

// API 404 (Specific to /api prefix)
app.use('/api', notFoundHandler);

app.get(/.*/, (req, res) => {
  res.status(404).sendFile('dist/client/404.html', { root: '.' });
});

app.use(errorHandler);

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  disconnectFromDatabase();
});

startServer();