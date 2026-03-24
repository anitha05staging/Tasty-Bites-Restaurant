import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

// Initialize SendGrid if API Key is present
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid HTTP API Initialized');
}

/**
 * Force IPv4 Resolution for Gmail SMTP Fallback
 */
async function getIpv4Host(hostname) {
    try {
        const { address } = await dns.lookup(hostname, { family: 4 });
        return address;
    } catch (error) {
        return hostname; 
    }
}

let resolvedHostUsed = 'not resolved';
let transporterInstance;

const createTransporter = async () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const resolvedHost = await getIpv4Host(host);
    resolvedHostUsed = resolvedHost;
    
    const port = parseInt(process.env.SMTP_PORT || '587');
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
        host: resolvedHost,
        port: port,
        secure: isSecure,
        auth: {
            user: (process.env.SMTP_USER || '').trim(),
            pass: (process.env.SMTP_PASS || '').trim(),
        },
        requireTLS: true,
        family: 4,
        tls: { rejectUnauthorized: false, servername: host },
        connectionTimeout: 10000, 
    });
};

const getTransporter = async () => {
    if (!transporterInstance) {
        transporterInstance = await createTransporter();
    }
    return transporterInstance;
};

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@tastybites.com';
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'tastybitesrestaurant7@gmail.com';

/**
 * Premium Email Template Wrapper
 */
const getPremiumTemplate = (title, content, footer = "Thank you for choosing Tasty Bites!") => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
        body { font-family: 'Outfit', 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #d9774a 0%, #c2410c 100%); padding: 60px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; font-style: italic; letter-spacing: -0.5px; }
        .content { padding: 40px; line-height: 1.6; }
        .content h2 { color: #d9774a; margin-top: 0; font-size: 24px; }
        .details-box { background: #f1f5f9; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0; }
        .detail-row { margin-bottom: 8px; display: flex; justify-content: space-between; }
        .detail-label { font-weight: 600; color: #64748b; }
        .detail-value { color: #0f172a; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 14px 32px; background: #d9774a; color: #ffffff; text-decoration: none; border-radius: 100px; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(217, 119, 74, 0.4); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Tasty Bites</h1></div>
        <div class="content">
            <h2>${title}</h2>
            ${content}
        </div>
        <div class="footer">
            <p>${footer}</p>
            <p>&copy; ${new Date().getFullYear()} Tasty Bites Restaurant. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Universal Email Sender (HTTP API Priority, SMTP Fallback)
 */
const sendEmail = async (options) => {
    const { to, subject, html, cc, replyTo } = options;

    if (!to) {
        console.error("❌ EMAIL ERROR: Unspecified 'to' address. Check payload data.");
        return { success: false, error: "Recipient 'to' address is missing." };
    }

    console.log(`📡 Attempting delivery to: ${to} | Subject: ${subject}`);

    // 1. Try SendGrid HTTP API first (Bypasses Render Block)
    if (SENDGRID_API_KEY) {
        try {
            const msg = {
                to,
                from: FROM_EMAIL,
                subject,
                html,
                cc,
                replyTo,
                mailSettings: {
                    sandbox_mode: { enable: false },
                    spam_check: { enable: true }
                },
                trackingSettings: {
                    click_tracking: { enable: false },
                    open_tracking: { enable: false }
                }
            };
            const [response] = await sgMail.send(msg);
            console.log(`🚀 Email delivered via SendGrid API to ${to}`);
            return { success: true, method: 'sendgrid', messageId: response.headers['x-message-id'] };
        } catch (error) {
            const errorBody = error.response ? error.response.body : null;
            const errorMessage = errorBody ? JSON.stringify(errorBody) : error.message;
            console.error('❌ SendGrid API Error:', errorMessage);
            
            if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
                return { success: false, error: `SendGrid API Error: ${errorMessage}. (SMTP Fallback skipped on Render)` };
            }
        }
    }

    // 2. Fallback to SMTP (Local Dev)
    try {
        const t = await getTransporter();
        const info = await t.sendMail({
            from: `"Tasty Bites" <${FROM_EMAIL}>`,
            to,
            cc,
            replyTo,
            subject,
            html,
            headers: {
                'Precedence': 'bulk',
                'X-Auto-Response-Suppress': 'OOF, AutoReply',
                'List-Unsubscribe': `<mailto:${FROM_EMAIL}?subject=unsubscribe>`
            }
        });
        console.log(`📧 Email delivered via SMTP to ${to}`);
        return { success: true, method: 'smtp', messageId: info.messageId };
    } catch (error) {
        console.error("❌ Final Email Fallback Error:", error.message);
        return { success: false, error: error.message };
    }
};

export const sendBookingConfirmation = async (bookingData) => {
    const { fullName, email, phone, date, time, guests, occasion, referenceNumber } = bookingData;
    
    console.log(`[Diagnostic] Preparing booking email for: ${email}`, { referenceNumber, fullName });

    const content = `
        <p>Dear ${fullName},</p>
        <p>Your table has been successfully reserved! We're excited to host you at Tasty Bites.</p>
        <div class="details-box">
            <div class="detail-row"><span class="detail-label">Booking Ref:</span> <span class="detail-value">#${referenceNumber}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span> <span class="detail-value">${date}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span> <span class="detail-value">${time}</span></div>
            <div class="detail-row"><span class="detail-label">Guests:</span> <span class="detail-value">${guests}</span></div>
            ${occasion && occasion !== 'None' ? `<div class="detail-row"><span class="detail-label">Occasion:</span> <span class="detail-value">${occasion}</span></div>` : ''}
        </div>
        <p>If you need to change your reservation, please contact us at ${FROM_EMAIL}.</p>
    `;

    const html = getPremiumTemplate("Reservation Confirmed", content);
    return await sendEmail({ to: email, subject: `Booking Confirmed #${referenceNumber}`, html, cc: RESTAURANT_EMAIL });
};

export const sendContactNotification = async (contactData) => {
    const { name, email, subject, message } = contactData;
    const content = `
        <p>You have received a new message from the website contact form:</p>
        <div class="details-box">
            <div class="detail-row"><span class="detail-label">From:</span> <span class="detail-value">${name} (${email})</span></div>
            <div class="detail-row"><span class="detail-label">Subject:</span> <span class="detail-value">${subject}</span></div>
        </div>
        <p><strong>Message:</strong><br/>${message}</p>
    `;
    const html = getPremiumTemplate("New Contact Inquiry", content);
    return await sendEmail({ 
        to: RESTAURANT_EMAIL, 
        replyTo: email,
        subject: `[Internal Support] ${subject} - ${name}`, 
        html
    });
};

export const sendCateringNotification = async (cateringData) => {
    const { name, email, phone, eventType, eventDate, guests, message } = cateringData;
    const content = `
        <p>A new catering inquiry has been received:</p>
        <div class="details-box">
            <div class="detail-row"><span class="detail-label">Client:</span> <span class="detail-value">${name} (${email})</span></div>
            <div class="detail-row"><span class="detail-label">Event:</span> <span class="detail-value">${eventType}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span> <span class="detail-value">${eventDate}</span></div>
            <div class="detail-row"><span class="detail-label">Guests:</span> <span class="detail-value">${guests}</span></div>
        </div>
        <p><strong>Special Requests:</strong><br/>${message}</p>
    `;
    const html = getPremiumTemplate("New Catering Inquiry", content);
    return await sendEmail({ 
        to: RESTAURANT_EMAIL, 
        replyTo: email,
        subject: `[Catering Enquiry] ${eventType} - ${name}`, 
        html
    });
};

export const sendOrderConfirmation = async (orderData) => {
    const { orderId, customerName, customerEmail, totalAmount, items, status } = orderData;
    
    console.log(`[Diagnostic] Preparing order email for: ${customerEmail}`, { orderId, customerName, totalAmount });

    const itemsList = Array.isArray(items) 
        ? items.map(item => {
            const qty = item.quantity || item.qty || 1;
            const price = parseFloat(String(item.price || 0).replace(/[^0-9.]/g, ''));
            return `<div class="detail-row"><span>${item.name} x${qty}</span><span>£${(price * qty).toFixed(2)}</span></div>`;
        }).join('')
        : `<p>Check order details in the admin dashboard.</p>`;

    const content = `
        <p>Hi ${customerName},</p>
        <p>Your order has been received and is being prepared with care.</p>
        <div class="details-box">
            <div class="detail-row"><span class="detail-label">Order ID:</span> <span class="detail-value">#${orderId}</span></div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;"/>
            ${itemsList}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;"/>
            <div class="detail-row"><span class="detail-label">Total Amount:</span> <span class="detail-value" style="font-size: 20px; color: #d9774a;">£${totalAmount}</span></div>
        </div>
        <p>Track your order status on our website!</p>
    `;

    const html = getPremiumTemplate(`Order Confirmed #${orderId}`, content);
    return await sendEmail({ to: customerEmail || RESTAURANT_EMAIL, subject: `Order Confirmed #${orderId}`, html });
};

export const verifyConnection = async () => {
    if (SENDGRID_API_KEY) return { success: true, method: 'SendGrid HTTP API' };
    
    try {
        const t = await getTransporter();
        await t.verify();
        return { success: true, method: 'SMTP', resolvedHost: resolvedHostUsed };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const sendTestEmail = async (targetEmail) => {
    console.log(`[Diagnostic] Preparing test email for: ${targetEmail}`);
    const content = `
        <p>Success! Your integrated delivery system is operational.</p>
        <div class="details-box">
            <div class="detail-row"><span class="detail-label">Active Method:</span> <span class="detail-value">${SENDGRID_API_KEY ? 'SendGrid HTTP API (Port 443)' : 'Standard SMTP'}</span></div>
            <div class="detail-row"><span class="detail-label">Network Route:</span> <span class="detail-value">Bypassing Render SMTP Block</span></div>
            <div class="detail-row"><span class="detail-label">Timestamp:</span> <span class="detail-value">${new Date().toLocaleString()}</span></div>
        </div>
    `;
    const html = getPremiumTemplate("System Diagnostics", content, "Integrated Delivery Verified");
    return await sendEmail({ to: targetEmail, subject: "Tasty Bites - Delivery Test", html });
};

export default getTransporter;
