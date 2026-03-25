import express from 'express';
import { Reservation, User } from '../models/index.js';
import { authenticate, optionalAuth, isAdmin } from '../middleware/auth.js';
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

// ADMIN: GET /api/reservations/admin/all (List all reservations)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {

        const reservations = await Reservation.findAll({
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        res.json(reservations);
    } catch (err) {
        console.error('Admin get all reservations error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/reservations
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found or session expired' });
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

// ADMIN: PATCH /api/reservations/:id/status (Update reservation status)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
    try {

        const { status } = req.body;
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

        await reservation.update({ status });
        res.json({ success: true, status: reservation.status });
    } catch (err) {
        console.error('Update reservation status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
