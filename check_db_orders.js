import { Order } from './backend/models/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function checkOrders() {
    try {
        const orders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });
        console.log('--- RECENT ORDERS ---');
        orders.forEach(o => {
            console.log(`ID: ${o.id}, OrderID: ${o.orderId}, Status: ${o.status}`);
            console.log(`Items (Raw): ${o.items}`);
            try {
                const parsed = JSON.parse(o.items);
                console.log(`Items (Parsed Count): ${parsed.length}`);
            } catch (e) {
                console.log(`Items (PARSE FAILED): ${e.message}`);
            }
            console.log('---');
        });
    } catch (err) {
        console.error('Error checking orders:', err);
    } finally {
        process.exit();
    }
}

checkOrders();
