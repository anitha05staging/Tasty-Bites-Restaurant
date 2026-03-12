import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Standard SMTP transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// The email address that should receive notifications (Admin/Restaurant)
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'anitha05staging@gmail.com';

/**
 * Send Booking Confirmation Email
 * Goes to: The Customer
 * CC: The Restaurant
 */
export const sendBookingConfirmation = async (bookingData) => {
    try {
        const { fullName, email, phone, date, time, guests, occasion, specialRequests, referenceNumber } = bookingData;

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcfcfc; padding: 40px 20px; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a2f2b; font-family: 'Times New Roman', Times, serif; font-size: 32px; margin: 0; font-style: italic;">Tasty Bites</h1>
                    <p style="color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Your Reservation is Confirmed</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-top: 4px solid #d9774a;">
                    <p style="font-size: 16px; color: #333; margin-top: 0;">Hi <strong>${fullName}</strong>,</p>
                    <p style="font-size: 15px; color: #555; line-height: 1.6;">Thank you for choosing Tasty Bites! Your table is booked and we're looking forward to hosting you.</p>
                    
                    <div style="background: #faf8f5; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #f0e6d2;">
                        <h3 style="margin-top: 0; color: #1a2f2b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">Reservation Details</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #444;">
                            <tr><td style="padding: 6px 0; color: #888;">Reference</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">#${referenceNumber}</td></tr>
                            <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${date}</td></tr>
                            <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${time}</td></tr>
                            <tr><td style="padding: 6px 0; color: #888;">Guests</td><td style="padding: 6px 0; text-align: right; font-weight: 500;">${guests} ${guests === 1 ? 'Person' : 'People'}</td></tr>
                            ${occasion && occasion !== 'No Special Occasion' ? `<tr><td style="padding: 6px 0; color: #888;">Occasion</td><td style="padding: 6px 0; text-align: right;">${occasion}</td></tr>` : ''}
                        </table>
                    </div>
                    
                    ${specialRequests ? `
                    <div style="margin-bottom: 25px;">
                        <h4 style="margin: 0 0 5px 0; color: #1a2f2b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Special Requests</h4>
                        <p style="margin: 0; font-size: 14px; color: #666; font-style: italic bg-gray-50 p-3 rounded-md border border-gray-100">"${specialRequests}"</p>
                    </div>` : ''}

                    <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 0;">Need to make changes? Call us at <strong>+44 123 456 7890</strong>.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    <p style="margin: 0;">Tasty Bites London &copy; ${new Date().getFullYear()}</p>
                    <p style="margin: 5px 0 0 0;">123 High Street, London, UK</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Tasty Bites Reservations" <${process.env.SMTP_USER}>`,
            to: email, // The customer
            cc: RESTAURANT_EMAIL, // Copy the restaurant
            subject: `Reservation Confirmed - Tasty Bites (#${referenceNumber})`,
            html,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Booking]:", error);
        return false;
    }
};

/**
 * Send Contact Form Notification
 * Goes to: The Restaurant
 */
export const sendContactNotification = async (contactData) => {
    try {
        const { name, email, phone, subject, message } = contactData;

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 40px 20px; border-radius: 12px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border-left: 5px solid #1a2f2b;">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                        <h2 style="color: #1a2f2b; margin: 0; font-size: 20px;">Support Request</h2>
                        <span style="background: #eef2f0; color: #1a2f2b; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">NEW MESSAGE</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 100px 1fr; gap: 10px; margin-bottom: 25px; font-size: 14px;">
                        <span style="color: #888;">From:</span> <strong style="color: #333;">${name}</strong>
                        <span style="color: #888;">Email:</span> <a href="mailto:${email}" style="color: #d9774a; text-decoration: none;">${email}</a>
                        <span style="color: #888;">Phone:</span> <span style="color: #333;">${phone || 'Not provided'}</span>
                        <span style="color: #888;">Subject:</span> <strong style="color: #1a2f2b;">${subject}</strong>
                    </div>

                    <div style="background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                        <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 1px;">Message Content</p>
                        <p style="margin: 0; white-space: pre-wrap; color: #444; font-size: 15px; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 25px; text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: #d9774a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to Customer</a>
                    </div>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Tasty Bites System" <${process.env.SMTP_USER}>`,
            to: RESTAURANT_EMAIL,
            replyTo: email,
            subject: `[Support] ${subject} - From ${name}`,
            html,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Contact]:", error);
        return false;
    }
};

/**
 * Send Catering Enquiry Notification
 * Goes to: The Restaurant
 */
export const sendCateringNotification = async (cateringData) => {
    try {
        const { name, email, phone, eventType, eventDate, guests, details } = cateringData;

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f6f0; padding: 40px 20px; border-radius: 12px;">
                <div style="background-color: #ffffff; padding: 35px; border-radius: 12px; box-shadow: 0 10px 30px rgba(217,119,74,0.08); border-top: 5px solid #d9774a;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #d9774a; margin: 0 0 5px 0; font-family: 'Times New Roman', serif; font-style: italic; font-size: 28px;">Catering Enquiry</h2>
                        <p style="color: #666; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Action Required</p>
                    </div>

                    <div style="background: #faf8f5; border-radius: 8px; padding: 25px; margin-bottom: 25px; border: 1px solid #f0e6d2;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            <tr><td style="padding: 10px 0; color: #777; width: 40%;">Client Name</td><td style="padding: 10px 0; color: #222; font-weight: 600; text-align: right;">${name}</td></tr>
                            <tr><td style="padding: 10px 0; color: #777;">Email</td><td style="padding: 10px 0; text-align: right;"><a href="mailto:${email}" style="color: #d9774a; text-decoration: none;">${email}</a></td></tr>
                            <tr><td style="padding: 10px 0; color: #777;">Phone</td><td style="padding: 10px 0; color: #222; text-align: right;">${phone}</td></tr>
                            <tr><td style="padding: 10px 0; border-top: 1px dashed #ddd; margin-top: 5px;"></td><td style="padding: 10px 0; border-top: 1px dashed #ddd; margin-top: 5px;"></td></tr>
                            <tr><td style="padding: 10px 0; color: #777;">Event Type</td><td style="padding: 10px 0; color: #222; font-weight: 500; text-align: right;">${eventType}</td></tr>
                            <tr><td style="padding: 10px 0; color: #777;">Event Date</td><td style="padding: 10px 0; color: #222; font-weight: 500; text-align: right;">${eventDate}</td></tr>
                            <tr><td style="padding: 10px 0; color: #777;">Est. Guests</td><td style="padding: 10px 0; color: #222; font-weight: 500; text-align: right;">${guests}</td></tr>
                        </table>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <p style="color: #888; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 1px; font-weight: 600;">Additional Details</p>
                        <div style="background: #fdfdfd; border-left: 4px solid #1a2f2b; padding: 15px; border-radius: 0 8px 8px 0; color: #444; font-size: 15px; line-height: 1.6;">
                            ${details ? String(details).replace(/\n/g, '<br/>') : '<em>No additional details provided.</em>'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Tasty Bites System" <${process.env.SMTP_USER}>`,
            to: RESTAURANT_EMAIL,
            replyTo: email,
            subject: `[Catering] New Lead: ${eventType} for ${guests} guests`,
            html,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Catering]:", error);
        return false;
    }
};

/**
 * Send Order Confirmation
 * Goes to: The Customer
 * CC: The Restaurant
 */
export const sendOrderConfirmation = async (orderData) => {
    try {
        const { orderId, customerName, customerEmail, totalAmount, status, items } = orderData;

        let itemsHtml = '';
        if (items && Array.isArray(items)) {
            itemsHtml = items.map(item => `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                        <div style="font-weight: 600; color: #333;">${item.name}</div>
                        <div style="color: #888; font-size: 13px;">Qty: ${item.qty} &times; £${Number(item.price).toFixed(2)}</div>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 500; color: #333;">
                        £${(item.price * item.qty).toFixed(2)}
                    </td>
                </tr>
            `).join('');
        }

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 40px 20px; border-radius: 12px;">
                
                <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04);">
                    <div style="background-color: #1a2f2b; padding: 35px 30px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-style: italic; font-size: 36px; color: #f0e6d2;">Tasty Bites</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #a4b4b0;">Order Confirmed</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333; margin-top: 0; margin-bottom: 25px;">Hi <strong>${customerName}</strong>,<br/>Thanks for dining with us! We have received your order.</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #fafafa; border: 1px solid #eee; padding: 15px 20px; border-radius: 8px; margin-bottom: 25px;">
                            <div>
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 4px;">Order ID</span>
                                <strong style="font-size: 16px; color: #1a2f2b;">#${orderId}</strong>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 4px;">Status</span>
                                <span style="background-color: #e6f4ea; color: #1e8e3e; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">${status.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <h3 style="font-size: 15px; color: #1a2f2b; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-bottom: 10px; margin-top: 0;">Receipt Summary</h3>
                        
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            ${itemsHtml}
                            <tr>
                                <td style="padding: 20px 0 5px 0; font-weight: 600; color: #555; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Total Paid</td>
                                <td style="padding: 20px 0 5px 0; font-weight: 800; text-align: right; font-size: 20px; color: #d9774a;">£${Number(totalAmount).toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #fafafa; padding: 20px 30px; border-top: 1px solid #eee; text-align: center;">
                        <p style="margin: 0; color: #777; font-size: 13px; line-height: 1.5;">
                            We bring the magic of our hometown dishes to the heart of the UK.<br/>
                            Need help? Call <a href="tel:+441234567890" style="color: #d9774a; text-decoration: none;">+44 123 456 7890</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        if (!customerEmail) {
            console.log(`[Order #${orderId}] No customer email provided, only notifying restaurant.`);
            await transporter.sendMail({
                from: `"Tasty Bites Orders" <${process.env.SMTP_USER}>`,
                to: RESTAURANT_EMAIL,
                subject: `New Dine-In/Order Notification #${orderId}`,
                html: `<h3>New Order Received</h3><p>Order ID: #${orderId}</p><p>Total: £${Number(totalAmount).toFixed(2)}</p><p>Please check the admin panel for details.</p>`,
            });
            return true;
        }

        await transporter.sendMail({
            from: `"Tasty Bites Orders" <${process.env.SMTP_USER}>`,
            to: customerEmail,
            cc: RESTAURANT_EMAIL,
            subject: `Receipt for your Tasty Bites Order #${orderId}`,
            html,
        });
        return true;
    } catch (error) {
        console.error("Email send error [Order]:", error);
        return false;
    }
};

/**
 * Verify SMTP Connection
 */
export const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ SMTP connection verified successfully.");
        return { success: true };
    } catch (error) {
        console.error("❌ SMTP connection verification failed:", error);
        return { success: false, error: error.message };
    }
};

// Export transporter for health check verification if needed
export default transporter;
