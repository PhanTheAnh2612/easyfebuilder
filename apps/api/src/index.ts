import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes.js';
import { templatesRouter } from './routes/templates.js';
import { pagesRouter } from './routes/pages.js';
import { customizationsRouter } from './routes/customizations.js';
import { aiRouter } from './routes/ai.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/customizations', customizationsRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

export default app;
