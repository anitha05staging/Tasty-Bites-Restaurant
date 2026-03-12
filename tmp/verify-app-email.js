import { sendContactNotification } from '../server/services/email.js';
import dotenv from 'dotenv';
dotenv.config();

async function testAppEmail() {
    try {
        console.log('Testing app-level email service...');
        const result = await sendContactNotification({
            name: "App Test",
            email: "test@example.com",
            phone: "1234567890",
            subject: "Direct App Verification",
            message: "This is a test message sent directly through the application's email service."
        });

        if (result) {
            console.log('✅ Email service test SUCCESSFUL');
            process.exit(0);
        } else {
            console.error('❌ Email service test FAILED (returned false)');
            process.exit(1);
        }
    } catch (err) {
        console.error('❌ CRITICAL ERROR during test:');
        console.error(err);
        process.exit(1);
    }
}

testAppEmail();
