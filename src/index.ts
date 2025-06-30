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
app.use(cors({
  origin: "https://expense-tracking-frontend-beta.vercel.app", // or "*"
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));