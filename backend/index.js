import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, isDbInitialized } from './config/database.js';
import reservationRoutes from './routes/reservations.js';
import contactRoutes from './routes/contact.js';
import cateringRoutes from './routes/catering.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import { verifyConnection, sendTestEmail } from './services/email.js';
import dns from 'node:dns';

// Force IPv4 globally for older modules (like Axios/Nodemailer if they don't honor the family opt)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Dashboard Landing Page
app.get('/', (req, res) => {
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
                    width: 90%;
                    max-width: 800px;
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
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
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
                }
                .card:hover {
                    background: rgba(217, 119, 74, 0.1);
                    border-color: var(--accent);
                    transform: translateY(-5px);
                }
                .card h3 { margin: 0 0 10px 0; font-size: 15px; color: var(--accent); }
                .card p { margin: 0; font-size: 13px; color: #888; }
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
                        <a href="/api/health?smtp=true" class="card">
                            <h3>Diagnostics</h3>
                            <p>System & SMTP Health</p>
                        </a>
                        <a href="/api/health/test-email" class="card">
                            <h3>Email Test</h3>
                            <p>Verify SMTP Delivery</p>
                        </a>
                        <a href="/api/categories" class="card">
                            <h3>Inventory</h3>
                            <p>Digital Menu Data</p>
                        </a>
                    </div>
                </div>
                <div class="footer">
                    PRODUCTION ENVIRONMENT • SSL SECURE • V3.0.0
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

app.use('/api/bookings', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

db.sync({ alter: true }).then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
        console.log(`🚀 Tasty Bites API running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});
