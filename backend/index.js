import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, isDbInitialized } from './config/database.js';
import { User } from './models/index.js';
import reservationRoutes from './routes/reservations.js';
import contactRoutes from './routes/contact.js';
import cateringRoutes from './routes/catering.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import addressRoutes from './routes/addresses.js';
import faqRoutes from './routes/faqs.js';
import menuRoutes from './routes/menu.js';
import testimonialRoutes from './routes/testimonials.js';
import restaurantRoutes from './routes/restaurant.js';
import tableRoutes from './routes/tables.js';
import staffRoutes from './routes/staff.js';
import { verifyConnection, sendTestEmail } from './services/email.js';
import { seed } from './seed.js';
import dns from 'node:dns';

// Force IPv4 globally for older modules (like Axios/Nodemailer if they don't honor the family opt)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists for production (Render ephemeral storage)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Main Dashboard Landing Page
app.get('/', (req, res) => {
    const frontendUrl = (process.env.FRONTEND_URL || 'https://tasty-bites-restaurant-ten.vercel.app').replace(/\/$/, "");
    const adminUrl = process.env.ADMIN_URL || `${frontendUrl}/admin`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tasty Bites | API Dashboard</title>
            <style>
                :root {
                    --bg: #0f1715;
                    --text: #e0e6e4;
                    --accent: #d9774a;
                    --card: rgba(255, 255, 255, 0.05);
                    --success: #4ade80;
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: var(--bg);
                    color: var(--text);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    overflow: hidden;
                }
                .container {
                    width: 95%;
                    max-width: 900px;
                    text-align: center;
                    position: relative;
                }
                .glass {
                    background: var(--card);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 50px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }
                .logo {
                    font-size: 48px;
                    font-family: 'Times New Roman', serif;
                    font-style: italic;
                    color: var(--accent);
                    margin: 0 0 10px 0;
                    letter-spacing: -1px;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(74, 222, 128, 0.1);
                    color: var(--success);
                    padding: 6px 16px;
                    border-radius: 100px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 30px;
                    border: 1px solid rgba(74, 222, 128, 0.2);
                }
                .status-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--success);
                    border-radius: 50%;
                    margin-right: 10px;
                    box-shadow: 0 0 10px var(--success);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 15px;
                    margin-top: 40px;
                }
                .card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .card:hover {
                    background: rgba(217, 119, 74, 0.1);
                    border-color: var(--accent);
                    transform: translateY(-5px);
                }
                .card.primary {
                    background: rgba(217, 119, 74, 0.05);
                    border-color: rgba(217, 119, 74, 0.2);
                }
                .card h3 { margin: 0 0 10px 0; font-size: 14px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
                .card p { margin: 0; font-size: 12px; color: #888; }
                .footer {
                    margin-top: 40px;
                    font-size: 12px;
                    color: #555;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="glass">
                    <div class="logo">Tasty Bites</div>
                    <div class="status-badge">
                        <div class="status-pulse"></div>
                        SYSTEM OPERATIONAL
                    </div>
                    <p style="color: #888; margin-bottom: 20px;">Innovative API Infrastructure for Premium Dining</p>
                    
                    <div class="grid">
                        <a href="${frontendUrl}" target="_blank" class="card primary">
                            <h3>Frontend App</h3>
                            <p>Live Customer Site</p>
                        </a>
                        <a href="${adminUrl}" target="_blank" class="card primary">
                            <h3>Admin Panel</h3>
                            <p>Management Console</p>
                        </a>
                        <a href="/api/health?smtp=true" class="card">
                            <h3>Diagnostics</h3>
                            <p>System & SMTP Health</p>
                        </a>
                        <a href="/api/health/test-email" class="card">
                            <h3>Email Test</h3>
                            <p>Verify SMTP Delivery</p>
                        </a>
                    </div>
                </div>
                <div class="footer">
                    PRODUCTION ENVIRONMENT • SSL SECURE • V3.1.0
                </div>
            </div>
        </body>
        </html>
    `);
});

// Health check with 60s timeout
app.get('/api/health', async (req, res) => {
    const queryStr = JSON.stringify(req.query).toLowerCase();
    const smtpCheck = queryStr.includes('smtp');
    let smtpStatus = 'not checked';
    let smtpMeta = {};
    
    if (smtpCheck) {
        // Add a 60s timeout to the health check wrapper
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SMTP Verification Timeout (60s)')), 60000)
        );
        
        try {
            const checkResult = await Promise.race([verifyConnection(), timeoutPromise]);
            smtpStatus = checkResult.success ? 'ok' : `error: ${checkResult.error}`;
            smtpMeta = {
                resolvedHost: checkResult.resolvedHost,
                latency: checkResult.latency
            };
        } catch (error) {
            smtpStatus = `timeout/error: ${error.message}`;
        }
    }

    return res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'production',
        dbInitialized: isDbInitialized,
        smtp: smtpStatus,
        smtpDiagnostics: smtpMeta,
        config: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || '587',
            secure: process.env.SMTP_SECURE || 'false',
        },
        timestamp: new Date().toISOString()
    });
});

// Direct Test Email Endpoint
app.get('/api/health/test-email', async (req, res) => {
    const target = req.query.to || process.env.SMTP_USER;
    if (!target) {
        return res.status(400).json({ error: 'No target email provided and SMTP_USER not set' });
    }

    const result = await sendTestEmail(target);
    if (result.success) {
        return res.json({ 
            status: 'success', 
            message: `Test email sent successfully to ${target}`,
            messageId: result.messageId
        });
    } else {
        return res.status(500).json({ 
            status: 'error', 
            error: result.error 
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/staff', staffRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(`🚨 [INTERNAL_SERVER_ERROR] ${req.method} ${req.path}:`, err);
    console.error('Req Body:', req.body);
    console.error('Stack Trace:', err.stack);
    
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message,
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

db.sync({ alter: true }).then(async () => {
    console.log('✅ Database synced successfully');
    
    // Check if we need to seed the database (only if no users exist)
    try {
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('🌱 No users found. Auto-seeding initial data...');
            await seed(false);
        }

        // Data Patch: Ensure Table 3 is 'Balcony'
        const { Table } = await import('./models/index.js');
        const [updatedRows] = await Table.update(
            { location: 'Balcony' },
            { where: { number: '3' } }
        );
        if (updatedRows > 0) {
            console.log('🛋️ Production Data Patch: Table 3 updated to Balcony');
        }
    } catch (seedErr) {
        console.error('⚠️ Auto-seed or data patch check failed:', seedErr);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Tasty Bites API running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});
