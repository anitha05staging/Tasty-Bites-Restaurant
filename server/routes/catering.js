import express from 'express';
import { CateringEnquiry } from '../models/index.js';
import { sendCateringNotification } from '../services/email.js';

const router = express.Router();

// POST /api/catering
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, eventType, eventDate, guests, budget, details } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Required fields: name, email, phone' });
        }

        const enquiry = await CateringEnquiry.create({
            name, email, phone,
            eventType,
            eventDate: eventDate || null,
            guests: guests || null,
            budget: budget || '',
            details: details || ''
        });

        // Send email notification to restaurant
        sendCateringNotification({ name, email, phone, eventType, eventDate, guests, details });

        res.status(201).json({ success: true, message: 'Catering enquiry received successfully.' });
    } catch (err) {
        console.error('Catering enquiry error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
