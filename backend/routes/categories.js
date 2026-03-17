import express from 'express';
import { Category, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST new category (Admin)
router.post('/', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const { name, description, image, active } = req.body;
        const category = await Category.create({ name, description, image, active });
        res.status(201).json(category);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Failed to create category: ' + err.message });
    }
});

// PUT update category (Admin)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        await category.update(req.body);
        res.json(category);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE category (Admin)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        await category.destroy();
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
