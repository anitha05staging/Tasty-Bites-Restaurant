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
import { verifyConnection } from './services/email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization state
let isDbInitialized = false;
let initializationPromise = null;

// Health check (Bypass DB initialization for pure server check)
app.get('/api/health', async (req, res) => {
    const smtpCheck = req.query.smtp === 'true';
    let smtpStatus = 'not checked';
    
    if (smtpCheck) {
        const check = await verifyConnection();
        smtpStatus = check.success ? 'ok' : `error: ${check.error}`;
    }

    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        dbInitialized: isDbInitialized,
        smtp: smtpStatus,
        timestamp: new Date().toISOString()
    });
});

// Middleware to ensure DB is initialized before handling requests
app.use(async (req, res, next) => {
    if (isDbInitialized) return next();

    // Prevent multiple simultaneous initializations
    if (!initializationPromise) {
        initializationPromise = (async () => {
            console.log('🔄 Starting database initialization...');
            try {
                await sequelize.authenticate();
                console.log('✅ Database connection established successfully.');

                await sequelize.sync({ alter: true });
                const dialect = sequelize.getDialect();
                console.log(`📦 Database synced (Dialect: ${dialect})`);

                // Auto-seed in production or if requested
                if (process.env.NODE_ENV === 'production' || process.env.AUTO_SEED === 'true') {
                    const count = await MenuItem.count();
                    if (count === 0) {
                        console.log('⚠️ Production database empty. Running auto-seed...');
                        await seed(false);
                    } else {
                        console.log(`ℹ️ Database contains ${count} menu items. Skipping seed.`);
                    }
                }
                isDbInitialized = true;
                console.log('✨ Database initialization complete.');
            } catch (err) {
                console.error('❌ Database initialization error:', err);
                initializationPromise = null; // Allow retry on next request
                throw err;
            }
        })();
    }

    try {
        await initializationPromise;
        next();
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error during database startup',
            details: err.message || 'Unknown database error' // Temporarily exposed for production debugging
        });
    }
});

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

// Start server (for local development)
if (process.env.NODE_ENV !== 'production' && !process.env.VITE_VERCEL_ENV) {
    app.listen(PORT, () => {
        console.log(`🚀 Tasty Bites API running on http://localhost:${PORT}`);
    });
}

export default app;
