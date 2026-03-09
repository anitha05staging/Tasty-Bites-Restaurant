import express from 'express';
import { Order } from '../models/index.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../services/email.js';

const router = express.Router();

// POST /api/orders
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { items, total, deliveryFee, customerName, customerEmail, customerPhone, collectionTime, instructions } = req.body;
        if (!items || !total) {
            return res.status(400).json({ error: 'Items and total are required' });
        }
        // Generate sequential order ID
        const lastOrder = await Order.findOne({
            order: [['id', 'DESC']]
        });
        const orderId = lastOrder ? (lastOrder.id + 1).toString() : '1';
        const order = await Order.create({
            orderId,
            userId: req.userId || null,
            items: typeof items === 'string' ? items : JSON.stringify(items),
            total,
            deliveryFee: deliveryFee || 0,
            customerName: customerName || '',
            customerEmail: customerEmail || '',
            customerPhone: customerPhone || '',
            collectionTime: collectionTime || '',
            instructions: instructions || '',
            status: 'Confirmed',
            paymentStatus: 'Paid'
        });

        // Send order confirmation email asynchronously
        sendOrderConfirmation({
            orderId: order.orderId,
            customerName: customerName || 'Valued Customer',
            customerEmail: customerEmail || '',
            totalAmount: total,
            status: 'Confirmed',
            items: typeof items === 'string' ? JSON.parse(items) : items
        });

        res.status(201).json({
            success: true,
            orderId: order.orderId,
            id: order.id
        });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/orders
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']]
        });

        const formatted = orders.map(o => ({
            ...o.toJSON(),
            items: JSON.parse(o.items),
            date: o.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + o.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            contact: { phone: o.customerPhone, email: o.customerEmail }
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/orders/:orderId
router.get('/:orderId', authenticate, async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderId: req.params.orderId, userId: req.userId }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.json({
            ...order.toJSON(),
            items: JSON.parse(order.items),
            date: order.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + order.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            contact: { phone: order.customerPhone, email: order.customerEmail }
        });
    } catch (err) {
        console.error('Get order error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
