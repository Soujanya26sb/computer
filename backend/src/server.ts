import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection } from './config/db';
import { env, uploadAbsolutePath } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// ---------------------------------------------------------------------
// Security & core middleware
// ---------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------
// Static file serving for uploaded product images
// ---------------------------------------------------------------------
app.use('/uploads', express.static(uploadAbsolutePath));

// ---------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Computer Shop API is running' });
});

// ---------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------
app.use('/api', routes);

// ---------------------------------------------------------------------
// 404 + global error handling
// ---------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await testConnection();
    // eslint-disable-next-line no-console
    console.log('Connected to MySQL database');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MySQL database:', err);
    process.exit(1);
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Computer Shop API listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

start();

export default app;
