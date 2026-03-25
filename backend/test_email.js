import { sendTestEmail } from './services/email.js';
import dotenv from 'dotenv';
dotenv.config();

async function runTest() {
    try {
        console.log("Starting test email...");
        const target = process.env.RESTAURANT_EMAIL || 'tastybitesrestaurant7@gmail.com';
        const result = await sendTestEmail(target);
        console.log("Result:", result);
        process.exit(0);
    } catch (err) {
        console.error("Error running test:", err);
        process.exit(1);
    }
}

runTest();
