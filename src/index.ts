import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';
import analyticsRoutes from './routes/analytics';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/authenticate';

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://expense-tracking-frontend-beta.vercel.app',
  'http://localhost:5173', // for local dev (optional)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));