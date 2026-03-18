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
            <title>Tasty Bites | API Professional Dashboard</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --accent: #d9774a;
                    --bg: #0d1a18;
                    --glass: rgba(255, 255, 255, 0.03);
                }
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #1a2f2b 0%, var(--bg) 100%);
                    color: #f0e6d2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .dashboard {
                    background: var(--glass);
                    backdrop-filter: blur(15px);
                    border-radius: 32px;
                    border: 1px solid rgba(217, 119, 74, 0.15);
                    padding: 50px;
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                    text-align: center;
                }
                .logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5rem;
                    color: var(--accent);
                    margin-bottom: 5px;
                    font-style: italic;
                    letter-spacing: -1px;
                }
                .subtitle {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    opacity: 0.6;
                    margin-bottom: 40px;
                }
                .status-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 40px;
                }
                .pulse {
                    width: 10px;
                    height: 10px;
                    background: #1e8e3e;
                    border-radius: 50%;
                    box-shadow: 0 0 0 rgba(30, 142, 62, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(30, 142, 62, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(30, 142, 62, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(30, 142, 62, 0); }
                }
                .status-label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #4cd964;
                }
                .endpoints {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 30px;
                }
                .card {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 20px;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .card:hover {
                    background: rgba(217, 119, 74, 0.1);
                    border-color: var(--accent);
                    transform: translateY(-5px);
                }
                .card i { font-size: 1.2rem; display: block; }
                .card span { font-size: 0.8rem; font-weight: 600; }
                .card small { font-size: 0.7rem; opacity: 0.5; }
                
                .footer {
                    margin-top: 40px;
                    font-size: 0.75rem;
                    opacity: 0.4;
                }
            </style>
        </head>
        <body>
            <div class="dashboard">
                <div class="logo">Tasty Bites</div>
                <div class="subtitle">API INFRASTRUCTURE</div>
                
                <div class="status-container">
                    <div class="pulse"></div>
                    <div class="status-label">FULLY OPERATIONAL</div>
                </div>

                <div class="endpoints">
                    <a href="/api/health" class="card">
                        <span>🛰️ CORE HEALTH</span>
                        <small>System diagnostics</small>
                    </a>
                    <a href="/api/health?smtp=true" class="card">
                        <span>📧 SMTP SENSOR</span>
                        <small>Email verify link</small>
                    </a>
                    <a href="https://tasty-bites-restaurant-ten.vercel.app/" target="_blank" class="card">
                        <span>🌐 CLIENT UI</span>
                        <small>Public Website</small>
                    </a>
                    <a href="https://tasty-bites-restaurant-ten.vercel.app/admin" target="_blank" class="card">
                        <span>🛡️ ADMIN PANEL</span>
                        <small>Management Suite</small>
                    </a>
                </div>

                <div class="footer">
                    PRODUCTION ENVIRONMENT • SSL SECURE • V2.1.0
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

        // Add a 30s timeout to the SMTP check to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SMTP Verification Timeout (30s)')), 30000)
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
            service: 'gmail',
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
