import express from 'express';
import { Testimonial } from '../models/index.js';

const router = express.Router();

// GET all approved testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            where: { approved: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// POST a new testimonial
router.post('/', async (req, res) => {
    try {
        const { name, text, rating, type } = req.body;

        // Use a simple formatted date for the 'date' field
        const dateObj = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

        const newTestimonial = await Testimonial.create({
            name,
            text,
            rating,
            type: type || 'General',
            date: formattedDate,
            approved: true // Auto-approved for this project
        });

        res.status(201).json({ success: true, testimonial: newTestimonial });
    } catch (err) {
        console.error('Error creating testimonial:', err);
        res.status(500).json({ error: 'Failed to submit testimonial' });
    }
});

export default router;
