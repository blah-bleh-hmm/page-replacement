import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/simulations.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/simulations', simulationRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  if (res.headersSent) {
    return _next(err);
  }
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
