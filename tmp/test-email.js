import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

console.log('Testing SMTP connection...');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP Connection Error:');
        console.error(error);
    } else {
        console.log('✅ SMTP Server is ready to take our messages');
        
        // Try sending a test email to the RESTAURANT_EMAIL
        const mailOptions = {
            from: `"Tasty Bites Test" <${process.env.SMTP_USER}>`,
            to: process.env.RESTAURANT_EMAIL,
            subject: 'SMTP Test Email',
            text: 'This is a test email to verify SMTP configuration.',
            html: '<b>This is a test email to verify SMTP configuration.</b>',
        };

        console.log(`Sending test email to ${process.env.RESTAURANT_EMAIL}...`);
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ Error sending test email:');
                console.error(err);
            } else {
                console.log('✅ Test email sent successfully!');
                console.log('Message ID:', info.messageId);
            }
            process.exit();
        });
    }
});
