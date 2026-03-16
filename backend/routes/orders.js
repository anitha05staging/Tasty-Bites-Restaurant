import express from 'express';
import { Order, User } from '../models/index.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../services/email.js';

const router = express.Router();

// POST /api/orders
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { items, total, deliveryFee, customerName, customerEmail, customerPhone, collectionTime, instructions, orderType, tableNumber } = req.body;
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
            orderType: orderType || 'Collection',
            tableNumber: tableNumber || null,
            status: 'Confirmed',
            paymentStatus: 'Paid'
        });

        // Send order confirmation email (Awaited for serverless reliability)
        const emailSent = await sendOrderConfirmation({
            orderId: order.orderId,
            customerName: customerName || 'Valued Customer',
            customerEmail: customerEmail || '',
            totalAmount: total,
            status: 'Confirmed',
            items: typeof items === 'string' ? JSON.parse(items) : items
        });

        if (!emailSent) {
            console.error(`[Order #${order.orderId}] Background email notification failed.`);
        }

        res.status(201).json({
            success: true,
            orderId: order.orderId,
            id: order.id
        });
    } catch (err) {
        console.error('CRITICAL: Create order error:', err);
        const logPath = path.join(process.cwd(), 'server_error.log');
        try {
            const errorEntry = `[${new Date().toISOString()}] ORDER_CREATE_FAILURE\nMessage: ${err.message}\nStack: ${err.stack}\nBody: ${JSON.stringify(req.body)}\n\n`;
            fs.appendFileSync(logPath, errorEntry);
            console.log(`Error logged to ${logPath}`);
        } catch (logErr) {
            console.error('Failed to write to error log:', logErr);
        }
        res.status(500).json({
            error: 'Server error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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

// ADMIN: GET /api/orders/all (List all orders)
router.get('/admin/all', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const orders = await Order.findAll({
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
        console.error('Admin get all orders error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADMIN: GET /api/orders/stats/summary (Dashboard stats)
router.get('/admin/stats/summary', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const totalRevenue = await Order.sum('total') || 0;
        const totalOrders = await Order.count();
        const activeOrders = await Order.count({ where: { status: ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery'] } });
        
        // Simple mock growth - in reality compare with previous period
        res.json({
            revenue: { value: `£${totalRevenue.toLocaleString()}`, growth: 12.5 },
            orders: { value: totalOrders.toString(), growth: 8.2 },
            active: { value: activeOrders.toString(), growth: -2.4 },
            avgTime: { value: '18m', growth: 5.2 }
        });
    } catch (err) {
        console.error('Get admin stats error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/orders/:orderId
router.get('/:orderId', optionalAuth, async (req, res) => {
    try {
        const whereClause = { orderId: req.params.orderId };
        if (req.userId) {
            whereClause.userId = req.userId;
        }

        const order = await Order.findOne({ where: whereClause });
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

// ADMIN: PATCH /api/orders/:orderId/status (Update order status)
router.patch('/:orderId/status', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        const { status } = req.body;
        const order = await Order.findOne({ where: { id: req.params.orderId } }); // Frontend sends the internal ID
        if (!order) return res.status(404).json({ error: 'Order not found' });

        await order.update({ status });
        res.json({ success: true, status: order.status });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
