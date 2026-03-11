import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
    orderId: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    items: { type: DataTypes.TEXT, allowNull: false }, // JSON stringified
    total: { type: DataTypes.FLOAT, allowNull: false },
    deliveryFee: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.ENUM('Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled', 'Served'), defaultValue: 'Placed' },
    paymentStatus: { type: DataTypes.ENUM('Pending', 'Paid', 'Failed'), defaultValue: 'Paid' },
    customerName: { type: DataTypes.STRING, defaultValue: '' },
    customerEmail: { type: DataTypes.STRING, defaultValue: '' },
    customerPhone: { type: DataTypes.STRING, defaultValue: '' },
    orderType: { type: DataTypes.ENUM('Collection', 'Dine-In', 'Delivery'), defaultValue: 'Collection' },
    tableNumber: { type: DataTypes.STRING, allowNull: true },
    collectionTime: { type: DataTypes.STRING, defaultValue: '' },
    instructions: { type: DataTypes.TEXT, defaultValue: '' }
}, { timestamps: true });

export default Order;
