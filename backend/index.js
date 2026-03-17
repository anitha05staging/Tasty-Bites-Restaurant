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
import categoryRoutes from './routes/categories.js';
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

// Root landing page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tasty Bites API | Status</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #1a2f2b 0%, #0d1a18 100%);
                    color: #f0e6d2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .container {
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 24px;
                    border: 1px solid rgba(217, 119, 74, 0.2);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 90%;
                }
                h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin: 0;
                    color: #d9774a;
                    font-style: italic;
                }
                p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                    margin: 20px 0;
                }
                .status-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    background: #1e8e3e;
                    color: white;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                }
                .links {
                    margin-top: 30px;
                }
                a {
                    color: #a4b4b0;
                    text-decoration: none;
                    font-size: 0.9rem;
                    margin: 0 10px;
                    transition: color 0.3s;
                }
                a:hover {
                    color: #d9774a;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Tasty Bites</h1>
                <p>Premium Restaurant Management API</p>
                <div class="status-badge">SYSTEMS OPERATIONAL</div>
                <div class="links">
                    <a href="/api/health">Health Check</a>
                    <a href="/api/health?smtp=true">Verify Email</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Health check (Bypass DB initialization for pure server check)
app.get('/api/health', async (req, res) => {
    // Permissive check: if 'smtp' is anywhere in the query string
    const queryStr = JSON.stringify(req.query).toLowerCase();
    const smtpCheck = queryStr.includes('smtp');
    let smtpStatus = 'not checked';
    
    if (smtpCheck) {
        console.log('🔍 Manual SMTP check requested...');
        const user = process.env.SMTP_USER || 'NOT SET';
        console.log(`📧 SMTP User: ${user.substring(0, 3)}***${user.substring(user.indexOf('@'))}`);

        // Add a 10s timeout to the SMTP check to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SMTP Verification Timeout')), 10000)
        );
        
        try {
            const checkResult = await Promise.race([verifyConnection(), timeoutPromise]);
            smtpStatus = checkResult.success ? 'ok' : `error: ${checkResult.error}`;
        } catch (error) {
            console.error('❌ SMTP Check failed/timed out:', error.message);
            smtpStatus = `timeout/error: ${error.message}`;
        }
    }

    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        dbInitialized: isDbInitialized,
        smtp: smtpStatus,
        smtpConfig: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || '587',
            userSet: !!process.env.SMTP_USER,
            passSet: !!process.env.SMTP_PASS
        },
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
app.use('/api/categories', categoryRoutes);

// Start server
if (!process.env.VITE_VERCEL_ENV) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Tasty Bites API running on port ${PORT}`);
    });
}

export default app;
