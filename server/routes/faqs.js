import express from 'express';
import { FAQ } from '../models/index.js';

const router = express.Router();

// GET all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.findAll({
            order: [['category', 'ASC'], ['createdAt', 'ASC']]
        });

        // Group by category for the frontend
        const groupedFaqs = faqs.reduce((acc, faq) => {
            if (!acc[faq.category]) {
                acc[faq.category] = [];
            }
            acc[faq.category].push({ q: faq.question, a: faq.answer });
            return acc;
        }, {});

        res.json(groupedFaqs);
    } catch (err) {
        console.error('Error fetching FAQs:', err);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
});

export default router;
