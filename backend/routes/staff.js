import express from 'express';
import { User } from '../models/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const router = express.Router();

// Get all staff (waiters and chefs)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const staff = await User.findAll({
            where: {
                role: {
                    [Op.in]: ['waiter', 'chef']
                }
            },
            attributes: { exclude: ['password'] }
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create staff member
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        // Basic validation
        if (!['waiter', 'chef'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role for staff member' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const staff = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            status: req.body.status || 'Active'
        });

        const staffData = staff.toJSON();
        delete staffData.password;
        
        res.status(201).json(staffData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update staff member
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const staff = await User.findByPk(req.params.id);
        if (!staff || !['waiter', 'chef'].includes(staff.role)) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        const { name, email, role, phone, password, status } = req.body;
        const updates = { name, email, role, phone, status };
        
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        await staff.update(updates);
        
        const staffData = staff.toJSON();
        delete staffData.password;
        res.json(staffData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete staff member
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const staff = await User.findByPk(req.params.id);
        if (!staff || !['waiter', 'chef'].includes(staff.role)) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        await staff.destroy();
        res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
