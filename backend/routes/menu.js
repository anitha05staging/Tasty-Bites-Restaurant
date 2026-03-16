import express from 'express';
import { MenuItem, User, sequelize } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/menu
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.findAll({ order: [['popular', 'DESC'], ['name', 'ASC']] });
        // Format price as string with £ sign for frontend compatibility
        const formatted = items.map(item => ({
            ...item.toJSON(),
            price: item.price ? `£${item.price.toFixed(2)}` : '£0.00'
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Menu fetch error:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// GET /api/menu/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await MenuItem.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
            raw: true
        });
        const list = categories.map(c => c.category).filter(Boolean);
        res.json(list);
    } catch (err) {
        console.error('Categories fetch error:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
    try {
        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ ...item.toJSON(), price: item.price ? `£${item.price.toFixed(2)}` : '£0.00' });
    } catch (err) {
        console.error('Menu item fetch error:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ADMIN: POST /api/menu (Create item)
router.post('/', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const item = await MenuItem.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        console.error('Menu create error:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ADMIN: PUT /api/menu/:id (Update item)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        await item.update(req.body);
        res.json(item);
    } catch (err) {
        console.error('Menu update error details:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ADMIN: DELETE /api/menu/:id (Delete item)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        await item.destroy();
        res.json({ success: true, message: 'Item deleted' });
    } catch (err) {
        console.error('Menu delete error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN: PATCH /api/menu/categories/update (Batch rename category)
router.patch('/categories/update', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const { oldName, newName } = req.body;
        if (!oldName || !newName) return res.status(400).json({ error: 'Missing names' });

        await MenuItem.update({ category: newName }, { where: { category: oldName } });
        res.json({ success: true });
    } catch (err) {
        console.error('Category update error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN: PATCH /api/menu/categories/delete (Batch clear category)
router.patch('/categories/delete', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const { categoryName } = req.body;
        if (!categoryName) return res.status(400).json({ error: 'Missing category name' });

        await MenuItem.update({ category: 'Uncategorized' }, { where: { category: categoryName } });
        res.json({ success: true });
    } catch (err) {
        console.error('Category delete error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
