import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

/**
 * Force IPv4 Resolution for Gmail
 * This bypasses Render's ENETUNREACH IPv6 errors by providing a literal IPv4 string.
 */
async function getIpv4Host(hostname) {
    try {
        const { address } = await dns.lookup(hostname, { family: 4 });
        console.log(`📡 Resolved ${hostname} to IPv4: ${address}`);
        return address;
    } catch (error) {
        console.error(`⚠️ DNS Lookup failed for ${hostname}:`, error.message);
        return hostname; 
    }
}

// Track the actually used host for diagnostics
let resolvedHostUsed = 'not resolved';

const createTransporter = async () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const resolvedHost = await getIpv4Host(host);
    resolvedHostUsed = resolvedHost;
    
    const port = parseInt(process.env.SMTP_PORT || '587');
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

    console.log(`🛠️ Creating transporter: ${resolvedHost}:${port} (Secure: ${isSecure})`);

    return nodemailer.createTransport({
        host: resolvedHost,
        port: port,
        secure: isSecure,
        auth: {
            user: (process.env.SMTP_USER || '').trim(),
            pass: (process.env.SMTP_PASS || '').trim(),
        },
        requireTLS: true,
        pool: false,
        logger: true,
        debug: true,
        family: 4,
        name: 'render.com',
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2',
            servername: host
        },
        connectionTimeout: 45000,
        greetingTimeout: 45000, 
        socketTimeout: 60000,
    });
};

// Initialized transporter instance
let transporterInstance;
const getTransporter = async () => {
    if (!transporterInstance) {
        transporterInstance = await createTransporter();
    }
    return transporterInstance;
};

const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'anitha05staging@gmail.com';

export const sendBookingConfirmation = async (bookingData) => {
    try {
        const t = await getTransporter();
        const { fullName, email, phone, date, time, guests, occasion, specialRequests, referenceNumber } = bookingData;

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcfcfc; padding: 40px 20px; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a2f2b; font-family: 'Times New Roman', Times, serif; font-size: 32px; margin: 0; font-style: italic;">Tasty Bites</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border-top: 4px solid #d9774a;">
                    <p>Hi <strong>${fullName}</strong>, your reservation is confirmed.</p>
                    <p>Reference: #${referenceNumber}</p>
                </div>
            </div>
        `;

        await t.sendMail({
            from: `"Tasty Bites Reservations" <${process.env.SMTP_USER}>`,
            to: email,
            cc: RESTAURANT_EMAIL,
            subject: `Reservation Confirmed - Tasty Bites (#${referenceNumber})`,
            html,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Booking]:", error);
        return false;
    }
};

export const sendContactNotification = async (contactData) => {
    try {
        const t = await getTransporter();
        const { name, email, phone, subject, message } = contactData;
        await t.sendMail({
            from: `"Tasty Bites System" <${process.env.SMTP_USER}>`,
            to: RESTAURANT_EMAIL,
            replyTo: email,
            subject: `[Support] ${subject} - From ${name}`,
            html: `<h3>New Message</h3><p>${message}</p>`,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Contact]:", error);
        return false;
    }
};

export const sendCateringNotification = async (cateringData) => {
    try {
        const t = await getTransporter();
        const { name, email, phone, eventType, eventDate, guests, details } = cateringData;
        await t.sendMail({
            from: `"Tasty Bites System" <${process.env.SMTP_USER}>`,
            to: RESTAURANT_EMAIL,
            replyTo: email,
            subject: `[Catering] New Lead: ${eventType}`,
            html: `<h3>New Catering Enquiry</h3><p>${details}</p>`,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Catering]:", error);
        return false;
    }
};

export const sendOrderConfirmation = async (orderData) => {
    try {
        const t = await getTransporter();
        const { orderId, customerName, customerEmail, totalAmount, status } = orderData;
        
        if (!customerEmail) {
            await t.sendMail({
                from: `"Tasty Bites Orders" <${process.env.SMTP_USER}>`,
                to: RESTAURANT_EMAIL,
                subject: `New Order Notification #${orderId}`,
                html: `<h3>New Order Received</h3><p>Order ID: #${orderId}</p>`,
            });
            return true;
        }

        await t.sendMail({
            from: `"Tasty Bites Orders" <${process.env.SMTP_USER}>`,
            to: customerEmail,
            cc: RESTAURANT_EMAIL,
            subject: `Receipt for your Tasty Bites Order #${orderId}`,
            html: `<h3>Order Confirmed</h3><p>Amount: £${totalAmount}</p>`,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Order]:", error);
        return false;
    }
};

export const verifyConnection = async () => {
    try {
        const t = await getTransporter();
        const start = Date.now();
        await t.verify();
        const latency = Date.now() - start;
        return { 
            success: true, 
            resolvedHost: resolvedHostUsed,
            latency: `${latency}ms`
        };
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            resolvedHost: resolvedHostUsed 
        };
    }
};

export const sendTestEmail = async (targetEmail) => {
    try {
        const t = await getTransporter();
        const info = await t.sendMail({
            from: `"Tasty Bites Test" <${process.env.SMTP_USER}>`,
            to: targetEmail,
            subject: "Tasty Bites - SMTP Functional Test",
            html: `<div style="padding: 20px;"><h2>Success!</h2><p>SMTP is functional at IP: ${resolvedHostUsed}</p></div>`
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export default getTransporter;
