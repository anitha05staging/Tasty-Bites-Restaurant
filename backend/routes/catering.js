import express from 'express';
import { CateringEnquiry } from '../models/index.js';
import { sendCateringNotification } from '../services/email.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

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

        // Send email notification to restaurant (Awaited for serverless reliability)
        const emailSent = await sendCateringNotification({ name, email, phone, eventType, eventDate, guests, message: details });

        if (!emailSent) {
            console.error(`[Catering Enquiry] Email notification failed for ${email}`);
        }

        res.status(201).json({ success: true, message: 'Catering enquiry received successfully.' });
    } catch (err) {
        console.error('Catering enquiry error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN: GET /api/catering/admin/all (List all enquiries)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {

        const enquiries = await CateringEnquiry.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(enquiries);
    } catch (err) {
        console.error('Admin get all catering error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN: PATCH /api/catering/:id/status (Update status)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
    try {

        const { status } = req.body;
        const enquiry = await CateringEnquiry.findByPk(req.params.id);
        if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

        enquiry.status = status;
        await enquiry.save();

        res.json({ success: true, enquiry });
    } catch (err) {
        console.error('Update catering status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
