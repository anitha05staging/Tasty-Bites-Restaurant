import express from 'express';
import { Address } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/addresses
router.get('/', authenticate, async (req, res) => {
    try {
        const addresses = await Address.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });
        res.json(addresses);
    } catch (err) {
        console.error('Get addresses error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/addresses
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, type, line1, line2, landmark, city, state, zip } = req.body;
        if (!title || !line1 || !city || !zip) {
            return res.status(400).json({ error: 'Required fields: title, line1, city, zip' });
        }

        const address = await Address.create({
            userId: req.userId,
            title, type: type || 'home', line1, line2: line2 || '', landmark: landmark || '', city, state: state || '', zip
        });

        res.status(201).json(address);
    } catch (err) {
        console.error('Create address error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/addresses/:id
router.put('/:id', authenticate, async (req, res) => {
    try {
        const address = await Address.findOne({ where: { id: req.params.id, userId: req.userId } });
        if (!address) return res.status(404).json({ error: 'Address not found' });

        const { title, type, line1, line2, landmark, city, state, zip } = req.body;
        await address.update({ title, type, line1, line2, landmark, city, state, zip });

        res.json(address);
    } catch (err) {
        console.error('Update address error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/addresses/:id
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const address = await Address.findOne({ where: { id: req.params.id, userId: req.userId } });
        if (!address) return res.status(404).json({ error: 'Address not found' });

        await address.destroy();
        res.json({ success: true });
    } catch (err) {
        console.error('Delete address error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
