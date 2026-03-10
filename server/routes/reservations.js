import express from 'express';
import { Reservation } from '../models/index.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { sendBookingConfirmation } from '../services/email.js';

const router = express.Router();

// POST /api/reservations
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { fullName, email, phone, date, guests, occasion, specialRequests, time } = req.body;
        if (!fullName || !email || !phone || !date || !guests) {
            return res.status(400).json({ error: 'Required fields: fullName, email, phone, date, guests' });
        }

        const bookingRef = Math.floor(100000 + Math.random() * 900000).toString();

        const reservation = await Reservation.create({
            userId: req.userId || null,
            fullName,
            email,
            phone,
            date,
            time: time || '19:00',
            guests,
            occasion: occasion || 'None',
            specialRequests: specialRequests || '',
            status: 'Upcoming',
            bookingRef
        });

        // Send confirmation email synchronously so Vercel doesn't kill the background process
        const emailSent = await sendBookingConfirmation({
            fullName,
            email,
            phone,
            date,
            time: time || '19:00', // Use the same default as for the reservation
            guests,
            occasion: occasion || 'None', // Use the same default as for the reservation
            specialRequests: specialRequests || '',
            referenceNumber: bookingRef // Use the generated bookingRef
        });

        if (!emailSent) {
            console.error("WARNING: Reservation created but email failed to send.");
        }

        res.status(201).json({
            success: true,
            bookingRef: reservation.bookingRef,
            id: reservation.id
        });
    } catch (err) {
        console.error('Create reservation error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/reservations
router.get('/', authenticate, async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.userId },
            order: [['date', 'DESC']]
        });
        res.json(reservations);
    } catch (err) {
        console.error('Get reservations error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
