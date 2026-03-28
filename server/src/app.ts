import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import aiRoutes from './routes/ai';
import doctorsRoutes from './routes/doctors';
import weatherRoutes from './routes/weather';
import dossierRoutes from './routes/dossier';
import speechRoutes from './routes/speech';
import { apiLimiter, aiLimiter } from './middleware/rateLimiter';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://maps.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://maps.googleapis.com', 'https://maps.gstatic.com'],
      connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'https://places.googleapis.com', 'https://weather.googleapis.com', 'https://maps.googleapis.com'],
    },
  },
}));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

app.use('/api', apiLimiter);

app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/dossier', dossierRoutes);
app.use('/api/speech', aiLimiter, speechRoutes);

// Serve React client in production
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
app.get('{*path}', (_req, res, next) => {
  if (_req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === 'entity.too.large') {
    console.warn(`[ERROR] Payload too large — ${err.length} bytes (limit: ${err.limit})`);
    res.status(413).json({ error: 'Payload too large.' });
    return;
  }
  console.error('[ERROR] Unhandled server error:', err.message || err);
  res.status(500).json({ error: 'Internal Server Error. Safe fallback triggered.' });
});

export default app;
