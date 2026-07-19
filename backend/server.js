import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const app = express();
const port = process.env.PORT || 4000;

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allows requests from the Vercel frontend URL in production and localhost
// during development. The FRONTEND_URL env var must be set on Render.
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173', // vite preview
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import billRoutes from './routes/billRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bills', billRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'SpendWise API is running.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});