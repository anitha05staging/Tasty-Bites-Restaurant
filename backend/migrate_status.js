
import { Order } from './models/index.js';

async function migrateOrders() {
    try {
        const count = await Order.update(
            { status: 'Preparing' },
            { where: { status: 'In Progress' } }
        );
        console.log(`Successfully migrated ${count[0]} orders from 'In Progress' to 'Preparing'.`);
        
        const count2 = await Order.update(
            { status: 'Order Received' },
            { where: { status: 'Pending' } }
        );
        console.log(`Successfully migrated ${count2[0]} orders from 'Pending' to 'Order Received'.`);

        const count3 = await Order.update(
            { status: 'Order Received' },
            { where: { status: 'Confirmed' } }
        );
        console.log(`Successfully migrated ${count3[0]} orders from 'Confirmed' to 'Order Received'.`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrateOrders();
