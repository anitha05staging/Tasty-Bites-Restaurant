import express from 'express';
import { Table, User } from '../models/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.findAll({
            include: [
                {
                    model: User,
                    as: 'waiter',
                    attributes: ['id', 'name', 'role']
                }
            ],
            order: [['number', 'ASC']]
        });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create table
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const table = await Table.create(req.body);
        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update table
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const table = await Table.findByPk(req.params.id);
        if (!table) return res.status(404).json({ error: 'Table not found' });
        
        await table.update(req.body);
        res.json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete table
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const table = await Table.findByPk(req.params.id);
        if (!table) return res.status(404).json({ error: 'Table not found' });
        
        await table.destroy();
        res.json({ message: 'Table deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
