import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, MenuItem } from './models/index.js';
import { seed } from './seed.js';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import reservationRoutes from './routes/reservations.js';
import addressRoutes from './routes/addresses.js';
import contactRoutes from './routes/contact.js';
import cateringRoutes from './routes/catering.js';
import testimonialsRoutes from './routes/testimonials.js';
import faqsRoutes from './routes/faqs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/faqs', faqsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Start server
const start = async () => {
    try {
        await sequelize.sync();
        console.log(`📦 Database synced (${process.env.NODE_ENV === 'production' ? 'PostgreSQL' : 'SQLite'})`);

        // Auto-seed in production if database is empty
        if (process.env.NODE_ENV === 'production' || process.env.AUTO_SEED === 'true') {
            const count = await MenuItem.count();
            if (count === 0) {
                console.log('⚠️ Production database empty. Running auto-seed...');
                await seed(false);
            }
        }

        app.listen(PORT, () => {
            console.log(`🚀 Tasty Bites API running on http://localhost:${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Server startup error:', err);
        process.exit(1);
    }
};

// Start server if run directly
if (process.env.NODE_ENV !== 'production' || process.env.VITE_VERCEL_ENV !== 'production') {
    start();
}

export default app;
