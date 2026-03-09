import express from 'express';
import { MenuItem } from '../models/index.js';

const router = express.Router();

// GET /api/menu
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.findAll({ order: [['popular', 'DESC'], ['name', 'ASC']] });
        // Format price as string with £ sign for frontend compatibility
        const formatted = items.map(item => ({
            ...item.toJSON(),
            price: `£${item.price.toFixed(2)}`
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Menu fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
    try {
        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ ...item.toJSON(), price: `£${item.price.toFixed(2)}` });
    } catch (err) {
        console.error('Menu item fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
