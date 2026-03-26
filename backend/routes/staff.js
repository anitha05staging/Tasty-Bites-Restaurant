import express from 'express';
import { User } from '../models/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const router = express.Router();

// Get list of waiters (public/authenticated version for order display)
router.get('/waiters', authenticate, async (req, res) => {
    try {
        const waiters = await User.findAll({
            where: { role: 'waiter', status: 'Active' },
            attributes: ['id', 'name']
        });
        res.json(waiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all staff (waiters and chefs) - Admin only
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { Table } = await import('../models/index.js');
        const staff = await User.findAll({
            where: {
                role: {
                    [Op.in]: ['waiter', 'chef']
                }
            },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Table,
                    as: 'Tables',
                    attributes: ['id', 'number']
                }
            ]
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

        // Auto-generate staffCode and password if not provided
        const generatedPassword = password || Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        
        // Generate a random 6-character alphanumeric staff code
        const staffCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const staff = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            staffCode,
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

// Assign tables to waiter (Bulk)
router.put('/:id/tables', authenticate, isAdmin, async (req, res) => {
    try {
        const { tableIds } = req.body; // Array of table IDs
        const { Table, Order } = await import('../models/index.js');
        
        const waiter = await User.findByPk(req.params.id);
        if (!waiter || waiter.role !== 'waiter') {
            return res.status(404).json({ error: 'Waiter not found' });
        }

        // 1. Unassign all tables currently assigned to this waiter
        await Table.update(
            { waiterId: null },
            { where: { waiterId: waiter.id } }
        );

        // 2. Assign selected tables to this waiter
        if (tableIds && tableIds.length > 0) {
            await Table.update(
                { waiterId: waiter.id },
                { where: { id: { [Op.in]: tableIds } } }
            );

            // 3. Sync active orders for these newly assigned tables
            const assignedTables = await Table.findAll({
                where: { id: { [Op.in]: tableIds } }
            });

            for (const table of assignedTables) {
                await Order.update(
                    { waiterName: waiter.name },
                    { 
                        where: { 
                            tableNumber: table.number,
                            orderType: 'Dine-In',
                            status: ['Order Received', 'In Progress', 'Ready']
                        } 
                    }
                );
            }
        }

        res.json({ success: true, message: 'Tables assigned successfully' });
    } catch (error) {
        console.error('Bulk table assignment error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
