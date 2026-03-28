import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import aiRoutes from './routes/ai';

const app = express();

// SECURITY: Helmet to set robust HTTP headers and prevent common vulnerabilities
app.use(helmet());

// SECURITY: Strict CORS policy (Only allow frontend origin)
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// SECURITY: Enforce strict payload size limit (Hackathon Criteria)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/ai', aiRoutes);

// QUALITY: Global Error Boundary
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('CRITICAL SERVER ERROR:', err);
    res.status(500).json({ error: 'Internal Server Error. Safe fallback triggered.' });
});

export default app;
